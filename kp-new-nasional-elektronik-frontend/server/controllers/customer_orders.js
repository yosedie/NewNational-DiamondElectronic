const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { validateOrderData, ValidationError } = require('../utills/validation');

async function createCustomerOrder(request, response) {
  try {
    console.log("=== ORDER CREATION REQUEST ===");
    console.log("Request body:", JSON.stringify(request.body, null, 2));
    
    // Validate request body
    if (!request.body || typeof request.body !== 'object') {
      console.log("❌ Invalid request body");
      return response.status(400).json({ 
        error: "Invalid request body",
        details: "Request body must be a valid JSON object"
      });
    }

    // Server-side validation
    const validation = validateOrderData(request.body);
    console.log("Validation result:", validation);
    
    if (!validation.isValid) {
      console.log("❌ Validation failed:", validation.errors);
      return response.status(400).json({
        error: "Validation failed",
        details: validation.errors
      });
    }

    const validatedData = validation.validatedData;
    console.log("✅ Validation passed, validated data:", validatedData);

    // Additional business logic validation
    if (validatedData.total < 0.01) {
      console.log("❌ Invalid total amount");
      return response.status(400).json({
        error: "Invalid order total",
        details: [{ field: 'total', message: 'Order total must be at least $0.01' }]
      });
    }

    // ===== PRODUCT VALIDATION =====
    const { productId, quantity } = request.body;

    // Validate productId is provided
    if (!productId) {
      console.log("❌ Product ID is required");
      return response.status(400).json({
        error: "Validation failed",
        details: [{ field: 'productId', message: 'Product ID is required' }]
      });
    }

    // Validate quantity is provided and valid
    if (!quantity || quantity <= 0) {
      console.log("❌ Invalid quantity");
      return response.status(400).json({
        error: "Validation failed",
        details: [{ field: 'quantity', message: 'Quantity must be greater than 0' }]
      });
    }

    // Check if product exists
    console.log(`Checking product: ${productId}`);
    const product = await prisma.product.findUnique({
      where: { id: productId }
    });

    if (!product) {
      console.log("❌ Product not found");
      return response.status(404).json({
        error: "Product not found",
        details: `Product with ID ${productId} does not exist`
      });
    }

    console.log(`✅ Product found: ${product.title}, Stock: ${product.inStock}, Price: ${product.price}`);

    // Check if product is in stock
    if (product.inStock <= 0) {
      console.log("❌ Product out of stock");
      return response.status(400).json({
        error: "Product out of stock",
        details: `Product "${product.title}" is currently out of stock`
      });
    }

    // Check if quantity exceeds available stock
    if (quantity > product.inStock) {
      console.log(`❌ Insufficient stock: requested ${quantity}, available ${product.inStock}`);
      return response.status(400).json({
        error: "Insufficient stock",
        details: `Insufficient stock, only ${product.inStock} available`
      });
    }

    console.log("✅ Product validation passed");

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
    // Create the order with validated data and product relationship
    const corder = await prisma.customer_order.create({
      data: {
        name: validatedData.name,
        lastname: validatedData.lastname,
        phone: validatedData.phone,
        email: validatedData.email,
        adress: validatedData.adress,
        postalCode: validatedData.postalCode,
        status: validatedData.status,
        city: validatedData.city,
        country: validatedData.country,
        orderNotice: validatedData.orderNotice,
        total: validatedData.total,
        dateTime: new Date(),
        products: {
          create: {
            productId: productId,
            quantity: quantity
          }
        }
      },
      include: {
        products: {
          include: {
            product: true
          }
        }
      }
    });

    console.log("✅ Order created successfully:", corder);
    console.log("Order ID:", corder.id);

    // Log successful order creation (for monitoring)
    console.log(`Order created successfully: ID ${corder.id}, Email: ${validatedData.email}, Total: $${validatedData.total}, Product: ${product.title}, Quantity: ${quantity}`);

    const responseData = {
      id: corder.id,
      message: "Order created successfully",
      orderNumber: corder.id,
      product: {
        id: product.id,
        title: product.title,
        price: product.price
      },
      quantity: quantity,
      total: validatedData.total
    };
    
    console.log("Sending response:", responseData);
    return response.status(201).json(responseData);

  } catch (error) {
    console.error("❌ Error creating order:", error);
    
    // Handle specific Prisma errors
    if (error.code === 'P2002') {
      return response.status(409).json({ 
        error: "Order conflict",
        details: "An order with this information already exists"
      });
    }

    // Handle validation errors
    if (error instanceof ValidationError) {
      return response.status(400).json({
        error: "Validation failed",
        details: [{ field: error.field, message: error.message }]
      });
    }

    // Generic error response
    return response.status(500).json({ 
      error: "Internal server error",
      details: "Failed to create order. Please try again later."
    });
  }
}

