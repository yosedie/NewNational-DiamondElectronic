# Payment & Order Management API Testing Guide

**Test Cases: TS-ORD-005 to TS-ORD-012**

This document provides comprehensive testing scripts for payment and order management features with **guaranteed 100% success scenarios**. Each test case includes proper spacing for screenshots.

---

## Prerequisites

1. **Server Running**: `http://localhost:5000`
2. **Database**: MySQL with required tables (Customer_order, Product, customer_order_product)
3. **Midtrans Configuration**: 
   - `MIDTRANS_SERVER_KEY`: Your Midtrans sandbox server key
   - `MIDTRANS_CLIENT_KEY`: Your Midtrans sandbox client key
   - `MIDTRANS_IS_PRODUCTION`: `false`
4. **JWT Token**: Login first to get a valid JWT token
5. **Test Data**: Valid product ID and user email in database

---

## Setup: Get Your JWT Token

**Endpoint**: `POST http://localhost:5000/api/auth/login`

**Request Body**:
```json
{
  "email": "testuser@example.com",
  "password": "yourpassword"
}
```

**Expected Response**:
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Usage**: Copy the token and use it in Authorization header as `Bearer YOUR_TOKEN_HERE`

---
---

## TS-ORD-005: Initiate Payment via Midtrans

**Test Objective**: Create order and generate Midtrans Snap payment token

**Endpoint**: `POST http://localhost:5000/api/midtrans/create-transaction`

**HTTP Method**: `POST`

**Headers**:
```
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json
```

**Request Body**:
```json
{
  "orderData": {
    "name": "John",
    "lastname": "Doe",
    "phone": "08123456789",
    "email": "johndoe@example.com",
    "adress": "Jl. Sudirman No. 123",
    "postalCode": "12345",
    "city": "Jakarta",
    "country": "Indonesia",
    "orderNotice": "Please deliver in the morning",
    "total": 5000000,
    "status": "PENDING"
  },
  "items": [
    {
      "productId": "YOUR_VALID_PRODUCT_ID",
      "quantity": 2,
      "price": 2500000
    }
  ]
}
```

**Important Notes**:
- Replace `YOUR_VALID_PRODUCT_ID` with an actual product ID from your database
- Replace `YOUR_JWT_TOKEN` with the token from login
- Ensure the product has sufficient stock (inStock >= 2)
- Total must equal sum of (price × quantity) for all items

**Expected Response (200 OK)**:
```json
{
  "orderId": "ORD-1234567890",
  "snapToken": "66e4fa55-fdac-4ef9-91b5-733b97d1b862",
  "snapRedirectUrl": "https://app.sandbox.midtrans.com/snap/v2/vtweb/66e4fa55-fdac-4ef9-91b5-733b97d1b862"
}
```

**Success Indicators**:
- ✅ Status Code: 200
- ✅ Response contains `snapToken` and `orderId`
- ✅ Order created in database with status "PENDING"
- ✅ Product stock decremented in database

**How to Guarantee Success**:
1. Use valid product ID with `inStock > 0`
2. Ensure total matches item calculations
3. Use valid JWT token
4. Midtrans credentials configured correctly


---
---

## TS-ORD-006: Simulate Payment Success (Webhook)

**Test Objective**: Simulate successful payment notification from Midtrans

**Endpoint**: `POST http://localhost:5000/api/midtrans/notification`

**HTTP Method**: `POST`

**Headers**:
```
Content-Type: application/json
```

**Request Body**:
```json
{
  "transaction_status": "settlement",
  "order_id": "ORD-1234567890",
  "gross_amount": "5000000.00",
  "payment_type": "credit_card",
  "transaction_time": "2024-01-15 10:30:00",
  "fraud_status": "accept"
}
```

**Important Notes**:
- Replace `ORD-1234567890` with the actual `orderId` from TS-ORD-005 response
- `transaction_status: "settlement"` indicates successful payment
- This endpoint does NOT require JWT token (webhook from Midtrans)
- Order status will change from "PENDING" to "PAID"

**Expected Response (200 OK)**:
```json
{
  "status": "success",
  "message": "Payment notification processed"
}
```

**Database Changes**:
- Order status updated: `PENDING` → `PAID`
- Payment timestamp recorded

**Success Indicators**:
- ✅ Status Code: 200
- ✅ Order status in database changed to "PAID"
- ✅ Response confirms notification processed

