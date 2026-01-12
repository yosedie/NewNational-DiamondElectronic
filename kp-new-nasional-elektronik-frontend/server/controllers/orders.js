const prisma = require("../utills/db");
const { asyncHandler, AppError } = require("../utills/errorHandler");

const generateInvoiceNumber = asyncHandler(async () => {
  const today = new Date();
  const dateStr = today.toISOString().split('T')[0].replace(/-/g, '');
  
  const lastOrder = await prisma.order.findFirst({
    where: {
      invoiceNumber: {
        startsWith: `INV-${dateStr}`
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  let sequence = 1;
  if (lastOrder) {
    const lastSeq = parseInt(lastOrder.invoiceNumber.split('-')[2]);
    sequence = lastSeq + 1;
  }

  return `INV-${dateStr}-${String(sequence).padStart(5, '0')}`;
});

const createOrder = asyncHandler(async (request, response) => {
  const { 
    userId, 
    productId, 
    quantity, 
    name, 
    lastname, 
    email, 
    phone, 
    adress, 
    city, 
    country, 
    postalCode, 
    total 
  } = request.body;

  // Validation - Check all required fields
  const errors = [];

  if (!name || name.trim().length === 0) {
    errors.push({ field: "name", message: "name is required" });
  }
  if (!lastname || lastname.trim().length === 0) {
    errors.push({ field: "lastname", message: "lastname is required" });
  }
  if (!email || email.trim().length === 0) {
    errors.push({ field: "email", message: "Email is required" });
  }
  if (!phone || phone.trim().length === 0) {
    errors.push({ field: "phone", message: "Phone number is required" });
  }
  if (!adress || adress.trim().length === 0) {
    errors.push({ field: "adress", message: "adress is required" });
  }
  if (!city || city.trim().length === 0) {
    errors.push({ field: "city", message: "city is required" });
  }
  if (!country || country.trim().length === 0) {
    errors.push({ field: "country", message: "country is required" });
  }
  if (!postalCode || postalCode.toString().trim().length === 0) {
    errors.push({ field: "postalCode", message: "Postal code is required" });
  }
  if (!userId || userId.toString().trim().length === 0) {
    errors.push({ field: "userId", message: "userId is required" });
  }
  if (!productId || productId.toString().trim().length === 0) {
    errors.push({ field: "productId", message: "productId is required" });
  }
  if (!quantity || quantity <= 0) {
    errors.push({ field: "quantity", message: "quantity must be greater than 0" });
  }
  if (!total || total <= 0) {
    errors.push({ field: "total", message: "Total amount is required" });
  }

  if (errors.length > 0) {
    throw new AppError("Validation failed", 400, errors);
  }

  // Validate user exists
  const user = await prisma.user.findUnique({
    where: { id: userId }
  });
  if (!user) {
    throw new AppError("User not found", 404);
  }

  // Validate product exists and check stock
  const product = await prisma.product.findUnique({
    where: { id: productId }
  });
  if (!product) {
    throw new AppError("Product not found", 404);
  }

  if (product.stock <= 0) {
    throw new AppError("Product out of stock", 400);
  }

  if (product.stock < quantity) {
    throw new AppError(`Insufficient stock, only ${product.stock} available`, 400);
  }

  // Validate total price matches
  const expectedTotal = product.price * quantity;
  if (parseInt(total) !== expectedTotal) {
    throw new AppError(`Total amount mismatch. Expected: ${expectedTotal}, Got: ${total}`, 400);
  }

  // Generate invoice number
  const invoiceNumber = await generateInvoiceNumber();

  // Create order (stock NOT reduced yet - only after payment)
  const order = await prisma.order.create({
    data: {
      invoiceNumber,
      status: "PENDING",
      userId,
      totalPrice: total,
      name: name.trim(),
      lastname: lastname.trim(),
      email: email.trim(),
      phone: phone.trim(),
      adress: adress.trim(),
      city: city.trim(),
      country: country.trim(),
      postalCode: postalCode.toString().trim(),
      products: {
        create: {
          productId,
          quantity
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

  return response.status(201).json({
    id: order.id,
    invoiceNumber: order.invoiceNumber,
    status: order.status,
    userId: order.userId,
    productId,
    quantity,
    totalPrice: order.totalPrice,
    name: order.name,
    email: order.email,
    createdAt: order.createdAt
  });
});

const getOrder = asyncHandler(async (request, response) => {
  const { id } = request.params;

  if (!id) {
    throw new AppError("Order ID is required", 400);
  }

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      products: {
        include: {
          product: true
        }
      }
    }
  });

  if (!order) {
    throw new AppError("Order not found", 404);
  }

  return response.status(200).json(order);
});

const getUserOrders = asyncHandler(async (request, response) => {
  const { userId } = request.params;

  if (!userId) {
    throw new AppError("User ID is required", 400);
  }

  const orders = await prisma.order.findMany({
    where: { userId },
    include: {
      products: {
        include: {
          product: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  return response.status(200).json({
    data: orders,
    total: orders.length
  });
});

const updateOrderStatus = asyncHandler(async (request, response) => {
  const { id } = request.params;
  const { status } = request.body;

  if (!id) {
    throw new AppError("Order ID is required", 400);
  }

  if (!status) {
    throw new AppError("Status is required", 400);
  }

  const validStatuses = ["PENDING", "PROCESSING", "PROCESSED", "SHIPPED", "DELIVERED", "CANCELLED"];
  if (!validStatuses.includes(status)) {
    throw new AppError(`Invalid status. Must be one of: ${validStatuses.join(", ")}`, 400);
  }

  const order = await prisma.order.findUnique({
    where: { id }
  });

  if (!order) {
    throw new AppError("Order not found", 404);
  }

  const updatedOrder = await prisma.order.update({
    where: { id },
    data: { status },
    include: {
      products: {
        include: {
          product: true
        }
      }
    }
  });

  return response.status(200).json(updatedOrder);
});

module.exports = {
  createOrder,
  getOrder,
  getUserOrders,
  updateOrderStatus,
  generateInvoiceNumber
};
