# Figma Component Structure - Quick Reference

## 🎯 Component Hierarchy untuk Nasional Elektronik

### Level 1: ATOMS (Building Blocks)

#### 1.1 Buttons
```
Component: Button
├─ Property: Size
│  ├─ Small (32px height)
│  ├─ Medium (44px height) [DEFAULT]
│  └─ Large (52px height)
├─ Property: Variant
│  ├─ Primary (Blue background)
│  ├─ Secondary (Green background)
│  ├─ Outline (Border only)
│  ├─ Ghost (No background)
│  └─ Danger (Red background)
├─ Property: State
│  ├─ Default
│  ├─ Hover
│  ├─ Active
│  ├─ Disabled
│  └─ Loading
└─ Property: Icon
   ├─ None
   ├─ Left
   ├─ Right
   └─ Icon Only

Auto Layout Settings:
- Direction: Horizontal
- Padding: 16px 24px (Medium)
- Gap between items: 8px
- Alignment: Center
- Resizing: Hug contents
```

#### 1.2 Input Fields
```
Component: Input
├─ Property: Type
│  ├─ Text
│  ├─ Email
│  ├─ Password
│  ├─ Number
│  └─ Search
├─ Property: State
│  ├─ Default
│  ├─ Focused (border Primary/500)
│  ├─ Error (border Error/500)
│  ├─ Success (border Success/500)
│  └─ Disabled
├─ Property: Size
│  ├─ Small (36px)
│  ├─ Medium (44px)
│  └─ Large (52px)
└─ Property: Icon
   ├─ None
   ├─ Left
   └─ Right

Structure:
- Container (Auto Layout Horizontal)
  ├─ Icon (Optional, 20px)
  ├─ Input Text (Fill container)
  └─ Suffix Icon (Optional)
```

#### 1.3 Icons
```
Component: Icon
├─ Property: Name
│  ├─ Search
│  ├─ Cart
│  ├─ Heart
│  ├─ User
│  ├─ Menu
│  ├─ Close
│  ├─ ChevronDown
│  ├─ Star
│  └─ ... (50+ icons)
├─ Property: Size
│  ├─ 16px
│  ├─ 20px
│  ├─ 24px
│  └─ 32px
└─ Property: Color
   └─ Inherit (use color override)
```

#### 1.4 Badge
```
Component: Badge
├─ Property: Variant
│  ├─ Default (Gray)
│  ├─ Primary (Blue)
│  ├─ Success (Green)
│  ├─ Warning (Yellow)
│  └─ Error (Red)
├─ Property: Size
│  ├─ Small (20px height)
│  ├─ Medium (24px height)
│  └─ Large (28px height)
└─ Property: Dot
   └─ Boolean (show/hide dot)

Auto Layout:
- Padding: 4px 8px
- Gap: 4px
- Border radius: Full (9999px)
```

---

### Level 2: MOLECULES (Combined Components)

#### 2.1 Product Card
```
Component: Product Card
├─ Property: Layout
│  ├─ Grid (vertical)
│  └─ List (horizontal)
├─ Property: Size
│  ├─ Small (280px width)
│  ├─ Medium (320px width)
│  └─ Large (380px width)
├─ Property: OnSale
│  └─ Boolean (shows badge)
└─ Property: InStock
   └─ Boolean (shows availability)

Structure (Auto Layout Vertical):
├─ Image Container (Aspect ratio 1:1)
│  ├─ Product Image (Fill)
│  ├─ Badge "Sale/New" (Absolute, top-left)
│  └─ Wishlist Button (Absolute, top-right)
├─ Product Info (Auto Layout Vertical, gap: 8px)
│  ├─ Category (Text, 12px, Gray/600)
│  ├─ Product Name (Text, 16px, 2 lines max)
│  ├─ Rating Component (Instance)
│  ├─ Price Container (Auto Layout Horizontal)
│  │  ├─ Current Price (20px, Bold)
│  │  └─ Original Price (Strike, 14px) [if OnSale]
│  └─ Stock Status (Text)
└─ Actions (Auto Layout Horizontal, gap: 8px)
   ├─ Add to Cart Button (Instance)
   └─ Quick View Icon Button (Instance)

Padding: 16px
Border radius: 12px
Hover effect: Lift shadow
```

