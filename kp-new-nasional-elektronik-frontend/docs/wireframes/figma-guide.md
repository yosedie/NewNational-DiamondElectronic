# Panduan Konversi ke Figma - Nasional Elektronik E-commerce

## 🎨 Setup Project Figma

### 1. Buat File Figma Baru
1. Buka [Figma.com](https://figma.com)
2. Klik "New Design File"
3. Rename file: "Nasional Elektronik - E-commerce Design System"

### 2. Setup Pages
Buat pages berikut di Figma:
- 📐 **Wireframes** - Low fidelity wireframes
- 🎨 **Design System** - Components library
- 🖼️ **Mockups** - High fidelity designs
- 📱 **Mobile** - Mobile responsive designs
- 🔄 **Prototype** - Interactive prototype flows

---

## 📦 Struktur Komponen Figma

### A. DESIGN TOKENS (Variables)

#### Colors
```
Primary Colors:
- Primary/500: #3B82F6 (Main brand color)
- Primary/600: #2563EB
- Primary/700: #1D4ED8

Secondary Colors:
- Secondary/500: #10B981
- Secondary/600: #059669

Neutral Colors:
- Gray/50: #F9FAFB
- Gray/100: #F3F4F6
- Gray/200: #E5E7EB
- Gray/300: #D1D5DB
- Gray/400: #9CA3AF
- Gray/500: #6B7280
- Gray/600: #4B5563
- Gray/700: #374151
- Gray/800: #1F2937
- Gray/900: #111827

Semantic Colors:
- Success: #10B981
- Warning: #F59E0B
- Error: #EF4444
- Info: #3B82F6
```

#### Typography
```
Font Family: Inter / Poppins

Heading 1: 48px / Bold / Line-height 1.2
Heading 2: 40px / Bold / Line-height 1.2
Heading 3: 32px / Semibold / Line-height 1.3
Heading 4: 24px / Semibold / Line-height 1.4
Heading 5: 20px / Medium / Line-height 1.4
Heading 6: 18px / Medium / Line-height 1.5

Body Large: 18px / Regular / Line-height 1.6
Body: 16px / Regular / Line-height 1.6
Body Small: 14px / Regular / Line-height 1.5
Caption: 12px / Regular / Line-height 1.4
```

#### Spacing Scale
```
4px, 8px, 12px, 16px, 20px, 24px, 32px, 40px, 48px, 64px, 80px, 96px
```

#### Border Radius
```
xs: 4px
sm: 6px
md: 8px
lg: 12px
xl: 16px
2xl: 24px
full: 9999px
```

---

### B. ATOMIC COMPONENTS

#### 1. Button Component
**Variants:**
```
├─ Button
   ├─ Size: Small / Medium / Large
   ├─ Variant: Primary / Secondary / Outline / Ghost / Link
   ├─ State: Default / Hover / Active / Disabled / Loading
   └─ Icon: None / Left / Right / Icon Only
```

**Properties:**
- Width: Hug / Fixed / Fill
- Corner radius: 8px
- Padding: 12px 24px (Medium)
- Text: Button Text
- Icon: Optional

**Auto Layout:**
- Horizontal padding: 24px
- Vertical padding: 12px
- Gap: 8px (between icon and text)

---

#### 2. Input Field Component
**Variants:**
```
├─ Input
   ├─ Type: Text / Email / Password / Number / Search
   ├─ State: Default / Focused / Error / Disabled
   ├─ Size: Small / Medium / Large
   └─ Icon: None / Left / Right
```

**Properties:**
- Width: Fill container
- Height: 44px (Medium)
- Border: 1px solid Gray/300
- Padding: 12px 16px
- Placeholder text: Gray/400

---

#### 3. Card Component
**Variants:**
```
├─ Card
   ├─ Type: Product / Category / Feature / Blog
   ├─ Size: Small / Medium / Large
   └─ State: Default / Hover / Selected
```

**Structure:**
- Container with auto layout
- Border radius: 12px
- Shadow: 0px 2px 8px rgba(0,0,0,0.08)
- Padding: 16px

---

#### 4. Icon Component
**Setup:**
- Use [Heroicons](https://heroicons.com/) or [Lucide Icons](https://lucide.dev/)
- Create as components: 16px, 20px, 24px, 32px sizes
- Color: Inherit from parent

**Common Icons:**
- Search, Cart, Heart, User, Menu, Close
- Arrow Left/Right, Chevron Down/Up
- Star (filled/outline), Check, X

---

#### 5. Badge/Tag Component
**Variants:**
```
├─ Badge
   ├─ Variant: Default / Success / Warning / Error / Info
   ├─ Size: Small / Medium / Large
   └─ Icon: None / Left
```

---

### C. MOLECULAR COMPONENTS

#### 1. Product Card
**Struktur:**
```
Product Card (Auto Layout Vertical, gap: 12px)
├─ Image Container (aspect ratio 1:1)
│  ├─ Product Image
│  ├─ Badge (New/Sale) - Absolute position
│  └─ Wishlist Button - Absolute position (top right)
├─ Product Info (Auto Layout Vertical, gap: 8px)
│  ├─ Category Text (12px, Gray/600)
│  ├─ Product Name (16px, Gray/900, 2 lines max)
│  ├─ Rating Component (Stars + Review count)
│  ├─ Price Container (Auto Layout Horizontal)
│  │  ├─ Current Price (20px, Bold, Primary)
│  │  └─ Original Price (16px, Strike-through, Gray/400)
│  └─ Actions (Auto Layout Horizontal, gap: 8px)
│     ├─ Add to Cart Button (Primary)
│     └─ Quick View Button (Outline)
```

**Component Properties:**
- Product image: Image fill
- Product name: Text
- Price: Number
- Rating: 1-5 stars
- On sale: Boolean (shows/hides badge)
- In stock: Boolean

---

#### 2. Header Component
**Struktur:**
```
Header (Auto Layout Vertical)
├─ Header Top (Auto Layout Horizontal, Space Between)
│  ├─ Contact Info
│  └─ Language/Currency/Account
├─ Header Main (Auto Layout Horizontal, gap: 24px)
│  ├─ Logo
│  ├─ Search Bar (Fill container)
│  └─ Icons Group
│     ├─ Wishlist (with badge)
│     ├─ Cart (with badge)
│     └─ User Menu
└─ Navigation (Auto Layout Horizontal, gap: 32px)
   ├─ Nav Item x 6
   └─ Dropdown indicator
```

**States:**
- Default (sticky top)
- Scrolled (with shadow)
- Mobile (hamburger menu)

---

#### 3. Search Bar Component
**Struktur:**
```
Search Bar (Auto Layout Horizontal)
├─ Search Icon (24px, Gray/400)
├─ Input Field (Fill container)
├─ Category Dropdown (Optional)
└─ Search Button (Primary)
```

**States:**
- Default
- Focused (border color Primary/500)
- With suggestions (dropdown)

---

#### 4. Navigation Item
**Variants:**
```
├─ Nav Item
   ├─ State: Default / Hover / Active
   └─ Type: Link / Dropdown
```

**Dropdown variant:**
- Mega menu support
- Category grid layout
- Featured products section

---

#### 5. Product Rating Component
**Struktur:**
```
Rating (Auto Layout Horizontal, gap: 4px)
├─ Stars Container (5 stars)
│  └─ Star Icon (filled/half/outline)
├─ Rating Number (4.5)
└─ Review Count ((128 reviews))
```

---

### D. ORGANISM COMPONENTS

#### 1. Hero Section
**Struktur:**
```
Hero (Auto Layout Horizontal/Grid)
├─ Background Image/Gradient
├─ Content Container
│  ├─ Badge/Tag
│  ├─ Heading (H1)
│  ├─ Description
│  └─ CTA Buttons Group
└─ Hero Image/Product (Optional)
```

**Variants:**
- Single slide
- Carousel (with dots/arrows)
- Split layout (50/50)

---

#### 2. Product Grid Section
**Struktur:**
```
Product Section (Auto Layout Vertical, gap: 32px)
├─ Section Header
│  ├─ Title + Subtitle
│  └─ View All Link
├─ Filters Bar (Optional)
│  ├─ Category tabs
│  └─ Sort dropdown
└─ Products Grid (Auto Layout, Wrap)
   └─ Product Card x N
```

**Grid Settings:**
- Columns: 4 (Desktop), 2 (Tablet), 1 (Mobile)
- Gap: 24px

---

#### 3. Category Menu
**Struktur:**
```
Category Section (Auto Layout Vertical)
├─ Section Title
└─ Category Grid (4 or 6 columns)
   └─ Category Card
      ├─ Icon/Image
      ├─ Category Name
      └─ Product Count
```

---

#### 4. Footer
**Struktur:**
```
Footer (Auto Layout Vertical)
├─ Footer Main (Grid 4 columns)
│  ├─ Company Info + Logo
│  ├─ Quick Links
│  ├─ Customer Service
│  └─ Newsletter Signup
├─ Footer Middle (Payment methods + Social)
└─ Footer Bottom (Copyright + Legal links)
```

---

### E. TEMPLATE/PAGE COMPONENTS

#### 1. Homepage Template
**Section Order:**
```
1. Header (Sticky)
2. Hero Slider
3. Features/Incentives (4 items)
4. Featured Products (Horizontal scroll)
5. Category Menu (Grid)
6. New Arrivals (Grid with filters)
7. Banner/Promotion
8. Best Sellers (Grid)
9. Newsletter
10. Footer
```

---

#### 2. Shop/Product Listing Template
**Layout:**
```
├─ Breadcrumb
├─ Page Title + Results count
├─ Container (Grid: Sidebar + Main)
│  ├─ Sidebar (Filters)
│  │  ├─ Categories
│  │  ├─ Price Range
│  │  ├─ Brands
│  │  ├─ Ratings
│  │  └─ More filters
│  └─ Main Content
│     ├─ Sort + View Toggle (Grid/List)
│     ├─ Products Grid
│     └─ Pagination
```

---

#### 3. Product Detail Template
**Layout:**
```
├─ Breadcrumb
├─ Product Container (Grid: 50/50)
│  ├─ Product Images
│  │  ├─ Main Image (Zoom on hover)
│  │  └─ Thumbnail Gallery
│  └─ Product Info
│     ├─ Product Name
│     ├─ Rating + Reviews
│     ├─ Price
│     ├─ Variant Selector (Color, Size)
│     ├─ Quantity Selector
│     ├─ Action Buttons
│     ├─ Product Features
│     └─ Social Share
├─ Product Tabs
│  ├─ Description
│  ├─ Specifications
│  ├─ Reviews
│  └─ Q&A
└─ Related Products
```

---

#### 4. Shopping Cart Template
**Layout:**
```
├─ Page Title
├─ Cart Container (Grid: 2/3 + 1/3)
│  ├─ Cart Items
│  │  └─ Cart Item x N
│  │     ├─ Product Image
│  │     ├─ Product Info
│  │     ├─ Quantity Control
│  │     ├─ Price
│  │     └─ Remove Button
│  └─ Order Summary
│     ├─ Subtotal
│     ├─ Shipping
│     ├─ Discount
│     ├─ Total
│     └─ Checkout Button
└─ Continue Shopping Link
```

---

#### 5. Checkout Template
**Multi-step Layout:**
```
├─ Progress Indicator (Steps)
├─ Checkout Container (Grid: 2/3 + 1/3)
│  ├─ Form Section
│  │  ├─ Step 1: Shipping Information
│  │  ├─ Step 2: Payment Method
│  │  └─ Step 3: Review Order
│  └─ Order Summary (Sticky)
│     ├─ Products List
│     ├─ Totals
│     └─ Security Badge
```

---

#### 6. Dashboard Template (Admin)
**Layout:**
```
├─ Dashboard Header
├─ Container (Grid: Sidebar + Main)
│  ├─ Sidebar Navigation
│  │  ├─ Dashboard
│  │  ├─ Orders
│  │  ├─ Products
│  │  ├─ Customers
│  │  ├─ Analytics
│  │  └─ Settings
│  └─ Main Content
│     ├─ Page Title + Actions
│     ├─ Stats Cards (4 items)
│     ├─ Charts
│     └─ Data Table
```

---

## 🎯 Langkah-langkah Membuat di Figma

### Step 1: Setup Foundation (30 menit)
1. **Create Color Styles**
   - Buat local styles untuk semua warna
   - Group by: Primary, Secondary, Neutral, Semantic
   
2. **Create Text Styles**
   - Import font (Inter/Poppins dari Google Fonts)
   - Buat text styles untuk semua typography
   
3. **Create Effect Styles**
   - Shadows: sm, md, lg, xl
   - Focus rings
   
4. **Create Grid Styles**
   - Desktop: 12 columns, 24px gutter, 120px margin
   - Tablet: 8 columns, 20px gutter, 40px margin
   - Mobile: 4 columns, 16px gutter, 20px margin

---

### Step 2: Build Atomic Components (1-2 jam)
1. Create frame: "Atoms"
2. Build components:
   - Buttons (all variants)
   - Input fields
   - Icons
   - Badges/Tags
   - Links
   - Checkboxes/Radio buttons
   
3. **Use Component Properties:**
   - Boolean (show/hide elements)
   - Text (dynamic content)
   - Instance swap (icons)
   - Variant selection

---

### Step 3: Build Molecular Components (2-3 jam)
1. Create frame: "Molecules"
2. Build components:
   - Product Card
   - Search Bar
   - Navigation Item
   - Rating Component
   - Breadcrumb
   - Pagination
   
3. **Use Auto Layout extensively**
4. Add hover/active states

---

### Step 4: Build Organism Components (2-3 jam)
1. Create frame: "Organisms"
2. Build components:
   - Header (with all variations)
   - Footer
   - Hero Section
   - Product Grid
   - Category Menu
   - Filters Sidebar
   
3. Make responsive variants

---

### Step 5: Create Pages (3-4 jam)
1. Create frame: "Pages - Desktop (1440px)"
2. Build all pages:
   - Homepage
   - Shop/Listing
   - Product Detail
   - Cart
   - Checkout
   - Dashboard
   
3. Duplicate and create mobile versions (375px)

---

### Step 6: Add Interactions & Prototype (1-2 jam)
1. Link pages together
2. Add interactions:
   - Button hover states
   - Modal open/close
   - Dropdown menus
   - Image galleries
   - Add to cart animation
   
3. Create prototype flows:
   - Browse → Product → Cart → Checkout
   - Login → Dashboard
   - Search → Results

---

### Step 7: Documentation (1 jam)
1. Add cover page with project info
2. Create component documentation
3. Add usage guidelines
4. Export design specs for developers

---

## 📱 Responsive Breakpoints

```
Mobile: 375px - 767px
Tablet: 768px - 1023px
Desktop: 1024px - 1440px
Large Desktop: 1441px+
```

---

## 🚀 Tips & Best Practices

### 1. Naming Convention
```
Component/Variant/State/Size
Example: Button/Primary/Hover/Large
```

### 2. Auto Layout Mastery
- Use for ALL components
- Set resizing rules properly
- Use spacing tokens consistently

### 3. Component Properties
- Maximum reusability
- Minimize number of variants
- Use instance swapping for icons

### 4. Organize Layers
```
📁 Page Name
  📁 Section Name
    📁 Component Name
      📁 Element
```

### 5. Use Plugins
- **Iconify** - Icon library
- **Unsplash** - Stock images
- **Content Reel** - Dummy data
- **Stark** - Accessibility check
- **AutoFlow** - Create flows
- **Figma to Code** - Export to HTML/React

### 6. Collaboration
- Use comments for feedback
- Share with developers (Dev Mode)
- Create design system documentation
- Version control with branching

---

## 📤 Export untuk Development

### Design Tokens Export
- Use **Tokens Studio** plugin
- Export as JSON
- Import to Tailwind config

### Assets Export
```
Icons: SVG
Images: WebP/PNG (2x for retina)
Fonts: WOFF2
```

### Developer Handoff
- Use Figma Dev Mode
- Add component specs
- Include interaction notes
- Link to code examples

---

## 🎨 Link Template Figma Gratis

1. **E-commerce UI Kit** (Community file)
   - https://www.figma.com/community/search?model_type=files&q=ecommerce

2. **Electronic Store Template**
   - https://www.figma.com/community/file/electronics-ecommerce

3. **Design System Template**
   - https://www.figma.com/community/file/design-system

---

## ✅ Checklist Completion

### Phase 1: Foundation
- [ ] Setup color styles
- [ ] Setup typography styles
- [ ] Setup spacing system
- [ ] Create grid layouts

### Phase 2: Components
- [ ] Atomic components (10+ items)
- [ ] Molecular components (10+ items)
- [ ] Organism components (5+ items)
- [ ] All components have variants
- [ ] All components use auto layout

### Phase 3: Pages
- [ ] Homepage
- [ ] Shop/Listing page
- [ ] Product detail page
- [ ] Cart page
- [ ] Checkout page
- [ ] Dashboard page
- [ ] Mobile versions

### Phase 4: Prototype
- [ ] User flow linked
- [ ] Interactions added
- [ ] Animations smooth
- [ ] Mobile prototype

### Phase 5: Handoff
- [ ] Components documented
- [ ] Design specs exported
- [ ] Assets exported
- [ ] Developer access granted

---

## 📞 Need Help?

- **Figma Learn**: https://help.figma.com/
- **YouTube Tutorials**: Search "Figma e-commerce design"
- **Community Files**: Figma Community tab

---

**Estimasi Total Waktu:** 12-16 jam untuk complete design system + mockups

Good luck! 🚀
