# Testing Guide - Figma Plugin

## 🐛 Bug Fixed

**Problem:** The plugin was creating frames but not adding them to the Figma page, causing them to disappear.

**Solution:** Added `figma.currentPage.appendChild()` calls to properly add the generated frames to the page.

---

## ✅ How to Test the Plugin

### Step 1: Install the Plugin

1. Open **Figma Desktop App** (not browser)
2. Copy these 3 files to your plugin folder:
   - `manifest.json`
   - `code.js`
   - `ui.html`
3. In Figma: `Plugins` → `Development` → `Import plugin from manifest...`
4. Select the `manifest.json` file

### Step 2: Run the Plugin

1. Create a new Figma file
2. Run plugin: `Plugins` → `Development` → `Nasional Elektronik - Page Generator`
3. Click the **"Generate Pages"** button
4. Wait 5-10 seconds

### Step 3: Expected Result

You should see a new page created named: **"📄 Pages - Nasional Elektronik"**

This page will contain **TWO frames side by side:**

#### Left Frame: **Homepage - Desktop** (1440 × 4000px)
- Header with logo, search bar, navigation
- Hero section with placeholder text
- Featured Products section with 4 product cards
- Footer with 4 columns

#### Right Frame: **Shop Page - Desktop** (1440 × 3000px)
- Header (same as homepage)
- Breadcrumb: 🏠 Home > Belanja > Semua produk
- **Left Sidebar (200px):**
  - Filters title
  - Ketersediaan checkboxes
  - Harga slider (0-3000)
  - Rating slider (0-5)
- **Main Content:**
  - "SEMUA PRODUK" title
  - Sort dropdown
  - 12 product cards in 3×4 grid
  - Pagination buttons
- Footer

---

## 🎯 What Changed in the Code

### `code.js` - Line 677-680
**BEFORE:**
```javascript
// Generate Homepage
const homepage = await createHomepageFrame();
homepage.x = 0;
homepage.y = 0;

// Generate Shop Page
const shopPage = await createShopPageFrame();
shopPage.x = 1600;
shopPage.y = 0;
```

**AFTER:**
```javascript
// Generate Homepage
const homepage = await createHomepageFrame();
homepage.x = 0;
homepage.y = 0;
figma.currentPage.appendChild(homepage);  // ✅ ADDED THIS

// Generate Shop Page
const shopPage = await createShopPageFrame();
shopPage.x = 1600;
shopPage.y = 0;
figma.currentPage.appendChild(shopPage);  // ✅ ADDED THIS
```

### Also Removed:
- Duplicate `generateShopPage()` function (was leftover from old code)
- Old atom/molecule/organism generation functions are still present but not used

---

## 🔍 Troubleshooting

### If you see "Design System" page but no Homepage/Shop Page:
- This was the bug we fixed
- Make sure you're using the latest `code.js` file
- Reload the plugin in Figma

### If you get a font error:
- The plugin loads Inter font (Regular, Medium, Bold)
- Make sure Inter font is available in your Figma file

### If nothing happens:
- Check Figma's developer console for errors
- Make sure you clicked "Generate Pages" not any other button

---

## 📝 Code Structure

```
generateAllPages()
├── Load fonts (Inter: Regular, Medium, Bold)
├── Create new page "📄 Pages - Nasional Elektronik"
├── createHomepageFrame()
│   ├── createHeader()
│   ├── Hero section
│   ├── Product grid with createProductCard() × 4
│   └── createFooter()
└── createShopPageFrame()
    ├── createHeader()
    ├── createBreadcrumb()
    ├── createFiltersSidebar()
    │   ├── Ketersediaan checkboxes
    │   ├── createSlider() for price
    │   └── createRatingSlider()
    ├── Products grid with createProductCard() × 12
    ├── createPagination()
    └── createFooter()
```

---

## ✨ Next Steps

After testing, you can:
1. Customize colors in the frames
2. Add your own branding
3. Export as wireframes
4. Share with your team
5. Use as design reference for development

---

**Last Updated:** November 19, 2025
**Bug Fixed:** Frames not appearing on page
**Status:** ✅ Working