#### 2.2 Search Bar
```
Component: Search Bar
├─ Property: Size
│  ├─ Medium (44px)
│  └─ Large (52px)
└─ Property: WithCategory
   └─ Boolean (shows category dropdown)

Structure (Auto Layout Horizontal):
├─ Search Icon (20px, Gray/400)
├─ Input Field (Fill container)
├─ Category Dropdown (Optional, 150px)
│  ├─ Text "All Categories"
│  └─ Chevron Down Icon
└─ Search Button (Primary, 44px square)

Width: Fill container
Border: 1px solid Gray/300
Padding: 0px (children have padding)
Border radius: 8px
Focus: Border Primary/500, Shadow
```

#### 2.3 Rating Component
```
Component: Product Rating
├─ Property: Value
│  └─ Number (0-5, 0.5 increments)
├─ Property: ShowCount
│  └─ Boolean (shows review count)
└─ Property: Size
   ├─ Small (16px stars)
   └─ Medium (20px stars)

Structure (Auto Layout Horizontal, gap: 8px):
├─ Stars Container (Auto Layout Horizontal, gap: 2px)
│  ├─ Star Icon (Filled/Half/Outline) x5
├─ Rating Number (Text, 4.5)
└─ Review Count (Text, "(128)") [if ShowCount]

Colors:
- Filled star: Warning/500 (#F59E0B)
- Empty star: Gray/300
```

#### 2.4 Quantity Input
```
Component: Quantity Input
├─ Property: Size
│  ├─ Small (32px)
│  └─ Medium (40px)
└─ Property: Value
   └─ Number (default: 1)

Structure (Auto Layout Horizontal):
├─ Decrease Button (Square, "-")
├─ Value Display (Text, center, min-width: 40px)
└─ Increase Button (Square, "+")

Border: 1px solid Gray/300
Border radius: 6px
Gap: 0px (buttons border right/left)
```

#### 2.5 Price Display
```
Component: Price
├─ Property: OnSale
│  └─ Boolean
└─ Property: Size
   ├─ Small (16px)
   ├─ Medium (20px)
   └─ Large (28px)

Structure (Auto Layout Horizontal, gap: 8px):
├─ Current Price (Primary color, Bold)
├─ Original Price (Strike, Gray/400) [if OnSale]
└─ Discount Badge ("25% OFF") [if OnSale]
```

---

### Level 3: ORGANISMS (Complex Components)

#### 3.1 Header Component
```
Component: Header
├─ Property: State
│  ├─ Default
│  └─ Scrolled (with shadow)
└─ Property: Device
   ├─ Desktop
   ├─ Tablet
   └─ Mobile (hamburger menu)

Structure (Auto Layout Vertical):
├─ Header Top (Auto Layout Horizontal, Space Between)
│  ├─ Contact Info (Auto Layout Horizontal, gap: 16px)
│  │  ├─ Icon + Text (Email)
│  │  └─ Icon + Text (Phone)
│  └─ User Actions (Auto Layout Horizontal, gap: 16px)
│     ├─ Language Selector
│     ├─ Currency Selector
│     └─ Account Link
├─ Header Main (Auto Layout Horizontal, gap: 24px)
│  ├─ Logo (200px width)
│  ├─ Search Bar Instance (Fill container)
│  └─ Icons Group (Auto Layout Horizontal, gap: 20px)
│     ├─ Wishlist Icon + Badge
│     ├─ Cart Icon + Badge
│     └─ User Menu Icon
└─ Navigation (Auto Layout Horizontal, gap: 32px)
   └─ Nav Item Instance x6

Padding: 16px 80px (sides)
Background: White
Border bottom: 1px solid Gray/200
Sticky: Top
Z-index: 100
```

#### 3.2 Navigation Item
```
Component: Nav Item
├─ Property: State
│  ├─ Default
│  ├─ Hover
│  └─ Active
├─ Property: HasDropdown
│  └─ Boolean
└─ Property: Type
   ├─ Link
   └─ Mega Menu

Structure (Auto Layout Horizontal, gap: 6px):
├─ Text Label
└─ Chevron Down Icon (if HasDropdown)

Mega Menu (Absolute, appears on hover):
├─ Container (Grid 4 columns)
│  ├─ Category Column x4
│  │  ├─ Category Title
│  │  └─ Links x5
└─ Featured Products Section
```