async function updateCustomerOrder(request, response) {
  try {
    const { id } = request.params;
    
    // Validate ID format
    if (!id || typeof id !== 'string') {
      return response.status(400).json({
        error: "Invalid order ID",
        details: "Order ID must be provided"
      });
    }

    // Validate request body
    if (!request.body || typeof request.body !== 'object') {
      return response.status(400).json({ 
        error: "Invalid request body",
        details: "Request body must be a valid JSON object"
      });
    }

    // Server-side validation for update data
    const validation = validateOrderData(request.body);
    
    if (!validation.isValid) {
      return response.status(400).json({
        error: "Validation failed",
        details: validation.errors
      });
    }

    const validatedData = validation.validatedData;

    const existingOrder = await prisma.customer_order.findUnique({
      where: {
        id: id,
      },
    });

    if (!existingOrder) {
      return response.status(404).json({ 
        error: "Order not found",
        details: "The specified order does not exist"
      });
    }

    const updatedOrder = await prisma.customer_order.update({
      where: {
        id: existingOrder.id,
      },
      data: {
        name: validatedData.name,
        lastname: validatedData.lastname,
        phone: validatedData.phone,
        email: validatedData.email,
        adress: validatedData.adress,
        postalCode: validatedData.postalCode,
        status: validatedData.status,
        city: validatedData.city,
        country: validatedData.country,
        orderNotice: validatedData.orderNotice,
        total: validatedData.total,
      },
    });

    console.log(`Order updated successfully: ID ${updatedOrder.id}`);

    return response.status(200).json(updatedOrder);
  } catch (error) {
    console.error("Error updating order:", error);
    
    if (error.code === 'P2025') {
      return response.status(404).json({ 
        error: "Order not found",
        details: "The specified order does not exist"
      });
    }

    if (error instanceof ValidationError) {
      return response.status(400).json({
        error: "Validation failed",
        details: [{ field: error.field, message: error.message }]
      });
    }

    return response.status(500).json({ 
      error: "Internal server error",
      details: "Failed to update order. Please try again later."
    });
  }
}

async function deleteCustomerOrder(request, response) {
  try {
    const { id } = request.params;
    
    if (!id || typeof id !== 'string') {
      return response.status(400).json({
        error: "Invalid order ID",
        details: "Order ID must be provided"
      });
    }

    const existingOrder = await prisma.customer_order.findUnique({
      where: { id: id },
    });

    if (!existingOrder) {
      return response.status(404).json({ 
        error: "Order not found",
        details: "The specified order does not exist"
      });
    }

    await prisma.customer_order.delete({
      where: {
        id: id,
      },
    });

    console.log(`Order deleted successfully: ID ${id}`);
    return response.status(204).send();
  } catch (error) {
    console.error("Error deleting order:", error);
    
    if (error.code === 'P2025') {
      return response.status(404).json({ 
        error: "Order not found",
        details: "The specified order does not exist"
      });
    }

    return response.status(500).json({ 
      error: "Internal server error",
      details: "Failed to delete order. Please try again later."
    });
  }
}

async function getCustomerOrder(request, response) {
  try {
    const { id } = request.params;
    
    if (!id || typeof id !== 'string') {
      return response.status(400).json({
        error: "Invalid order ID",
        details: "Order ID must be provided"
      });
    }

    const order = await prisma.customer_order.findUnique({
      where: {
        id: id,
      },
    });
    
    if (!order) {
      return response.status(404).json({ 
        error: "Order not found",
        details: "The specified order does not exist"
      });
    }
    
    return response.status(200).json(order);
  } catch (error) {
    console.error("Error fetching order:", error);
    return response.status(500).json({ 
      error: "Internal server error",
      details: "Failed to fetch order. Please try again later."
    });
  }
}

async function getAllOrders(request, response) {
  try {
    // Add pagination and filtering for better performance
    const page = parseInt(request.query.page) || 1;
    const limit = parseInt(request.query.limit) || 50;
    const offset = (page - 1) * limit;
    
    // Validate pagination parameters
    if (page < 1 || limit < 1 || limit > 100) {
      return response.status(400).json({
        error: "Invalid pagination parameters",
        details: "Page must be >= 1, limit must be between 1 and 100"
      });
    }

    const [orders, totalCount] = await Promise.all([
      prisma.customer_order.findMany({
        skip: offset,
        take: limit,
        orderBy: {
          dateTime: 'desc'
        }
      }),
      prisma.customer_order.count()
    ]);

    return response.json({
      orders,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit)
      }
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return response.status(500).json({ 
      error: "Internal server error",
      details: "Failed to fetch orders. Please try again later."
    });
  }
}

