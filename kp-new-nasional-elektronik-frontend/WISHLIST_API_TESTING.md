# Wishlist API Testing Guide

## Test Case: TS-WISH-005 - View Wishlist (Empty State)

**URL:** `http://localhost:3001/api/wishlist/user/2`
**METHOD:** `GET`
**BODY:** (none)
**QUERY/PARAM:** `userId = 2` (in URL path)

**Expected Response:**
```json
{
  "data": [],
  "total": 0
}
```

---

## Test Case: TS-WISH-006 - Remove Wishlist Item

**URL:** `http://localhost:3001/api/wishlist/user/1/5`
**METHOD:** `DELETE`
**BODY:** (none)
**QUERY/PARAM:** 
- `userId = 1` (in URL path)
- `productId = 5` (in URL path)

**Expected Response:**
```json
{
  "message": "Item removed from wishlist"
}
```

---

## Test Case: TS-WISH-007 - Wishlist Count

**URL:** `http://localhost:3001/api/wishlist/user/1`
**METHOD:** `GET`
**BODY:** (none)
**QUERY/PARAM:** `userId = 1` (in URL path)

**Expected Response:**
```json
{
  "data": [
    {
      "id": "...",
      "userId": "1",
      "productId": "...",
      "product": {
        "id": "...",
        "title": "...",
        "price": 1000000,
        "mainImage": "...",
        "slug": "...",
        "inStock": 10,
        "category": {
          "name": "..."
        }
      }
    }
    // ... more items
  ],
  "total": 3
}
```

**Note:** To get just the count in your frontend, use `response.data.total`

---

## Test Case: TS-WISH-008 - Cascade Delete (Product Deletion)

### Step 1: Add product to multiple wishlists

**URL:** `http://localhost:3001/api/wishlist`
**METHOD:** `POST`
**HEADERS:**
```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```
**BODY:**
```json
{
  "productId": "8"
}
```

**Note:** You need to be authenticated with a valid JWT token. Repeat this with different user tokens.

### Step 2: Delete the product (Admin action)

**URL:** `http://localhost:3001/api/products/8`
**METHOD:** `DELETE`
**HEADERS:**
```
Authorization: Bearer <ADMIN_JWT_TOKEN>
```
**BODY:** (none)
**QUERY/PARAM:** `productId = 8` (in URL path)

**Expected Behavior:**
- Product is deleted from the products table
- All wishlist entries with `productId = 8` are automatically deleted (CASCADE)
- No orphan records remain in the wishlist table

### Step 3: Verify cascade delete

**URL:** `http://localhost:3001/api/wishlist/admin/all`
**METHOD:** `GET`
**HEADERS:**
```
Authorization: Bearer <ADMIN_JWT_TOKEN>
```
**BODY:** (none)
**QUERY/PARAM:** (none)

**Expected:** No wishlist entries with `productId = 8` should exist

---

## Additional Endpoints

### Add to Wishlist (Public - No Authentication Required)

**URL:** `http://localhost:3001/api/wishlist/public`
**METHOD:** `POST`
**HEADERS:**
```
Content-Type: application/json
```
**BODY:**
```json
{
  "userId": "1",
  "productId": "5"
}
```

**Expected Response:**
```json
{
  "id": "...",
  "userId": "1",
  "productId": "5",
  "product": {
    "id": "5",
    "title": "...",
    "price": 1000000,
    "mainImage": "...",
    "slug": "...",
    "category": {
      "name": "Electronics"
    }
  }
}
```

### Add to Wishlist (Authenticated)

**URL:** `http://localhost:3001/api/wishlist`
**METHOD:** `POST`
**HEADERS:**
```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```
**BODY:**
```json
{
  "productId": "5"
}
```

**Expected Response:**
```json
{
  "id": "...",
  "userId": "1",
  "productId": "5",
  "product": {
    "id": "5",
    "title": "...",
    "price": 1000000,
    "mainImage": "...",
    "slug": "..."
  }
}
```

---

### Check if Product is in Wishlist (Authenticated)