#### 3.3 Product Grid Section
```
Component: Product Section
├─ Property: Title
│  └─ Text
├─ Property: Layout
│  ├─ Grid (4 columns)
│  └─ Carousel (horizontal scroll)
└─ Property: ShowFilters
   └─ Boolean

Structure (Auto Layout Vertical, gap: 32px):
├─ Section Header (Auto Layout Horizontal, Space Between)
│  ├─ Title + Subtitle
│  └─ View All Link
├─ Filters Bar [if ShowFilters]
│  ├─ Category Tabs
│  └─ Sort Dropdown
└─ Products Container
   ├─ [Grid] Auto Layout, Wrap, 4 columns
   │  └─ Product Card Instance xN
   └─ [Carousel] Horizontal scroll
      └─ Product Card Instance xN

Padding: 60px 80px
Gap between cards: 24px
```

#### 3.4 Footer
```
Component: Footer
└─ Property: Variant
   ├─ Full (all sections)
   └─ Minimal (copyright only)

Structure (Auto Layout Vertical):
├─ Footer Main (Grid 4 columns, gap: 40px)
│  ├─ Company Column
│  │  ├─ Logo
│  │  ├─ Description
│  │  └─ Social Links
│  ├─ Quick Links Column
│  │  ├─ Title "Quick Links"
│  │  └─ Links x6
│  ├─ Customer Service Column
│  │  ├─ Title "Customer Service"
│  │  └─ Links x6
│  └─ Newsletter Column
│     ├─ Title "Newsletter"
│     ├─ Description
│     └─ Email Input + Button
├─ Footer Middle (Auto Layout Horizontal, Space Between)
│  ├─ Payment Methods (Icons)
│  └─ Security Badges
└─ Footer Bottom (Auto Layout Horizontal, Space Between)
   ├─ Copyright Text
   └─ Legal Links (Privacy, Terms)

Padding: 60px 80px
Background: Gray/900
Text color: White
```

#### 3.5 Hero Section
```
Component: Hero
├─ Property: Layout
│  ├─ Centered
│  ├─ Left Aligned
│  └─ Split (50/50)
└─ Property: Variant
   ├─ Image Background
   ├─ Gradient
   └─ Video

Structure (Auto Layout Horizontal/Vertical):
├─ Content Container (50% or centered)
│  ├─ Badge (Optional)
│  ├─ Heading (H1, 48-64px)
│  ├─ Description (18px)
│  └─ CTA Buttons (Auto Layout Horizontal)
│     ├─ Primary Button
│     └─ Secondary Button (Optional)
└─ Media Container (50%) [if Split]
   └─ Image/Video

Height: 500-600px
Padding: 60px 80px
Background: Image/Gradient/Video
Overlay: rgba(0,0,0,0.4) [if needed]
```

---

### Level 4: TEMPLATES (Full Pages)

#### 4.1 Homepage Template
```
Frame: Homepage - Desktop (1440px width)

Structure (Auto Layout Vertical):
├─ Header Component (Sticky)
├─ Hero Section Component
├─ Incentives Section (Grid 4 columns)
│  └─ Feature Card x4
├─ Featured Products Section Component
├─ Category Menu Component
├─ New Arrivals Section Component
├─ Promotional Banner (Full width)
├─ Best Sellers Section Component
├─ Newsletter Component
└─ Footer Component

Spacing between sections: 80px
Container max-width: 1440px
Side margins: 80px
```

#### 4.2 Product Listing Page
```
Frame: Shop - Desktop (1440px width)

Structure:
├─ Header Component
├─ Breadcrumb Component
├─ Page Header
│  ├─ Title + Result Count
│  └─ Layout Toggle (Grid/List)
├─ Main Container (Grid: 280px sidebar + auto main)
│  ├─ Filters Sidebar (Auto Layout Vertical)
│  │  ├─ Categories Component
│  │  ├─ Price Range Component
│  │  ├─ Brands Checkboxes
│  │  ├─ Ratings Filter
│  │  └─ More Filters
│  └─ Products Area
│     ├─ Sort Bar (Auto Layout Horizontal, Space Between)
│     │  ├─ Showing Text
│     │  └─ Sort Dropdown
│     ├─ Products Grid (Auto Layout, Wrap)
│     │  └─ Product Card xN
│     └─ Pagination Component
└─ Footer Component

Sidebar width: 280px
Gap: 32px
Product grid: 3 columns
```

