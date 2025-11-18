# Figma Plugin - Nasional Elektronik Component Generator

Plugin Figma untuk auto-generate UI components untuk e-commerce platform Nasional Elektronik.

## 🚀 Cara Install Plugin

### Method 1: Development Mode (Recommended)

1. **Buka Figma Desktop App** (bukan browser)

2. **Buat folder plugin** di komputer Anda:
   ```
   C:\Users\Richcie\Documents\Figma Plugins\nasional-elektronik-generator\
   ```

3. **Copy 3 file ini** ke folder tersebut:
   - `manifest.json`
   - `code.js`
   - `ui.html`

4. **Di Figma, buka menu:**
   - `Plugins` → `Development` → `Import plugin from manifest...`

5. **Navigate ke folder plugin** dan pilih file `manifest.json`

6. **Plugin siap digunakan!** Akses via:
   - `Plugins` → `Development` → `Nasional Elektronik - Component Generator`

---

### Method 2: Quick Test

1. **Buka Figma**
2. **Create new file**
3. **Buka Console:** `Plugins` → `Development` → `Open Console`
4. **Copy-paste code dari `code.js`** ke console
5. **Run!**

---

## 🎨 Cara Menggunakan Plugin

### Quick Start (Otomatis)

1. **Jalankan plugin** dari menu Plugins
2. **Klik "Generate All Components"**
3. **Tunggu 10-30 detik**
4. **Done!** Semua components sudah dibuat

### Step by Step (Manual)

Jika ingin generate satu per satu:

1. **Setup Design Tokens** → Membuat color styles, text styles, effect styles
2. **Generate Atoms** → Buttons, Inputs, Badges
3. **Generate Molecules** → Product Cards, Search Bar
4. **Generate Organisms** → Header, Footer
5. **Generate Pages** → Homepage template

---

## 📦 Yang Di-Generate oleh Plugin

### 1. Design Tokens & Styles

**Color Styles:**
- Primary colors (Blue)
- Secondary colors (Green)
- Neutral colors (Gray scale)
- Semantic colors (Success, Warning, Error, Info)

**Text Styles:**
- Heading 1-6
- Body Large/Regular/Small
- Caption

**Effect Styles:**
- Shadows (sm, md, lg, xl)

### 2. Atomic Components

**Button Component:**
- Variants: Primary, Secondary, Outline, Ghost
- States: Default, Hover, Active, Disabled
- Sizes: Small, Medium, Large

**Input Component:**
- Types: Text, Email, Password, Search
- States: Default, Focused, Error, Disabled

**Badge Component:**
- Variants: New, Sale, Popular
- Colors: Blue, Red, Green

### 3. Molecular Components

**Product Card:**
- Product image placeholder
- Product name
- Price display
- Add to cart button
- Wishlist button

**Search Bar:**
- Search icon
- Input field
- Search button

### 4. Organism Components

**Header:**
- Logo
- Search bar
- Navigation menu
- Icons (Wishlist, Cart, User)

**Footer:**
- 4 columns layout
- Links sections
- Copyright

### 5. Page Templates

**Homepage:**
- Header (sticky)
- Hero section
- Featured products grid
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
- [ ] Shop/Listing page (TODO)
- [ ] Product detail page (TODO)
- [ ] Cart page (TODO)
- [ ] Checkout page (TODO)
- [ ] Dashboard page (TODO)

---

## 🚧 TODO - Future Enhancements

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
