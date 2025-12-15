const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const midtransClient = require('midtrans-client');
const { validateOrderData } = require('../utills/validation');

// Initialize Midtrans Snap
const snap = new midtransClient.Snap({
  isProduction: process.env.MIDTRANS_IS_PRODUCTION === 'true',
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY
});

/**
 * Create Midtrans transaction and order
 * This endpoint creates an order in the database and generates a Midtrans Snap token
 */
async function createTransaction(request, response) {
  try {
    console.log("=== MIDTRANS TRANSACTION REQUEST ===");
    console.log("Request body:", JSON.stringify(request.body, null, 2));

    // Validate request body
    if (!request.body || typeof request.body !== 'object') {
      console.log("❌ Invalid request body");
      return response.status(400).json({ 
        error: "Invalid request body",
        details: "Request body must be a valid JSON object"
      });
    }

    const { orderData, items } = request.body;

    if (!orderData || !items || !Array.isArray(items) || items.length === 0) {
      return response.status(400).json({
        error: "Invalid request",
        details: "orderData and items array are required"
      });
    }

    // Validate order data
    const validation = validateOrderData(orderData);
    console.log("Validation result:", validation);
    
    if (!validation.isValid) {
      console.log("❌ Validation failed:", validation.errors);
      return response.status(400).json({
        error: "Validation failed",
        details: validation.errors
      });
    }

    const validatedData = validation.validatedData;

    // Additional business logic validation
    if (validatedData.total < 0.01) {
      return response.status(400).json({
        error: "Invalid order total",
        details: [{ field: 'total', message: 'Order total must be at least 0.01' }]
      });
    }

    // Check for duplicate orders (same email and total within last 5 minutes)
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    const duplicateOrder = await prisma.customer_order.findFirst({
      where: {
        email: validatedData.email,
        total: validatedData.total,
        dateTime: {
          gte: fiveMinutesAgo
        }
      }
    });

    if (duplicateOrder) {
      console.log("❌ Duplicate order detected");
      return response.status(409).json({
        error: "Duplicate order detected",
        details: "An order with the same email and total was created recently. Please wait before creating another order."
      });
    }

    console.log("Creating order in database...");
    // Create the order with validated data
    const order = await prisma.customer_order.create({
      data: {
        name: validatedData.name,
        lastname: validatedData.lastname,
        phone: validatedData.phone,
        email: validatedData.email,
        adress: validatedData.adress,
        postalCode: validatedData.postalCode,
        status: 'pending',
        city: validatedData.city,
        country: validatedData.country,
        orderNotice: validatedData.orderNotice || '',
        total: validatedData.total,
        dateTime: new Date()
      },
    });

    console.log("✅ Order created successfully:", order.id);

    // Prepare item details for Midtrans
    const itemDetails = items.map(item => ({
      id: item.id,
      price: item.price,
      quantity: item.quantity,
      name: item.name
    }));

    // Calculate total from items to ensure consistency
    const calculatedTotal = itemDetails.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // Prepare Midtrans transaction parameters
    const parameter = {
      transaction_details: {
        order_id: order.id,
        gross_amount: calculatedTotal
      },
      customer_details: {
        first_name: validatedData.name,
        last_name: validatedData.lastname,
        email: validatedData.email,
        phone: validatedData.phone,
        billing_address: {
          first_name: validatedData.name,
          last_name: validatedData.lastname,
          email: validatedData.email,
          phone: validatedData.phone,
          address: validatedData.adress,
          city: validatedData.city,
          postal_code: validatedData.postalCode,
          country_code: 'IDN'
        },
        shipping_address: {
          first_name: validatedData.name,
          last_name: validatedData.lastname,
          email: validatedData.email,
          phone: validatedData.phone,
          address: validatedData.adress,
          city: validatedData.city,
          postal_code: validatedData.postalCode,
          country_code: 'IDN'
        }
      },
      item_details: itemDetails,
      callbacks: {
        finish: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/payment/finish`,
        error: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/payment/error`,
        pending: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/payment/pending`
      }
    };

    console.log("Creating Midtrans transaction...");
    console.log("Transaction parameters:", JSON.stringify(parameter, null, 2));

    // Create Midtrans Snap transaction
    const transaction = await snap.createTransaction(parameter);
    console.log("✅ Midtrans transaction created:", transaction);

    // Add products to order
    console.log("Adding products to order...");
    for (const item of items) {
      await prisma.customer_order_product.create({
        data: {
          customerOrderId: order.id,
          productId: item.id,
          quantity: item.quantity
        }
      });
      console.log(`✅ Product ${item.id} added to order`);
    }

    return response.status(201).json({
      success: true,
      orderId: order.id,
      snapToken: transaction.token,
      redirectUrl: transaction.redirect_url
    });

  } catch (error) {
    console.error("❌ Error creating Midtrans transaction:", error);
    
    // Handle Midtrans specific errors
    if (error.httpStatusCode) {
      return response.status(error.httpStatusCode).json({
        error: "Payment gateway error",
        details: error.ApiResponse?.error_messages || [error.message]
      });
    }

    // Handle Prisma errors
    if (error.code === 'P2002') {
      return response.status(409).json({ 
        error: "Order conflict",
        details: "An order with this information already exists"
      });
    }

    return response.status(500).json({ 
      error: "Internal server error",
      details: "Failed to create transaction. Please try again later."
    });
  }
}

/**
 * Handle Midtrans notification/webhook
 * This endpoint receives payment status updates from Midtrans
 */
async function handleNotification(request, response) {
  try {
    console.log("=== MIDTRANS NOTIFICATION ===");
    console.log("Notification body:", JSON.stringify(request.body, null, 2));

    const statusResponse = await snap.transaction.notification(request.body);
    console.log("Status response:", statusResponse);

    const orderId = statusResponse.order_id;
    const transactionStatus = statusResponse.transaction_status;
    const fraudStatus = statusResponse.fraud_status;

    console.log(`Transaction notification received. Order ID: ${orderId}. Transaction status: ${transactionStatus}. Fraud status: ${fraudStatus}`);

    // Determine order status based on transaction status
    let orderStatus = 'pending';

    if (transactionStatus === 'capture') {
      if (fraudStatus === 'accept') {
        orderStatus = 'paid';
      }
    } else if (transactionStatus === 'settlement') {
      orderStatus = 'paid';
    } else if (transactionStatus === 'cancel' || transactionStatus === 'deny' || transactionStatus === 'expire') {
      orderStatus = 'cancelled';
    } else if (transactionStatus === 'pending') {
      orderStatus = 'pending';
    }

    // Update order status in database
    const updatedOrder = await prisma.customer_order.update({
      where: { id: orderId },
      data: { status: orderStatus }
    });

    console.log(`✅ Order ${orderId} status updated to: ${orderStatus}`);

    return response.status(200).json({
      success: true,
      message: 'Notification processed successfully'
    });

  } catch (error) {
    console.error("❌ Error processing notification:", error);
    return response.status(500).json({
      error: "Failed to process notification",
      details: error.message
    });
  }
}

module.exports = {
  createTransaction,
  handleNotification
};
