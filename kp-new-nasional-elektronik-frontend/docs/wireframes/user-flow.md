# User Flow - Nasional Elektronik E-commerce

## 1. Customer Journey - Browse & Purchase

```mermaid
graph TD
    A[Landing Page] --> B{User Type?}
    B -->|Guest| C[Browse Products]
    B -->|Registered| D[Browse Products]
    
    C --> E[View Product Detail]
    D --> E
    
    E --> F{Action?}
    F -->|Add to Cart| G[Shopping Cart]
    F -->|Add to Wishlist| H[Login Required]
    F -->|Buy Now| I[Quick Checkout]
    
    H --> J[Login/Register]
    J --> K[Wishlist Added]
    
    G --> L[Continue Shopping?]
    L -->|Yes| C
    L -->|No| M[Proceed to Checkout]
    
    M --> N{Logged In?}
    N -->|No| J
    N -->|Yes| O[Checkout Form]
    
    O --> P[Fill Shipping Info]
    P --> Q[Select Payment Method]
    Q --> R[Review Order]
    R --> S[Place Order]
    S --> T[Order Confirmation]
    T --> U[Order Tracking]
```

## 2. User Authentication Flow

```mermaid
graph TD
    A[User Visits Site] --> B{Has Account?}
    B -->|No| C[Click Register]
    B -->|Yes| D[Click Login]
    
    C --> E[Fill Registration Form]
    E --> F{Validation OK?}
    F -->|No| G[Show Errors]
    F -->|Yes| H[Create Account]
    
    G --> E
    H --> I[Auto Login]
    
    D --> J[Enter Credentials]
    J --> K{Valid?}
    K -->|No| L[Show Error]
    K -->|Yes| M[Login Success]
    
    L --> J
    
    I --> N[Redirect to Dashboard/Cart]
    M --> N
    
    N --> O[Session Active]
    O --> P{Session Timeout?}
    P -->|Yes| Q[Auto Logout]
    P -->|No| O
    
    Q --> A
```

## 3. Admin Dashboard Flow

```mermaid
graph TD
    A[Admin Login] --> B{Credentials Valid?}
    B -->|No| C[Error Message]
    B -->|Yes| D[Dashboard Home]
    
    C --> A
    
    D --> E{Select Action}
    E -->|Products| F[Product Management]
    E -->|Orders| G[Order Management]
    E -->|Customers| H[Customer Management]
    E -->|Analytics| I[View Reports]
    
    F --> F1[Add/Edit/Delete Products]
    F --> F2[Manage Inventory]
    F --> F3[Upload Images]
    
    G --> G1[View Orders]
    G --> G2[Update Order Status]
    G --> G3[Process Refunds]
    
    H --> H1[View Customer List]
    H --> H2[View Customer Details]
    H --> H3[Manage Permissions]
    
    I --> I1[Sales Reports]
    I --> I2[Revenue Charts]
    I --> I3[Product Analytics]
```

## 4. Shopping Cart Flow

```mermaid
graph TD
    A[View Product] --> B[Add to Cart]
    B --> C[Cart Updated]
    
    C --> D{Continue?}
    D -->|Shop More| E[Back to Products]
    D -->|Checkout| F[View Cart Page]
    
    E --> A
    
    F --> G{Actions?}
    G -->|Update Qty| H[Update Cart]
    G -->|Remove Item| I[Remove from Cart]
    G -->|Apply Coupon| J[Validate Coupon]
    G -->|Checkout| K[Proceed to Checkout]
    
    H --> F
    I --> F
    
    J --> L{Valid?}
    L -->|Yes| M[Apply Discount]
    L -->|No| N[Show Error]
    
    M --> F
    N --> F
    
    K --> O{Logged In?}
    O -->|Yes| P[Checkout Form]
    O -->|No| Q[Login/Register]
    
    Q --> P
```

## 5. Search & Filter Flow

```mermaid
graph TD
    A[Product Listing Page] --> B{User Action}
    B -->|Search| C[Enter Search Term]
    B -->|Filter| D[Select Filters]
    B -->|Sort| E[Select Sort Option]
    
    C --> F[Search API Call]
    F --> G[Display Results]
    
    D --> D1{Filter Type}
    D1 -->|Category| D2[Select Category]
    D1 -->|Price Range| D3[Set Price Range]
    D1 -->|Brand| D4[Select Brand]
    D1 -->|Rating| D5[Select Rating]
    
    D2 --> H[Update Filters]
    D3 --> H
    D4 --> H
    D5 --> H
    
    H --> I[Filter API Call]
    I --> G
    
    E --> J{Sort By}
    J -->|Price Low-High| K[Sort ASC]
    J -->|Price High-Low| L[Sort DESC]
    J -->|Newest| M[Sort by Date]
    J -->|Popular| N[Sort by Sales]
    
    K --> G
    L --> G
    M --> G
    N --> G
    
    G --> O{Results?}
    O -->|Found| P[Show Products]
    O -->|Empty| Q[No Results Message]
```

## 6. Checkout Process Flow

```mermaid
graph TD
    A[Cart Page] --> B[Click Checkout]
    B --> C{Logged In?}
    C -->|No| D[Login/Register]
    C -->|Yes| E[Checkout Step 1: Shipping]
    
    D --> E
    
    E --> F[Fill Shipping Address]
    F --> G{Has Saved Address?}
    G -->|Yes| H[Select Saved Address]
    G -->|No| I[Enter New Address]
    
    H --> J[Next: Payment]
    I --> K{Save Address?}
    K -->|Yes| L[Save to Profile]
    K -->|No| J
    L --> J
    
    J --> M[Select Payment Method]
    M --> N{Payment Type}
    N -->|Bank Transfer| O[Show Bank Details]
    N -->|E-Wallet| P[Show E-Wallet Options]
    N -->|COD| Q[Cash on Delivery Info]
    
    O --> R[Step 3: Review Order]
    P --> R
    Q --> R
    
    R --> S[Confirm Order Details]
    S --> T{All Correct?}
    T -->|No| U[Back to Edit]
    T -->|Yes| V[Place Order]
    
    U --> E
    
    V --> W[Process Payment]
    W --> X{Payment Success?}
    X -->|Yes| Y[Order Confirmation]
    X -->|No| Z[Payment Failed]
    
    Z --> AA[Retry Payment]
    AA --> M
    
    Y --> AB[Send Confirmation Email]
    AB --> AC[Order Tracking Page]
```

## Key User Scenarios

### Scenario 1: First-Time Visitor
1. Lands on homepage
2. Sees hero banner with promotions
3. Browses featured products
4. Views product detail
5. Adds to cart
6. Prompted to register
7. Completes purchase

### Scenario 2: Returning Customer
1. Logs in
2. Checks wishlist
3. Moves item to cart
4. Uses saved shipping address
5. Quick checkout
6. Tracks order

### Scenario 3: Admin User
1. Logs into admin panel
2. Checks new orders
3. Updates order status
4. Manages product inventory
5. Views sales analytics
6. Responds to customer inquiries

## Pain Points to Address

- ✅ Minimize steps in checkout process
- ✅ Guest checkout option
- ✅ Save cart for later
- ✅ Easy returns/refunds process
- ✅ Clear shipping information
- ✅ Multiple payment options
- ✅ Real-time order tracking
- ✅ Mobile-responsive design

## Success Metrics

- Conversion rate: Add to cart → Purchase
- Cart abandonment rate
- Time to checkout completion
- Customer satisfaction score
- Return visitor rate