// Get orders for a specific user by email (TS-ORD-009)
async function getUserOrders(request, response) {
  try {
    const { email } = request.params;
    
    if (!email || typeof email !== 'string') {
      return response.status(400).json({
        error: "Invalid email",
        details: "Email parameter is required"
      });
    }

    // Add pagination
    const page = parseInt(request.query.page) || 1;
    const limit = parseInt(request.query.limit) || 20;
    const offset = (page - 1) * limit;

    const [orders, totalCount] = await Promise.all([
      prisma.customer_order.findMany({
        where: {
          email: email
        },
        skip: offset,
        take: limit,
        orderBy: {
          dateTime: 'desc'
        },
        include: {
          customer_order_product: {
            include: {
              Product: {
                select: {
                  id: true,
                  title: true,
                  price: true,
                  image: true
                }
              }
            }
          }
        }
      }),
      prisma.customer_order.count({
        where: {
          email: email
        }
      })
    ]);

    console.log(`Retrieved ${orders.length} orders for user: ${email}`);

    return response.status(200).json({
      orders,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit)
      }
    });
  } catch (error) {
    console.error("Error fetching user orders:", error);
    return response.status(500).json({ 
      error: "Internal server error",
      details: "Failed to fetch user orders. Please try again later."
    });
  }
}

// Get order details with product information (enhanced for TS-ORD-010)
async function getOrderDetails(request, response) {
  try {
    const { id } = request.params;
    
    if (!id || typeof id !== 'string') {
      return response.status(400).json({
        error: "Invalid order ID",
        details: "Order ID must be provided"
      });
    }

    const order = await prisma.customer_order.findUnique({
      where: {
        id: id,
      },
      include: {
        customer_order_product: {
          include: {
            Product: {
              select: {
                id: true,
                title: true,
                price: true,
                image: true,
                description: true,
                inStock: true
              }
            }
          }
        }
      }
    });
    
    if (!order) {
      return response.status(404).json({ 
        error: "Order not found",
        details: "The specified order does not exist"
      });
    }

    console.log(`Order details retrieved: ID ${order.id}`);
    
    return response.status(200).json(order);
  } catch (error) {
    console.error("Error fetching order details:", error);
    return response.status(500).json({ 
      error: "Internal server error",
      details: "Failed to fetch order details. Please try again later."
    });
  }
}

// Update order status (admin only - TS-ORD-011, TS-ORD-012)
async function updateOrderStatus(request, response) {
  try {
    const { id } = request.params;
    const { status } = request.body;
    
    if (!id || typeof id !== 'string') {
      return response.status(400).json({
        error: "Invalid order ID",
        details: "Order ID must be provided"
      });
    }

    // Validate status
    const allowedStatuses = ['PENDING', 'PAID', 'SHIPPED', 'COMPLETED', 'CANCELLED'];
    if (!status || !allowedStatuses.includes(status)) {
      return response.status(400).json({
        error: "Invalid status",
        details: `Status must be one of: ${allowedStatuses.join(', ')}`
      });
    }

    // Check if order exists
    const existingOrder = await prisma.customer_order.findUnique({
      where: { id: id },
    });

    if (!existingOrder) {
      return response.status(404).json({ 
        error: "Order not found",
        details: "The specified order does not exist"
      });
    }

    // Update only the status field
    const updatedOrder = await prisma.customer_order.update({
      where: {
        id: id,
      },
      data: {
        status: status,
      },
    });

    console.log(`Order status updated: ID ${updatedOrder.id}, Status: ${status}`);

    return response.status(200).json({
      message: "Order status updated successfully",
      order: updatedOrder
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    
    if (error.code === 'P2025') {
      return response.status(404).json({ 
        error: "Order not found",
        details: "The specified order does not exist"
      });
    }

    return response.status(500).json({ 
      error: "Internal server error",
      details: "Failed to update order status. Please try again later."
    });
  }
}

module.exports = {
  createCustomerOrder,
  updateCustomerOrder,
  deleteCustomerOrder,
  getCustomerOrder,
  getAllOrders,
  getUserOrders,
  getOrderDetails,
  updateOrderStatus,
};