**How to Guarantee Success**:
1. Use valid order_id from previous test
2. Ensure order exists in database
3. Use correct transaction_status value
4. Gross amount matches order total


---
---

## TS-ORD-007: Simulate Payment Failed (Webhook)

**Test Objective**: Simulate failed payment notification from Midtrans

**Endpoint**: `POST http://localhost:5000/api/midtrans/notification`

**HTTP Method**: `POST`

**Headers**:
```
Content-Type: application/json
```

**Request Body**:
```json
{
  "transaction_status": "deny",
  "order_id": "ORD-9876543210",
  "gross_amount": "3000000.00",
  "payment_type": "credit_card",
  "transaction_time": "2024-01-15 11:00:00",
  "fraud_status": "deny"
}
```

**Important Notes**:
- Create a NEW order first using TS-ORD-005 and use that `orderId` here
- `transaction_status: "deny"` indicates payment failed/rejected
- Other failure statuses: `"cancel"`, `"expire"`
- Order status will change to "CANCELLED"

**Expected Response (200 OK)**:
```json
{
  "status": "success",
  "message": "Payment notification processed"
}
```

**Database Changes**:
- Order status updated: `PENDING` → `CANCELLED`
- Product stock restored (if decremented during order creation)

**Success Indicators**:
- ✅ Status Code: 200
- ✅ Order status in database changed to "CANCELLED"
- ✅ Response confirms notification processed

**How to Guarantee Success**:
1. Create fresh order first (use TS-ORD-005)
2. Use that new order_id in webhook
3. Use transaction_status: "deny", "cancel", or "expire"
4. Ensure order exists in database


---
---

## TS-ORD-008: Simulate Payment Pending (Bank Transfer)

**Test Objective**: Simulate pending bank transfer payment notification

**Endpoint**: `POST http://localhost:5000/api/midtrans/notification`

**HTTP Method**: `POST`

**Headers**:
```
Content-Type: application/json
```

**Request Body**:
```json
{
  "transaction_status": "pending",
  "order_id": "ORD-5555555555",
  "gross_amount": "2500000.00",
  "payment_type": "bank_transfer",
  "transaction_time": "2024-01-15 12:00:00",
  "fraud_status": "accept",
  "va_numbers": [
    {
      "bank": "bca",
      "va_number": "12345678901"
    }
  ]
}
```

**Important Notes**:
- Create a NEW order first using TS-ORD-005 and use that `orderId`
- `transaction_status: "pending"` for awaiting payment
- Common for bank transfer where customer hasn't paid yet
- Order status remains "PENDING"

**Expected Response (200 OK)**:
```json
{
  "status": "success",
  "message": "Payment notification processed"
}
```

**Database Changes**:
- Order status: `PENDING` (no change)
- Transaction details updated with VA number

**Success Indicators**:
- ✅ Status Code: 200
- ✅ Order status remains "PENDING"
- ✅ VA number saved for customer reference

**How to Guarantee Success**:
1. Create fresh order (TS-ORD-005)
2. Use that order_id
3. transaction_status must be "pending"
4. payment_type: "bank_transfer"


---
---

## TS-ORD-009: Get User Order History

**Test Objective**: Retrieve all orders for a specific user

**Endpoint**: `GET http://localhost:5000/api/customer-orders/user/:email`

**HTTP Method**: `GET`

**Headers**:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Query Parameters**:
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20)

**Full URL Example**:
```
GET http://localhost:5000/api/customer-orders/user/johndoe@example.com?page=1&limit=20
```

**Important Notes**:
- Replace `:email` with the actual user email (e.g., `johndoe@example.com`)
- Include valid JWT token in Authorization header
- Results are paginated and sorted by newest first
- Returns orders with product details included

**Expected Response (200 OK)**:
```json
{
  "orders": [
    {
      "id": "ORD-1234567890",
      "name": "John",
      "lastname": "Doe",
      "email": "johndoe@example.com",
      "phone": "08123456789",
      "adress": "Jl. Sudirman No. 123",
      "postalCode": "12345",
      "city": "Jakarta",
      "country": "Indonesia",
      "total": 5000000,
      "status": "PAID",
      "dateTime": "2024-01-15T10:30:00.000Z",
      "orderNotice": "Please deliver in the morning",
      "customer_order_product": [
        {
          "id": "cop-123",
          "quantity": 2,
          "Product": {
            "id": "prod-456",
            "title": "Gaming Laptop",
            "price": 2500000,
            "image": "/images/laptop.jpg"
          }
        }
      ]
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 1,
    "totalPages": 1
  }
}
```

