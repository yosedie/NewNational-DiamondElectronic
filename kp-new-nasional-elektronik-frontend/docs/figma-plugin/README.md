# Figma Plugin - Nasional Elektronik Page Generator

Plugin Figma untuk auto-generate wireframe pages untuk e-commerce platform Nasional Elektronik.

## 🚀 Cara Install Plugin

### Method 1: Development Mode (Recommended)

1. **Buka Figma Desktop App** (bukan browser)

2. **Buat folder plugin** di komputer Anda:
   ```
   C:\Users\[YourName]\Documents\Figma Plugins\nasional-elektronik-generator\
   ```

3. **Copy 3 file ini** ke folder tersebut:
   - `manifest.json`
   - `code.js`
   - `ui.html`

4. **Di Figma, buka menu:**
   - `Plugins` → `Development` → `Import plugin from manifest...`

5. **Navigate ke folder plugin** dan pilih file `manifest.json`

6. **Plugin siap digunakan!** Akses via:
   - `Plugins` → `Development` → `Nasional Elektronik - Page Generator`

---

## 🎨 Cara Menggunakan Plugin

### Simple & Easy (Otomatis)

1. **Jalankan plugin** dari menu Plugins
2. **Klik "Generate Pages"**
3. **Tunggu 5-10 detik**
4. **Done!** Kedua pages (Homepage dan Shop Page) sudah dibuat side-by-side

---

## 📦 Yang Di-Generate oleh Plugin

### Pages Generated:

**1. Homepage (Left)**
- Header dengan logo, search bar, dan navigation
- Hero section dengan placeholder
- Featured products grid (4 produk)
- Footer dengan 4 kolom

**2. Shop/Listing Page (Right)**
- Header (sama seperti homepage)
- Breadcrumb navigation (Home > Belanja > Semua produk)
- **Filters Sidebar (200px):**
  - Ketersediaan (Stock tersedia/habis checkboxes)
  - Harga filter (Range slider 0-3000)
  - Minimum Rating (Range slider 0-5 stars)
- **Main Products Area:**
  - Page title "SEMUA PRODUK"
  - Sort dropdown (Urutkan bedasarkan)
  - Product grid (3 kolom x 4 baris = 12 produk)
  - Pagination (Previous, Page 1, Next)
- Footer

---

## 🛠️ Customization

### Mengubah Warna Brand

Edit di file `code.js`, bagian `createColorStyles()`:

```javascript
const colors = {
  'Primary/500': { r: 0.23, g: 0.51, b: 0.96 }, // Ubah ini
  // ... dst
};
```

### Mengubah Font

Edit di file `code.js`, fungsi `createTextStyles()`:

```javascript
style.fontName = { family: 'Poppins', style: 'Bold' }; // Ganti font
```

### Mengubah Ukuran Components

Edit setiap fungsi `create...()`, misalnya:

```javascript
button.resize(140, 44); // Width, Height
```

---

## 📋 Checklist Development

### Phase 1: Foundation ✅
- [x] Setup color styles
- [x] Setup typography styles
- [x] Setup spacing system
- [x] Create effect styles (shadows)

### Phase 2: Atoms ✅
- [x] Button component (4 variants)
- [x] Input component
- [x] Badge component
- [ ] Icon component (TODO)
- [ ] Checkbox component (TODO)
- [ ] Radio component (TODO)

### Phase 3: Molecules ✅
- [x] Product card
- [x] Search bar
- [ ] Rating component (TODO)
- [ ] Quantity input (TODO)
- [ ] Breadcrumb (TODO)

### Phase 4: Organisms ✅
- [x] Header
- [x] Footer
- [ ] Product grid section (TODO)
- [ ] Category menu (TODO)
- [ ] Filters sidebar (TODO)

### Phase 5: Templates ✅
- [x] Homepage
- [x] Shop/Listing page ✅ NEW!
- [ ] Product detail page (TODO)
- [ ] Cart page (TODO)
- [ ] Checkout page (TODO)
- [ ] Dashboard page (TODO)

---

## � Shop/Listing Page Structure (DETAILED)

The Shop/Listing page is a complete e-commerce product listing page with filters and sorting capabilities.

### Layout Structure:

```
┌─────────────────────────────────────────────────────────────┐
│                         HEADER                               │
│  Logo | Search Bar          | Wishlist | Cart | User        │
│  Home | Shop | Categories | Deals | About | Contact         │
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│  🏠 Home > Belanja > Semua produk       (Breadcrumb)        │
└─────────────────────────────────────────────────────────────┘
┌──────────────┬──────────────────────────────────────────────┐
│              │  SEMUA PRODUK       Urutkan bedasarkan: [▼] │
│  FILTERS     │  ─────────────────────────────────────────── │
│              │                                               │
│ Ketersediaan │  ┌────────┐ ┌────────┐ ┌────────┐          │
│ ☑ Stock ada  │  │Product │ │Product │ │Product │          │
│ ☑ Stock habis│  │ Card 1 │ │ Card 2 │ │ Card 3 │          │
│              │  └────────┘ └────────┘ └────────┘          │
│ ─────────    │                                               │
│              │  ┌────────┐ ┌────────┐ ┌────────┐          │
│ Harga        │  │Product │ │Product │ │Product │          │
│ [━━━━━━━━]   │  │ Card 4 │ │ Card 5 │ │ Card 6 │          │
│ Max: $3000   │  └────────┘ └────────┘ └────────┘          │
│              │                                               │
│ ─────────    │  ┌────────┐ ┌────────┐ ┌────────┐          │
│              │  │Product │ │Product │ │Product │          │
│ Rating       │  │ Card 7 │ │ Card 8 │ │ Card 9 │          │
│ [━━━━━━━━]   │  └────────┘ └────────┘ └────────┘          │
│ 0 1 2 3 4 5  │                                               │
│              │  ┌────────┐ ┌────────┐ ┌────────┐          │
└──────────────┤  │Product │ │Product │ │Product │          │
               │  │Card 10 │ │Card 11 │ │Card 12 │          │
               │  └────────┘ └────────┘ └────────┘          │
               │                                               │
               │        [«] [Page 1] [»]      (Pagination)    │
               └──────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│                         FOOTER                               │
│   About Us | Customer Service | Quick Links | Follow Us     │
│   © 2025 Nasional Elektronik. All rights reserved.          │
└─────────────────────────────────────────────────────────────┘
```

### Components Breakdown:

#### 1. **Breadcrumb Component**
- **Size:** 1280px x 40px
- **Elements:** Home icon, separators (>), navigation links
- **Colors:** Primary blue for links, gray for separators
- **Font:** Inter Regular 16px