#### 4.3 Product Detail Page
```
Frame: Product Detail - Desktop (1440px width)

Structure:
├─ Header Component
├─ Breadcrumb Component
├─ Product Main (Grid: 50/50, gap: 60px)
│  ├─ Product Images
│  │  ├─ Main Image (Zoom feature)
│  │  └─ Thumbnail Gallery (Auto Layout)
│  └─ Product Info (Auto Layout Vertical, gap: 20px)
│     ├─ Category Badge
│     ├─ Product Name (H1)
│     ├─ Rating Component
│     ├─ Price Component (Large)
│     ├─ Description (Short)
│     ├─ Variant Selector (Color)
│     ├─ Variant Selector (Size)
│     ├─ Quantity Input Component
│     ├─ Action Buttons (Auto Layout Horizontal)
│     │  ├─ Add to Cart (Primary, Fill)
│     │  ├─ Buy Now (Secondary)
│     │  └─ Wishlist (Icon Button)
│     ├─ Features List
│     │  └─ Icon + Text x4
│     ├─ Stock Availability
│     └─ Social Share Component
├─ Product Tabs Component
│  ├─ Tab: Description
│  ├─ Tab: Specifications (Table)
│  ├─ Tab: Reviews (List + Form)
│  └─ Tab: Q&A
├─ Related Products Section Component
└─ Footer Component

Container: 1280px max-width
Padding: 40px 80px
```

#### 4.4 Shopping Cart Page
```
Frame: Cart - Desktop (1440px width)

Structure:
├─ Header Component
├─ Page Title "Shopping Cart"
├─ Cart Container (Grid: 2fr + 1fr, gap: 40px)
│  ├─ Cart Items Section
│  │  ├─ Cart Header (Table headers)
│  │  └─ Cart Item Component xN
│  │     ├─ Product Image (80px)
│  │     ├─ Product Info (Name + Variant)
│  │     ├─ Price
│  │     ├─ Quantity Input Component
│  │     ├─ Subtotal
│  │     └─ Remove Button
│  └─ Order Summary (Sticky)
│     ├─ Summary Title
│     ├─ Subtotal Row
│     ├─ Shipping Row
│     ├─ Coupon Input + Apply Button
│     ├─ Discount Row (if applied)
│     ├─ Divider
│     ├─ Total Row (Large, Bold)
│     ├─ Checkout Button (Primary, Full width)
│     └─ Security Badge
├─ Continue Shopping Link
└─ Footer Component

Max-width: 1280px
Padding: 40px 80px
```

#### 4.5 Checkout Page
```
Frame: Checkout - Desktop (1440px width)

Structure:
├─ Header Component (Simplified)
├─ Progress Steps Component (3 steps)
├─ Checkout Container (Grid: 2fr + 1fr, gap: 40px)
│  ├─ Form Section (Auto Layout Vertical)
│  │  ├─ Step 1: Shipping Information
│  │  │  ├─ Section Title
│  │  │  ├─ Saved Addresses (if logged in)
│  │  │  └─ Shipping Form
│  │  │     ├─ Full Name Input
│  │  │     ├─ Email Input
│  │  │     ├─ Phone Input
│  │  │     ├─ Address Input
│  │  │     ├─ City + Province (Grid 2 cols)
│  │  │     └─ Postal Code
│  │  ├─ Step 2: Shipping Method
│  │  │  └─ Radio Options (3 options)
│  │  ├─ Step 3: Payment Method
│  │  │  ├─ Payment Tabs
│  │  │  │  ├─ Bank Transfer
│  │  │  │  ├─ E-Wallet
│  │  │  │  └─ COD
│  │  │  └─ Payment Details Form
│  │  └─ Action Buttons
│  │     ├─ Back Button (Outline)
│  │     └─ Place Order Button (Primary)
│  └─ Order Summary (Sticky)
│     ├─ Items List (Scrollable)
│     ├─ Price Breakdown
│     ├─ Total
│     └─ Security Badges
└─ Footer Component (Minimal)

Max-width: 1280px
Padding: 40px 80px
```