**Success Indicators**:
- ✅ Status Code: 200
- ✅ Array of orders returned
- ✅ Each order includes product details
- ✅ Pagination metadata included
- ✅ Orders sorted by dateTime descending

**How to Guarantee Success**:
1. Use email of user with existing orders
2. Valid JWT token required
3. Use correct email format
4. If no orders exist, create one first (TS-ORD-005)


---
---

## TS-ORD-010: Get Order Details

**Test Objective**: Retrieve detailed information for a specific order including all products

**Endpoint**: `GET http://localhost:5000/api/customer-orders/:id/details`

**HTTP Method**: `GET`

**Headers**:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**URL Parameters**:
- `:id` - The order ID (e.g., `ORD-1234567890`)

**Full URL Example**:
```
GET http://localhost:5000/api/customer-orders/ORD-1234567890/details
```

**Important Notes**:
- Replace `:id` with actual order ID from previous tests
- Requires valid JWT token
- Returns complete order details with all product information
- Includes product stock availability

**Expected Response (200 OK)**:
```json
{
  "id": "ORD-1234567890",
  "name": "John",
  "lastname": "Doe",
  "email": "johndoe@example.com",
  "phone": "08123456789",
  "adress": "Jl. Sudirman No. 123",
  "postalCode": "12345",
  "city": "Jakarta",
  "country": "Indonesia",
  "total": 5000000,
  "status": "PAID",
  "dateTime": "2024-01-15T10:30:00.000Z",
  "orderNotice": "Please deliver in the morning",
  "customer_order_product": [
    {
      "id": "cop-123",
      "quantity": 2,
      "Product": {
        "id": "prod-456",
        "title": "Gaming Laptop",
        "price": 2500000,
        "image": "/images/laptop.jpg",
        "description": "High-performance gaming laptop with RTX 4060",
        "inStock": 15
      }
    }
  ]
}
```

**Success Indicators**:
- ✅ Status Code: 200
- ✅ Complete order information returned
- ✅ Product details included (title, price, image, description, stock)
- ✅ Quantity for each product shown
- ✅ Order status and shipping details visible

**How to Guarantee Success**:
1. Use valid order ID from database
2. Include JWT token in Authorization header
3. Order must exist in database
4. Use order created in TS-ORD-005 or earlier


---
---

## TS-ORD-011: Admin Update Order Status to SHIPPED

**Test Objective**: Admin updates order status from PAID to SHIPPED

**Endpoint**: `PUT http://localhost:5000/api/customer-orders/:id/status`

**HTTP Method**: `PUT`

**Headers**:
```
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json
```

**URL Parameters**:
- `:id` - The order ID (e.g., `ORD-1234567890`)

**Full URL Example**:
```
PUT http://localhost:5000/api/customer-orders/ORD-1234567890/status
```

**Request Body**:
```json
{
  "status": "SHIPPED"
}
```

**Important Notes**:
- Replace `:id` with actual order ID (must have status "PAID")
- Requires admin JWT token
- Valid status values: `PENDING`, `PAID`, `SHIPPED`, `COMPLETED`, `CANCELLED`
- Typically used after payment is confirmed and package is dispatched

**Expected Response (200 OK)**:
```json
{
  "message": "Order status updated successfully",
  "order": {
    "id": "ORD-1234567890",
    "name": "John",
    "lastname": "Doe",
    "email": "johndoe@example.com",
    "phone": "08123456789",
    "adress": "Jl. Sudirman No. 123",
    "postalCode": "12345",
    "city": "Jakarta",
    "country": "Indonesia",
    "total": 5000000,
    "status": "SHIPPED",
    "dateTime": "2024-01-15T10:30:00.000Z",
    "orderNotice": "Please deliver in the morning"
  }
}
```

**Database Changes**:
- Order status updated: `PAID` → `SHIPPED`

**Success Indicators**:
- ✅ Status Code: 200
- ✅ Order status in database changed to "SHIPPED"
- ✅ Response confirms update with message
- ✅ Updated order object returned

**How to Guarantee Success**:
1. Use order with status "PAID" (from TS-ORD-006)
2. Valid JWT token required
3. status field must be one of allowed values
4. Order ID must exist


---
---

## TS-ORD-012: Admin Update Order Status to COMPLETED

**Test Objective**: Admin marks order as completed after delivery confirmation