#### 2. **Filters Sidebar**
- **Size:** 200px x 600px
- **Background:** Light gray (#F8F8F8)
- **Padding:** 20px
- **Border Radius:** 8px

**Filter Sections:**

a. **Ketersediaan (Availability)**
   - Title: "Ketersediaan" (Inter Medium 18px)
   - Checkbox: "☑ Stock tersedia" (In Stock)
   - Checkbox: "☑ Stock habis" (Out of Stock)
   - Divider below

b. **Harga (Price Filter)**
   - Title: "Harga" (Inter Medium 18px)
   - Range slider: 0-3000
   - Slider color: Primary blue
   - Label: "Harga maksimal: $3000"
   - Divider below

c. **Rating Filter**
   - Title: "Minimum Rating:" (Inter Medium 18px)
   - Range slider: 0-5 stars
   - Slider color: Green (#10B981)
   - Markers: 0, 1, 2, 3, 4, 5

#### 3. **Main Content Area**
- **Size:** 1040px width (flexible height)

**Header Section:**
- Title: "SEMUA PRODUK" (Inter Bold 24px)
- Sort dropdown: 200px x 44px
  - Label: "Urutkan bedasarkan:"
  - Options: Default, A-Z, Z-A, Lowest Price, Highest Price
  - Border: 2px gray
  - Dropdown arrow: ▼

#### 4. **Products Grid**
- **Layout:** 3 columns
- **Gap:** 24px horizontal, 24px vertical
- **Product Cards:** 320px x 420px each
- **Total:** 12 products (4 rows x 3 columns)

**Each Product Card includes:**
- Product image placeholder (248px x 248px)
- Product name (Inter Medium 16px)
- Price (Inter Bold 20px, primary blue)
- "Add to Cart" button

#### 5. **Pagination Component**
- **Size:** 1040px x 80px
- **Centered layout**
- **Buttons:**
  - Previous: « (50px x 50px)
  - Current Page: "Page 1" (100px x 50px)
  - Next: » (50px x 50px)
- **Colors:** Custom red (#EF4444)
- **Text:** White, Inter Bold 16px
- **Shadow:** 0px 2px 4px rgba(0,0,0,0.1)

### Design Tokens Used:

**Colors:**
- Primary Blue: #3B82F6 (links, sliders, prices)
- Custom Red: #EF4444 (pagination buttons)
- Success Green: #10B981 (rating slider)
- Gray 50: #F8F8F8 (sidebar background)
- Gray 200: #E5E7EB (dividers)
- Gray 400: #9CA3AF (borders)
- Gray 900: #111827 (text)
- White: #FFFFFF (cards, backgrounds)

**Typography:**
- Headings: Inter Bold (24px, 20px, 18px)
- Body: Inter Medium (16px)
- Labels: Inter Regular (16px, 14px, 12px)

**Spacing:**
- Container padding: 80px (left/right)
- Section spacing: 40px
- Component spacing: 24px
- Item spacing: 12px, 8px

**Shadows:**
- Card shadow: 0px 4px 6px rgba(0,0,0,0.1)
- Button shadow: 0px 2px 4px rgba(0,0,0,0.1)

### Responsive Breakpoints (for reference):

- **Desktop:** 1440px
- **Tablet:** < 1300px (3 columns → 2 columns)
- **Mobile:** < 500px (2 columns → 1 column)

---

## �🚧 TODO - Future Enhancements

### Components Tambahan:
- [ ] Icon library (50+ icons)
- [ ] Modal/Dialog component
- [ ] Dropdown menu component
- [ ] Tab component
- [ ] Accordion component
- [ ] Tooltip component
- [ ] Pagination component
- [ ] Data table component

### Features Tambahan:
- [ ] Dark mode variants
- [ ] Mobile responsive variants
- [ ] Animation presets
- [ ] Component variants (more states)
- [ ] Auto-generate prototype connections
- [ ] Export to code (React/Vue)

### Pages Tambahan:
- [ ] Product listing page
- [ ] Product detail page
- [ ] Shopping cart page
- [ ] Checkout page (multi-step)
- [ ] User dashboard page
- [ ] Admin dashboard page
- [ ] Login/Register pages
- [ ] Order confirmation page

---

## 🐛 Troubleshooting

### Plugin tidak muncul di menu
- Pastikan menggunakan **Figma Desktop App** (bukan browser)
- Re-import manifest.json
- Restart Figma

### Error: "Cannot find font Inter"
- Install font Inter dari Google Fonts
- Atau ganti font di code.js

### Components tidak ter-generate
- Cek Console untuk error messages
- Pastikan ada selected frame/page
- Restart plugin

### Layout berantakan
- Pastikan menggunakan Auto Layout
- Check padding & spacing values
- Reset layout mode

---

## 📚 Resources

### Figma Plugin API:
- https://www.figma.com/plugin-docs/

### Auto Layout Tutorial:
- https://help.figma.com/hc/en-us/articles/360040451373

### Component Best Practices:
- https://www.figma.com/best-practices/components-styles-and-shared-libraries/

---

## 🤝 Contributing

Ingin menambahkan components atau features?

1. Fork repository
2. Tambahkan fungsi di `code.js`
3. Update `ui.html` untuk button baru
4. Test di Figma
5. Submit PR

---

## 📝 License

MIT License - Free to use and modify

---

## 👨‍💻 Author

Created for: **Nasional Elektronik E-commerce Platform**
Date: November 2025

---

## 💡 Tips

1. **Gunakan Auto Layout** untuk semua components
2. **Create component variants** untuk reusability
3. **Use consistent naming** convention
4. **Add descriptions** ke components
5. **Organize dengan pages** (Atoms, Molecules, dst)
6. **Test responsive** di berbagai ukuran
7. **Document your components** dengan examples

---

## 🎯 Next Steps

Setelah generate components:

1. **Customize colors** sesuai brand
2. **Add more variants** per component
3. **Create interactions** untuk prototype
4. **Add real images** dan content
5. **Test user flow** dengan prototype
6. **Export assets** untuk development
7. **Share dengan team** via Figma library

---

## ⚡ Quick Commands

```
Generate All → Ctrl/Cmd + Enter
Close Plugin → Escape
```

---

**Happy Designing! 🎨✨**