#### 4.6 Admin Dashboard Page
```
Frame: Dashboard - Desktop (1440px width, Full height)

Structure (Grid: 260px sidebar + auto main):
├─ Sidebar (Fixed, Auto Layout Vertical)
│  ├─ Logo
│  ├─ Navigation Items
│  │  ├─ Dashboard (Active)
│  │  ├─ Orders
│  │  ├─ Products
│  │  ├─ Customers
│  │  ├─ Analytics
│  │  ├─ Marketing
│  │  └─ Settings
│  └─ Logout Button
└─ Main Content (Auto Layout Vertical)
   ├─ Top Bar (Auto Layout Horizontal, Space Between)
   │  ├─ Page Title + Breadcrumb
   │  └─ User Menu + Notifications
   ├─ Stats Cards (Grid 4 columns)
   │  └─ Stat Card Component x4
   │     ├─ Icon
   │     ├─ Value (Large number)
   │     ├─ Label
   │     └─ Trend Indicator
   ├─ Charts Section (Grid 2 columns)
   │  ├─ Revenue Chart (Line chart)
   │  └─ Category Sales (Pie chart)
   └─ Recent Orders Table
      ├─ Table Header
      └─ Table Rows xN

Sidebar: 260px width, Background Gray/900
Main: Padding 32px
Gap: 24px
```

---

## 🎨 Component States & Interactions

### Interactive States untuk Semua Components
```
1. Default - Resting state
2. Hover - Mouse over
3. Active/Pressed - Click down
4. Focused - Keyboard navigation
5. Disabled - Non-interactive
6. Loading - Processing
7. Error - Validation failed
8. Success - Validation passed
```

### Prototype Connections
```
Homepage → Shop (Click "Shop Now")
Shop → Product Detail (Click product card)
Product Detail → Cart (Click "Add to Cart")
Cart → Checkout (Click "Proceed to Checkout")
Checkout → Order Confirmation (Click "Place Order")
```

---

## 📋 Component Checklist

### Atoms (20 components)
- [ ] Button (6 variants, 4 states, 3 sizes)
- [ ] Input (5 types, 5 states, 3 sizes)
- [ ] Icon (50+ icons, 4 sizes)
- [ ] Badge (5 variants, 3 sizes)
- [ ] Link (3 states)
- [ ] Checkbox (3 states)
- [ ] Radio (3 states)
- [ ] Switch (2 states)
- [ ] Avatar (3 sizes)
- [ ] Divider (Horizontal/Vertical)
- [ ] Tooltip
- [ ] Spinner/Loader
- [ ] Tag
- [ ] Progress Bar
- [ ] Skeleton Loader

### Molecules (15 components)
- [ ] Product Card
- [ ] Search Bar
- [ ] Rating Component
- [ ] Quantity Input
- [ ] Price Display
- [ ] Breadcrumb
- [ ] Pagination
- [ ] Navigation Item
- [ ] Form Group (Label + Input + Error)
- [ ] Alert/Notification
- [ ] Modal/Dialog
- [ ] Dropdown Menu
- [ ] Tab Component
- [ ] Accordion Item
- [ ] Cart Item Card

### Organisms (10 components)
- [ ] Header
- [ ] Footer
- [ ] Hero Section
- [ ] Product Grid Section
- [ ] Category Menu
- [ ] Filters Sidebar
- [ ] Product Image Gallery
- [ ] Reviews Section
- [ ] Newsletter Section
- [ ] Data Table

### Templates (6 pages)
- [ ] Homepage
- [ ] Product Listing
- [ ] Product Detail
- [ ] Shopping Cart
- [ ] Checkout
- [ ] Dashboard

---

## 🚀 Ready to Start?

1. **Open Figma** → Create new file
2. **Import this guide** → Keep as reference
3. **Start with Atoms** → Build foundation first
4. **Test components** → Make instances work properly
5. **Build up gradually** → Molecules → Organisms → Templates
6. **Prototype** → Add interactions
7. **Export** → Share with developers

**Estimated time:** 12-16 hours untuk complete design system

Good luck! 🎨✨