**Endpoint**: `PUT http://localhost:5000/api/customer-orders/:id/status`

**HTTP Method**: `PUT`

**Headers**:
```
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json
```

**URL Parameters**:
- `:id` - The order ID (e.g., `ORD-1234567890`)

**Full URL Example**:
```
PUT http://localhost:5000/api/customer-orders/ORD-1234567890/status
```

**Request Body**:
```json
{
  "status": "COMPLETED"
}
```

**Important Notes**:
- Replace `:id` with actual order ID (should have status "SHIPPED")
- Requires admin JWT token
- This is the final status for successful orders
- Typically set after customer receives the product

**Expected Response (200 OK)**:
```json
{
  "message": "Order status updated successfully",
  "order": {
    "id": "ORD-1234567890",
    "name": "John",
    "lastname": "Doe",
    "email": "johndoe@example.com",
    "phone": "08123456789",
    "adress": "Jl. Sudirman No. 123",
    "postalCode": "12345",
    "city": "Jakarta",
    "country": "Indonesia",
    "total": 5000000,
    "status": "COMPLETED",
    "dateTime": "2024-01-15T10:30:00.000Z",
    "orderNotice": "Please deliver in the morning"
  }
}
```

**Database Changes**:
- Order status updated: `SHIPPED` → `COMPLETED`

**Success Indicators**:
- ✅ Status Code: 200
- ✅ Order status in database changed to "COMPLETED"
- ✅ Response confirms update with message
- ✅ Complete order lifecycle: PENDING → PAID → SHIPPED → COMPLETED

**How to Guarantee Success**:
1. Use order with status "SHIPPED" (from TS-ORD-011)
2. Valid JWT token required
3. status must be "COMPLETED"
4. Order ID must exist in database


---
---

## Complete Order Lifecycle Test Sequence

To test the complete order flow from creation to completion, execute tests in this order:

1. **TS-ORD-005**: Create order and get payment token → Status: `PENDING`
2. **TS-ORD-006**: Simulate payment success → Status: `PAID`
3. **TS-ORD-011**: Update to shipped → Status: `SHIPPED`
4. **TS-ORD-012**: Mark as completed → Status: `COMPLETED`

For alternative scenarios:
- **Payment Failed Flow**: TS-ORD-005 → TS-ORD-007 (Status: `CANCELLED`)
- **Pending Payment**: TS-ORD-005 → TS-ORD-008 (Status: `PENDING`)

---

## Test Data Preparation

### Before Testing, Ensure You Have:

1. **Valid Product in Database**:
```sql
-- Check existing products
SELECT id, title, price, inStock FROM Product WHERE inStock > 0 LIMIT 1;
```

2. **User Account**:
```sql
-- Check user exists
SELECT id, email, name FROM User WHERE email = 'johndoe@example.com';
```

3. **Midtrans Configuration** in `.env`:
```
MIDTRANS_SERVER_KEY=SB-Mid-server-xxxxxxxxxxxxx
MIDTRANS_CLIENT_KEY=SB-Mid-client-xxxxxxxxxxxxx
MIDTRANS_IS_PRODUCTION=false
```

---

## Troubleshooting

### Common Issues and Solutions

**Issue: "No token provided"**
- Solution: Ensure JWT token is in Authorization header as `Bearer YOUR_TOKEN`

**Issue: "Product not found"**
- Solution: Use valid product ID from your database

**Issue: "Insufficient stock"**
- Solution: Ensure product.inStock >= quantity requested

**Issue: "Order not found" (webhooks)**
- Solution: Use order_id from TS-ORD-005 response

**Issue: "Invalid status"**
- Solution: Use only: PENDING, PAID, SHIPPED, COMPLETED, CANCELLED

**Issue: Total mismatch**
- Solution: Ensure total equals sum of (price × quantity) for all items

---

## Success Criteria Summary

✅ **All tests should return 200 OK** (or 201 Created for TS-ORD-005)
✅ **Database reflects correct status changes**
✅ **Product stock updates correctly**
✅ **Order lifecycle flows properly**
✅ **Webhooks process without errors**
✅ **Pagination works in order history**
✅ **Product details included in responses**

---

## Notes for Screenshots

- Each test case section is separated with clear spacing
- Copy URL, Method, Headers, and Body separately for clarity
- Capture response in separate screenshot
- Show database changes when mentioned
- Highlight success indicators in your screenshots

---

**End of Testing Guide**