**URL:** `http://localhost:3001/api/wishlist/check/5`
**METHOD:** `GET`
**HEADERS:**
```
Authorization: Bearer <JWT_TOKEN>
```
**BODY:** (none)
**QUERY/PARAM:** `productId = 5` (in URL path)

**Expected Response:**
```json
{
  "inWishlist": true,
  "wishItem": {
    "id": "...",
    "userId": "1",
    "productId": "5",
    "product": { ... }
  }
}
```

---

### Clear All Wishlist Items (Authenticated)

**URL:** `http://localhost:3001/api/wishlist/clear`
**METHOD:** `DELETE`
**HEADERS:**
```
Authorization: Bearer <JWT_TOKEN>
```
**BODY:** (none)
**QUERY/PARAM:** (none)

**Expected Response:** 204 No Content

---

## How to Get JWT Token

### Login Endpoint

**URL:** `http://localhost:3001/api/users/login`
**METHOD:** `POST`
**HEADERS:**
```
Content-Type: application/json
```
**BODY:**
```json
{
  "email": "user@example.com",
  "password": "yourpassword"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "1",
    "email": "user@example.com",
    "role": "user"
  },
  "message": "Login successful"
}
```

**Usage:** Copy the `token` value and use it in the Authorization header as `Bearer <token>`

---

## Summary of Changes

### Backend Changes:

1. **Added Public Wishlist Endpoints** (No authentication required):
   - `GET /api/wishlist/user/:userId` - View wishlist by user ID
   - `POST /api/wishlist/public` - Add item to wishlist (accepts userId in body)
   - `DELETE /api/wishlist/user/:userId/:productId` - Remove item from wishlist

2. **Kept Authenticated Endpoints** (Require JWT token):
   - `GET /api/wishlist` - Get current user's wishlist
   - `POST /api/wishlist` - Add item to wishlist (userId from JWT token)
   - `DELETE /api/wishlist/:productId` - Remove item from wishlist
   - `GET /api/wishlist/check/:productId` - Check if item is in wishlist
   - `DELETE /api/wishlist/clear` - Clear all wishlist items
   - `GET /api/wishlist/admin/all` - Admin: View all wishlists

3. **Controller Updates:**
   - Added `getWishlistByUserId()` function for public access
   - Added `createWishItemPublic()` function for public add to wishlist
   - Added `deleteWishItemPublic()` function for public deletion
   - Updated response format to include `{ data: [], total: 0 }`

### Frontend Changes:

1. **AddToWishlistBtn Component** (`components/AddToWishlistBtn.tsx`):
   - Added `getUserId()` function to fetch userId from backend
   - Updated add endpoint to use `/api/wishlist/public` with userId in body
   - Updated delete endpoint to use `/api/wishlist/user/:userId/:productId`
   - Improved error handling with toast notifications

2. **WishItem Component** (`components/WishItem.tsx`):
   - Updated to use public endpoint `/api/wishlist/user/:userId/:productId`
   - Improved error handling with toast notifications

3. **Wishlist Module** (`components/modules/wishlist/index.tsx`):
   - Updated to use public endpoint `/api/wishlist/user/:userId`
   - Fixed response parsing to handle `{ data: [], total: 0 }` format
   - Added error handling for failed requests

### Database Schema:

The CASCADE delete is handled at the database level in your Prisma schema:

```prisma
model Wishlist {
  id        String   @id @default(uuid())
  userId    String
  productId String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  product   Product  @relation(fields: [productId], references: [id], onDelete: Cascade)
  
  @@unique([userId, productId])
}
```

This ensures that when a product is deleted, all related wishlist entries are automatically removed.

---

## Testing Notes:

1. **Public Endpoints:** No authentication token needed, can be tested directly
2. **Authenticated Endpoints:** Require JWT token from `/api/users/login`
3. **Admin Endpoints:** Require JWT token with admin role
4. **Cascade Delete:** Automatically handled by database constraints
5. **Error Handling:** All endpoints return appropriate error messages and status codes
