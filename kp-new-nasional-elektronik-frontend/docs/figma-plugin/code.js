// Figma Plugin - Nasional Elektronik Component Generator
// This plugin generates e-commerce UI components automatically

// Show UI
figma.showUI(__html__, { width: 400, height: 500 });

// Listen for messages from UI
figma.ui.onmessage = async (msg) => {
  if (msg.type === 'generate-all-pages') {
    await generateAllPages();
    figma.ui.postMessage({ type: 'generation-complete' });
    figma.notify('🎉 Homepage and Shop page generated successfully!');
  } else if (msg.type === 'cancel') {
    figma.closePlugin();
  }
};

// ==========================================
// SETUP DESIGN TOKENS & STYLES
// ==========================================
async function setupDesignTokens() {
  const page = figma.createPage();
  page.name = "🎨 Design System";
  figma.currentPage = page;

  // Create color styles
  createColorStyles();
  
  // Create text styles
  createTextStyles();
  
  // Create effect styles (shadows)
  createEffectStyles();
}

function createColorStyles() {
  const colors = {
    // Primary Colors
    'Primary/500': { r: 0.23, g: 0.51, b: 0.96 }, // #3B82F6
    'Primary/600': { r: 0.15, g: 0.39, b: 0.92 }, // #2563EB
    'Primary/700': { r: 0.11, g: 0.31, b: 0.85 }, // #1D4ED8
    
    // Secondary Colors
    'Secondary/500': { r: 0.06, g: 0.72, b: 0.51 }, // #10B981
    'Secondary/600': { r: 0.02, g: 0.59, b: 0.41 }, // #059669
    
    // Neutral Colors
    'Gray/50': { r: 0.98, g: 0.98, b: 0.98 },
    'Gray/100': { r: 0.95, g: 0.96, b: 0.96 },
    'Gray/200': { r: 0.90, g: 0.91, b: 0.92 },
    'Gray/300': { r: 0.82, g: 0.84, b: 0.86 },
    'Gray/400': { r: 0.61, g: 0.64, b: 0.69 },
    'Gray/500': { r: 0.42, g: 0.45, b: 0.50 },
    'Gray/600': { r: 0.29, g: 0.33, b: 0.39 },
    'Gray/700': { r: 0.22, g: 0.26, b: 0.31 },
    'Gray/800': { r: 0.12, g: 0.16, b: 0.22 },
    'Gray/900': { r: 0.07, g: 0.11, b: 0.15 },
    
    // Semantic Colors
    'Success': { r: 0.06, g: 0.72, b: 0.51 },
    'Warning': { r: 0.96, g: 0.62, b: 0.04 },
    'Error': { r: 0.94, g: 0.27, b: 0.27 },
    'Info': { r: 0.23, g: 0.51, b: 0.96 },
    
    // Base Colors
    'White': { r: 1, g: 1, b: 1 },
    'Black': { r: 0, g: 0, b: 0 },
  };

  Object.entries(colors).forEach(([name, color]) => {
    const style = figma.createPaintStyle();
    style.name = `Colors/${name}`;
    style.paints = [{ type: 'SOLID', color }];
  });
}

function createTextStyles() {
  const textStyles = [
    { name: 'Heading 1', size: 48, weight: 700, lineHeight: 1.2 },
    { name: 'Heading 2', size: 40, weight: 700, lineHeight: 1.2 },
    { name: 'Heading 3', size: 32, weight: 600, lineHeight: 1.3 },
    { name: 'Heading 4', size: 24, weight: 600, lineHeight: 1.4 },
    { name: 'Heading 5', size: 20, weight: 500, lineHeight: 1.4 },
    { name: 'Heading 6', size: 18, weight: 500, lineHeight: 1.5 },
    { name: 'Body Large', size: 18, weight: 400, lineHeight: 1.6 },
    { name: 'Body', size: 16, weight: 400, lineHeight: 1.6 },
    { name: 'Body Small', size: 14, weight: 400, lineHeight: 1.5 },
    { name: 'Caption', size: 12, weight: 400, lineHeight: 1.4 },
  ];

  textStyles.forEach(({ name, size, weight, lineHeight }) => {
    const style = figma.createTextStyle();
    style.name = `Typography/${name}`;
    style.fontSize = size;
    style.fontName = { family: 'Inter', style: weight >= 600 ? 'Bold' : weight >= 500 ? 'Medium' : 'Regular' };
    style.lineHeight = { unit: 'PERCENT', value: lineHeight * 100 };
  });
}

function createEffectStyles() {
  const shadows = [
    { name: 'Shadow/sm', y: 1, blur: 3, opacity: 0.1 },
    { name: 'Shadow/md', y: 4, blur: 6, opacity: 0.1 },
    { name: 'Shadow/lg', y: 10, blur: 15, opacity: 0.1 },
    { name: 'Shadow/xl', y: 20, blur: 25, opacity: 0.15 },
  ];

  shadows.forEach(({ name, y, blur, opacity }) => {
    const style = figma.createEffectStyle();
    style.name = name;
    style.effects = [{
      type: 'DROP_SHADOW',
      color: { r: 0, g: 0, b: 0, a: opacity },
      offset: { x: 0, y },
      radius: blur,
      visible: true,
      blendMode: 'NORMAL'
    }];
  });
}

// ==========================================
// GENERATE ATOMIC COMPONENTS
// ==========================================
async function generateAtoms() {
  const page = figma.createPage();
  page.name = "⚛️ Atoms";
  figma.currentPage = page;

  const frame = figma.createFrame();
  frame.name = "Atomic Components";
  frame.resize(1440, 2000);
  frame.fills = [{ type: 'SOLID', color: { r: 0.98, g: 0.98, b: 0.98 } }];

  let yOffset = 40;

  // Generate Button Component
  yOffset = await generateButtonComponent(frame, 40, yOffset);
  
  // Generate Input Component
  yOffset = await generateInputComponent(frame, 40, yOffset + 60);
  
  // Generate Badge Component
  yOffset = await generateBadgeComponent(frame, 40, yOffset + 60);
  
  figma.viewport.scrollAndZoomIntoView([frame]);
}

async function generateButtonComponent(parent, x, y) {
  await figma.loadFontAsync({ family: 'Inter', style: 'Medium' });
  
  const variants = [
    { name: 'Primary', bg: { r: 0.23, g: 0.51, b: 0.96 }, text: { r: 1, g: 1, b: 1 } },
    { name: 'Secondary', bg: { r: 0.06, g: 0.72, b: 0.51 }, text: { r: 1, g: 1, b: 1 } },
    { name: 'Outline', bg: { r: 1, g: 1, b: 1 }, text: { r: 0.23, g: 0.51, b: 0.96 }, stroke: true },
    { name: 'Ghost', bg: { r: 0.95, g: 0.96, b: 0.96 }, text: { r: 0.42, g: 0.45, b: 0.50 } },
  ];

  const label = figma.createText();
  label.characters = "Button Component";
  label.fontSize = 20;
  label.fontName = { family: 'Inter', style: 'Medium' };
  label.x = x;
  label.y = y;
  parent.appendChild(label);

  let xOffset = x;
  variants.forEach(variant => {
    const button = createButton(variant.name, variant.bg, variant.text, variant.stroke);
    button.x = xOffset;
    button.y = y + 40;
    parent.appendChild(button);
    xOffset += 160;
  });

  return y + 120;
}

function createButton(label, bgColor, textColor, hasStroke = false) {
  const button = figma.createFrame();
  button.name = `Button/${label}`;
  button.resize(140, 44);
  button.fills = [{ type: 'SOLID', color: bgColor }];
  button.cornerRadius = 8;
  button.paddingLeft = 24;
  button.paddingRight = 24;
  button.paddingTop = 12;
  button.paddingBottom = 12;
  button.primaryAxisAlignItems = 'CENTER';
  button.counterAxisAlignItems = 'CENTER';
  button.layoutMode = 'HORIZONTAL';

  if (hasStroke) {
    button.strokes = [{ type: 'SOLID', color: textColor }];
    button.strokeWeight = 2;
  }

  const text = figma.createText();
  text.fontName = { family: 'Inter', style: 'Medium' };
  text.fontSize = 16;
  text.characters = label;
  text.fills = [{ type: 'SOLID', color: textColor }];
  button.appendChild(text);

  return button;
}

async function generateInputComponent(parent, x, y) {
  await figma.loadFontAsync({ family: 'Inter', style: 'Regular' });
  
  const label = figma.createText();
  label.characters = "Input Component";
  label.fontSize = 20;
  label.fontName = { family: 'Inter', style: 'Medium' };
  label.x = x;
  label.y = y;
  parent.appendChild(label);

  const input = figma.createFrame();
  input.name = "Input/Default";
  input.resize(300, 44);
  input.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
  input.strokes = [{ type: 'SOLID', color: { r: 0.82, g: 0.84, b: 0.86 } }];
  input.strokeWeight = 1;
  input.cornerRadius = 8;
  input.paddingLeft = 16;
  input.paddingRight = 16;
  input.paddingTop = 12;
  input.paddingBottom = 12;
  input.layoutMode = 'HORIZONTAL';
  input.primaryAxisAlignItems = 'CENTER';
  input.x = x;
  input.y = y + 40;

  const placeholder = figma.createText();
  placeholder.fontName = { family: 'Inter', style: 'Regular' };
  placeholder.fontSize = 16;
  placeholder.characters = "Enter text...";
  placeholder.fills = [{ type: 'SOLID', color: { r: 0.61, g: 0.64, b: 0.69 } }];
  input.appendChild(placeholder);

  parent.appendChild(input);

  return y + 100;
}

async function generateBadgeComponent(parent, x, y) {
  await figma.loadFontAsync({ family: 'Inter', style: 'Medium' });
  
  const label = figma.createText();
  label.characters = "Badge Component";
  label.fontSize = 20;
  label.fontName = { family: 'Inter', style: 'Medium' };
  label.x = x;
  label.y = y;
  parent.appendChild(label);

  const badges = [
    { label: 'New', color: { r: 0.23, g: 0.51, b: 0.96 } },
    { label: 'Sale', color: { r: 0.94, g: 0.27, b: 0.27 } },
    { label: 'Popular', color: { r: 0.06, g: 0.72, b: 0.51 } },
  ];

  let xOffset = x;
  badges.forEach(({ label: badgeLabel, color }) => {
    const badge = createBadge(badgeLabel, color);
    badge.x = xOffset;
    badge.y = y + 40;
    parent.appendChild(badge);
    xOffset += 100;
  });

  return y + 100;
}

function createBadge(label, bgColor) {
  const badge = figma.createFrame();
  badge.name = `Badge/${label}`;
  badge.resize(60, 24);
  badge.fills = [{ type: 'SOLID', color: bgColor }];
  badge.cornerRadius = 12;
  badge.paddingLeft = 12;
  badge.paddingRight = 12;
  badge.paddingTop = 4;
  badge.paddingBottom = 4;
  badge.layoutMode = 'HORIZONTAL';
  badge.primaryAxisAlignItems = 'CENTER';
  badge.counterAxisAlignItems = 'CENTER';

  const text = figma.createText();
  text.fontName = { family: 'Inter', style: 'Medium' };
  text.fontSize = 12;
  text.characters = label;
  text.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
  badge.appendChild(text);

  return badge;
}

// ==========================================
// GENERATE MOLECULAR COMPONENTS
// ==========================================
async function generateMolecules() {
  const page = figma.createPage();
  page.name = "🧬 Molecules";
  figma.currentPage = page;

  const frame = figma.createFrame();
  frame.name = "Molecular Components";
  frame.resize(1440, 2000);
  frame.fills = [{ type: 'SOLID', color: { r: 0.98, g: 0.98, b: 0.98 } }];

  await figma.loadFontAsync({ family: 'Inter', style: 'Regular' });
  await figma.loadFontAsync({ family: 'Inter', style: 'Medium' });
  await figma.loadFontAsync({ family: 'Inter', style: 'Bold' });

  // Generate Product Card
  const productCard = await createProductCard();
  productCard.x = 40;
  productCard.y = 40;
  frame.appendChild(productCard);

  // Generate Search Bar
  const searchBar = await createSearchBar();
  searchBar.x = 400;
  searchBar.y = 40;
  frame.appendChild(searchBar);

  figma.viewport.scrollAndZoomIntoView([frame]);
}

async function createProductCard() {
  const card = figma.createFrame();
  card.name = "Product Card";
  card.resize(280, 420);
  card.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
  card.cornerRadius = 12;
  card.layoutMode = 'VERTICAL';
  card.paddingLeft = 16;
  card.paddingRight = 16;
  card.paddingTop = 16;
  card.paddingBottom = 16;
  card.itemSpacing = 12;
  card.effects = [{
    type: 'DROP_SHADOW',
    color: { r: 0, g: 0, b: 0, a: 0.1 },
    offset: { x: 0, y: 4 },
    radius: 6,
    visible: true,
    blendMode: 'NORMAL'
  }];

  // Image placeholder
  const image = figma.createRectangle();
  image.name = "Product Image";
  image.resize(248, 248);
  image.fills = [{ type: 'SOLID', color: { r: 0.9, g: 0.91, b: 0.92 } }];
  image.cornerRadius = 8;
  card.appendChild(image);

  // Product name
  const name = figma.createText();
  name.fontName = { family: 'Inter', style: 'Medium' };
  name.fontSize = 16;
  name.characters = "Product Name Here";
  name.fills = [{ type: 'SOLID', color: { r: 0.07, g: 0.11, b: 0.15 } }];
  card.appendChild(name);

  // Price
  const price = figma.createText();
  price.fontName = { family: 'Inter', style: 'Bold' };
  price.fontSize = 20;
  price.characters = "Rp 1.299.000";
  price.fills = [{ type: 'SOLID', color: { r: 0.23, g: 0.51, b: 0.96 } }];
  card.appendChild(price);

  // Button
  const button = createButton('Add to Cart', { r: 0.23, g: 0.51, b: 0.96 }, { r: 1, g: 1, b: 1 });
  button.resize(248, 40);
  card.appendChild(button);

  return card;
}

async function createSearchBar() {
  const searchBar = figma.createFrame();
  searchBar.name = "Search Bar";
  searchBar.resize(400, 44);
  searchBar.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
  searchBar.strokes = [{ type: 'SOLID', color: { r: 0.82, g: 0.84, b: 0.86 } }];
  searchBar.strokeWeight = 1;
  searchBar.cornerRadius = 8;
  searchBar.paddingLeft = 16;
  searchBar.paddingRight = 16;
  searchBar.layoutMode = 'HORIZONTAL';
  searchBar.primaryAxisAlignItems = 'CENTER';
  searchBar.itemSpacing = 12;

  const placeholder = figma.createText();
  placeholder.fontName = { family: 'Inter', style: 'Regular' };
  placeholder.fontSize = 16;
  placeholder.characters = "🔍 Search products...";
  placeholder.fills = [{ type: 'SOLID', color: { r: 0.61, g: 0.64, b: 0.69 } }];
  searchBar.appendChild(placeholder);

  return searchBar;
}

// ==========================================
// GENERATE ORGANISM COMPONENTS
// ==========================================
async function generateOrganisms() {
  const page = figma.createPage();
  page.name = "🏛️ Organisms";
  figma.currentPage = page;

  const frame = figma.createFrame();
  frame.name = "Organism Components";
  frame.resize(1440, 3000);
  frame.fills = [{ type: 'SOLID', color: { r: 0.98, g: 0.98, b: 0.98 } }];

  await figma.loadFontAsync({ family: 'Inter', style: 'Regular' });
  await figma.loadFontAsync({ family: 'Inter', style: 'Medium' });
  await figma.loadFontAsync({ family: 'Inter', style: 'Bold' });

  // Generate Header
  const header = await createHeader();
  header.x = 0;
  header.y = 0;
  frame.appendChild(header);

  // Generate Footer
  const footer = await createFooter();
  footer.x = 0;
  footer.y = 200;
  frame.appendChild(footer);

  figma.viewport.scrollAndZoomIntoView([frame]);
}

async function createHeader() {
  const header = figma.createFrame();
  header.name = "Header";
  header.resize(1440, 120);
  header.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
  header.layoutMode = 'VERTICAL';
  header.effects = [{
    type: 'DROP_SHADOW',
    color: { r: 0, g: 0, b: 0, a: 0.05 },
    offset: { x: 0, y: 2 },
    radius: 4,
    visible: true,
    blendMode: 'NORMAL'
  }];

  // Header main
  const headerMain = figma.createFrame();
  headerMain.name = "Header Main";
  headerMain.resize(1440, 80);
  headerMain.fills = [];
  headerMain.layoutMode = 'HORIZONTAL';
  headerMain.paddingLeft = 80;
  headerMain.paddingRight = 80;
  headerMain.paddingTop = 20;
  headerMain.paddingBottom = 20;
  headerMain.primaryAxisAlignItems = 'CENTER';
  headerMain.counterAxisAlignItems = 'CENTER';
  headerMain.itemSpacing = 24;

  // Logo
  const logo = figma.createText();
  logo.fontName = { family: 'Inter', style: 'Bold' };
  logo.fontSize = 24;
  logo.characters = "LOGO";
  logo.fills = [{ type: 'SOLID', color: { r: 0.23, g: 0.51, b: 0.96 } }];
  headerMain.appendChild(logo);

  // Search bar
  const search = await createSearchBar();
  search.layoutGrow = 1;
  headerMain.appendChild(search);

  // Icons placeholder
  const icons = figma.createText();
  icons.fontName = { family: 'Inter', style: 'Regular' };
  icons.fontSize = 16;
  icons.characters = "❤️ 🛒 👤";
  headerMain.appendChild(icons);

  header.appendChild(headerMain);

  // Navigation
  const nav = figma.createFrame();
  nav.name = "Navigation";
  nav.resize(1440, 40);
  nav.fills = [{ type: 'SOLID', color: { r: 0.98, g: 0.98, b: 0.98 } }];
  nav.layoutMode = 'HORIZONTAL';
  nav.paddingLeft = 80;
  nav.paddingRight = 80;
  nav.primaryAxisAlignItems = 'CENTER';
  nav.itemSpacing = 32;

  const navItems = ['Home', 'Shop', 'Categories', 'Deals', 'About', 'Contact'];
  navItems.forEach(item => {
    const navItem = figma.createText();
    navItem.fontName = { family: 'Inter', style: 'Medium' };
    navItem.fontSize = 14;
    navItem.characters = item;
    navItem.fills = [{ type: 'SOLID', color: { r: 0.22, g: 0.26, b: 0.31 } }];
    nav.appendChild(navItem);
  });

  header.appendChild(nav);

  return header;
}

async function createFooter() {
  const footer = figma.createFrame();
  footer.name = "Footer";
  footer.resize(1440, 300);
  footer.fills = [{ type: 'SOLID', color: { r: 0.07, g: 0.11, b: 0.15 } }];
  footer.paddingLeft = 80;
  footer.paddingRight = 80;
  footer.paddingTop = 60;
  footer.paddingBottom = 40;
  footer.layoutMode = 'VERTICAL';
  footer.itemSpacing = 40;

  // Footer main
  const footerMain = figma.createFrame();
  footerMain.name = "Footer Main";
  footerMain.resize(1280, 150);
  footerMain.fills = [];
  footerMain.layoutMode = 'HORIZONTAL';
  footerMain.primaryAxisSizingMode = 'FIXED';
  footerMain.itemSpacing = 60;

  const columns = ['About Us', 'Customer Service', 'Quick Links', 'Follow Us'];
  columns.forEach(columnName => {
    const column = figma.createFrame();
    column.name = columnName;
    column.resize(280, 150);
    column.fills = [];
    column.layoutMode = 'VERTICAL';
    column.itemSpacing = 12;

    const title = figma.createText();
    title.fontName = { family: 'Inter', style: 'Bold' };
    title.fontSize = 16;
    title.characters = columnName;
    title.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
    column.appendChild(title);

    footerMain.appendChild(column);
  });

  footer.appendChild(footerMain);

  // Copyright
  const copyright = figma.createText();
  copyright.fontName = { family: 'Inter', style: 'Regular' };
  copyright.fontSize = 14;
  copyright.characters = "© 2025 Nasional Elektronik. All rights reserved.";
  copyright.fills = [{ type: 'SOLID', color: { r: 0.61, g: 0.64, b: 0.69 } }];
  footer.appendChild(copyright);

  return footer;
}

// ==========================================
// GENERATE PAGE TEMPLATES
// ==========================================
async function generatePages() {
  const page = figma.createPage();
  page.name = "📄 Pages";
  figma.currentPage = page;

  await figma.loadFontAsync({ family: 'Inter', style: 'Regular' });
  await figma.loadFontAsync({ family: 'Inter', style: 'Medium' });
  await figma.loadFontAsync({ family: 'Inter', style: 'Bold' });

  // Create Homepage frame
  const homepage = figma.createFrame();
  homepage.name = "Homepage - Desktop";
  homepage.resize(1440, 4000);
  homepage.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
  homepage.layoutMode = 'VERTICAL';

  // Add header
  const header = await createHeader();
  homepage.appendChild(header);

  // Add hero section
  const hero = figma.createFrame();
  hero.name = "Hero Section";
  hero.resize(1440, 500);
  hero.fills = [{
    type: 'SOLID',
    color: { r: 0.95, g: 0.96, b: 0.96 }
  }];
  hero.layoutMode = 'VERTICAL';
  hero.primaryAxisAlignItems = 'CENTER';
  hero.counterAxisAlignItems = 'CENTER';

  const heroTitle = figma.createText();
  heroTitle.fontName = { family: 'Inter', style: 'Bold' };
  heroTitle.fontSize = 48;
  heroTitle.characters = "HERO SECTION";
  heroTitle.fills = [{ type: 'SOLID', color: { r: 0.42, g: 0.45, b: 0.50 } }];
  hero.appendChild(heroTitle);

  homepage.appendChild(hero);

  // Add product grid placeholder
  const productsSection = figma.createFrame();
  productsSection.name = "Featured Products";
  productsSection.resize(1440, 600);
  productsSection.fills = [];
  productsSection.layoutMode = 'VERTICAL';
  productsSection.paddingLeft = 80;
  productsSection.paddingRight = 80;
  productsSection.paddingTop = 60;
  productsSection.paddingBottom = 60;
  productsSection.itemSpacing = 40;

  const sectionTitle = figma.createText();
  sectionTitle.fontName = { family: 'Inter', style: 'Bold' };
  sectionTitle.fontSize = 32;
  sectionTitle.characters = "Featured Products";
  sectionTitle.fills = [{ type: 'SOLID', color: { r: 0.07, g: 0.11, b: 0.15 } }];
  productsSection.appendChild(sectionTitle);

  // Product grid
  const productGrid = figma.createFrame();
  productGrid.name = "Product Grid";
  productGrid.resize(1280, 450);
  productGrid.fills = [];
  productGrid.layoutMode = 'HORIZONTAL';
  productGrid.itemSpacing = 24;

  for (let i = 0; i < 4; i++) {
    const productCard = await createProductCard();
    productGrid.appendChild(productCard);
  }

  productsSection.appendChild(productGrid);
  homepage.appendChild(productsSection);

  // Add footer
  const footer = await createFooter();
  homepage.appendChild(footer);

  figma.viewport.scrollAndZoomIntoView([homepage]);
}

// ==========================================
// GENERATE ALL PAGES (HOMEPAGE + SHOP PAGE)
// ==========================================
async function generateAllPages() {
  // Load fonts first
  await figma.loadFontAsync({ family: 'Inter', style: 'Regular' });
  await figma.loadFontAsync({ family: 'Inter', style: 'Medium' });
  await figma.loadFontAsync({ family: 'Inter', style: 'Bold' });

  // Create main page
  const page = figma.createPage();
  page.name = "📄 Pages - Nasional Elektronik";
  figma.currentPage = page;

  // Generate Homepage
  const homepage = await createHomepageFrame();
  homepage.x = 0;
  homepage.y = 0;
  
  // Generate Shop Page
  const shopPage = await createShopPageFrame();
  shopPage.x = 1600; // Position to the right of homepage
  shopPage.y = 0;

  // Zoom to fit both pages
  figma.viewport.scrollAndZoomIntoView([homepage, shopPage]);
}

// Create Homepage Frame
async function createHomepageFrame() {
  const homepage = figma.createFrame();
  homepage.name = "Homepage - Desktop";
  homepage.resize(1440, 4000);
  homepage.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
  homepage.layoutMode = 'VERTICAL';

  // Add header
  const header = await createHeader();
  homepage.appendChild(header);

  // Add hero section
  const hero = figma.createFrame();
  hero.name = "Hero Section";
  hero.resize(1440, 500);
  hero.fills = [{
    type: 'SOLID',
    color: { r: 0.95, g: 0.96, b: 0.96 }
  }];
  hero.layoutMode = 'VERTICAL';
  hero.primaryAxisAlignItems = 'CENTER';
  hero.counterAxisAlignItems = 'CENTER';

  const heroTitle = figma.createText();
  heroTitle.fontName = { family: 'Inter', style: 'Bold' };
  heroTitle.fontSize = 48;
  heroTitle.characters = "HERO SECTION";
  heroTitle.fills = [{ type: 'SOLID', color: { r: 0.42, g: 0.45, b: 0.50 } }];
  hero.appendChild(heroTitle);

  homepage.appendChild(hero);

  // Add product grid placeholder
  const productsSection = figma.createFrame();
  productsSection.name = "Featured Products";
  productsSection.resize(1440, 600);
  productsSection.fills = [];
  productsSection.layoutMode = 'VERTICAL';
  productsSection.paddingLeft = 80;
  productsSection.paddingRight = 80;
  productsSection.paddingTop = 60;
  productsSection.paddingBottom = 60;
  productsSection.itemSpacing = 40;

  const sectionTitle = figma.createText();
  sectionTitle.fontName = { family: 'Inter', style: 'Bold' };
  sectionTitle.fontSize = 32;
  sectionTitle.characters = "Featured Products";
  sectionTitle.fills = [{ type: 'SOLID', color: { r: 0.07, g: 0.11, b: 0.15 } }];
  productsSection.appendChild(sectionTitle);

  // Product grid
  const productGrid = figma.createFrame();
  productGrid.name = "Product Grid";
  productGrid.resize(1280, 450);
  productGrid.fills = [];
  productGrid.layoutMode = 'HORIZONTAL';
  productGrid.itemSpacing = 24;

  for (let i = 0; i < 4; i++) {
    const productCard = await createProductCard();
    productGrid.appendChild(productCard);
  }

  productsSection.appendChild(productGrid);
  homepage.appendChild(productsSection);

  // Add footer
  const footer = await createFooter();
  homepage.appendChild(footer);

  return homepage;
}

// Create Shop Page Frame
async function createShopPageFrame() {
  const shopPage = figma.createFrame();
  shopPage.name = "Shop Page - Desktop";
  shopPage.resize(1440, 3000);
  shopPage.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
  shopPage.layoutMode = 'VERTICAL';

  // Add header
  const header = await createHeader();
  shopPage.appendChild(header);

  // Create main content container
  const mainContent = figma.createFrame();
  mainContent.name = "Main Content";
  mainContent.resize(1440, 2500);
  mainContent.fills = [];
  mainContent.layoutMode = 'VERTICAL';
  mainContent.paddingLeft = 80;
  mainContent.paddingRight = 80;
  mainContent.paddingTop = 40;
  mainContent.paddingBottom = 60;
  mainContent.itemSpacing = 20;

  // Add Breadcrumb
  const breadcrumb = createBreadcrumb();
  mainContent.appendChild(breadcrumb);

  // Create two-column layout (Filters + Products)
  const contentGrid = figma.createFrame();
  contentGrid.name = "Content Grid";
  contentGrid.resize(1280, 2200);
  contentGrid.fills = [];
  contentGrid.layoutMode = 'HORIZONTAL';
  contentGrid.itemSpacing = 40;
  contentGrid.primaryAxisSizingMode = 'FIXED';

  // Left sidebar - Filters (200px)
  const filtersSidebar = createFiltersSidebar();
  contentGrid.appendChild(filtersSidebar);

  // Right content area
  const productsArea = figma.createFrame();
  productsArea.name = "Products Area";
  productsArea.resize(1040, 2200);
  productsArea.fills = [];
  productsArea.layoutMode = 'VERTICAL';
  productsArea.itemSpacing = 24;

  // Header with title and sort
  const productsHeader = figma.createFrame();
  productsHeader.name = "Products Header";
  productsHeader.resize(1040, 60);
  productsHeader.fills = [];
  productsHeader.layoutMode = 'HORIZONTAL';
  productsHeader.primaryAxisAlignItems = 'CENTER';
  productsHeader.counterAxisAlignItems = 'CENTER';

  // Title
  const pageTitle = figma.createText();
  pageTitle.fontName = { family: 'Inter', style: 'Bold' };
  pageTitle.fontSize = 24;
  pageTitle.characters = "SEMUA PRODUK";
  pageTitle.fills = [{ type: 'SOLID', color: { r: 0.07, g: 0.11, b: 0.15 } }];
  pageTitle.layoutGrow = 1;
  productsHeader.appendChild(pageTitle);

  // Sort By dropdown
  const sortBy = createSortByDropdown();
  productsHeader.appendChild(sortBy);

  productsArea.appendChild(productsHeader);

  // Divider
  const divider = figma.createRectangle();
  divider.name = "Divider";
  divider.resize(1040, 1);
  divider.fills = [{ type: 'SOLID', color: { r: 0.90, g: 0.91, b: 0.92 } }];
  productsArea.appendChild(divider);

  // Products Grid
  const productsGrid = figma.createFrame();
  productsGrid.name = "Products Grid";
  productsGrid.resize(1040, 1800);
  productsGrid.fills = [];
  productsGrid.layoutMode = 'HORIZONTAL';
  productsGrid.primaryAxisSizingMode = 'FIXED';
  productsGrid.counterAxisSizingMode = 'AUTO';
  productsGrid.primaryAxisAlignItems = 'MIN';
  productsGrid.itemSpacing = 24;
  productsGrid.counterAxisSpacing = 24;
  productsGrid.layoutWrap = 'WRAP';

  // Generate 12 product cards (3 columns x 4 rows)
  for (let i = 0; i < 12; i++) {
    const productCard = await createProductCard();
    productCard.resize(320, 420);
    productsGrid.appendChild(productCard);
  }

  productsArea.appendChild(productsGrid);

  // Pagination
  const pagination = createPagination();
  productsArea.appendChild(pagination);

  contentGrid.appendChild(productsArea);
  mainContent.appendChild(contentGrid);

  shopPage.appendChild(mainContent);

  // Add footer
  const footer = await createFooter();
  shopPage.appendChild(footer);

  return shopPage;
}

// ==========================================
// GENERATE SHOP PAGE (LISTING PAGE)
// ==========================================
async function generateShopPage() {
  const page = figma.createPage();
  page.name = "📄 Shop/Listing Page";
  figma.currentPage = page;

  await figma.loadFontAsync({ family: 'Inter', style: 'Regular' });
  await figma.loadFontAsync({ family: 'Inter', style: 'Medium' });
  await figma.loadFontAsync({ family: 'Inter', style: 'Bold' });

  // Create main shop page frame
  const shopPage = figma.createFrame();
  shopPage.name = "Shop Page - Desktop";
  shopPage.resize(1440, 3000);
  shopPage.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
  shopPage.layoutMode = 'VERTICAL';

  // Add header
  const header = await createHeader();
  shopPage.appendChild(header);

  // Create main content container
  const mainContent = figma.createFrame();
  mainContent.name = "Main Content";
  mainContent.resize(1440, 2500);
  mainContent.fills = [];
  mainContent.layoutMode = 'VERTICAL';
  mainContent.paddingLeft = 80;
  mainContent.paddingRight = 80;
  mainContent.paddingTop = 40;
  mainContent.paddingBottom = 60;
  mainContent.itemSpacing = 20;

  // Add Breadcrumb
  const breadcrumb = createBreadcrumb();
  mainContent.appendChild(breadcrumb);

  // Create two-column layout (Filters + Products)
  const contentGrid = figma.createFrame();
  contentGrid.name = "Content Grid";
  contentGrid.resize(1280, 2200);
  contentGrid.fills = [];
  contentGrid.layoutMode = 'HORIZONTAL';
  contentGrid.itemSpacing = 40;
  contentGrid.primaryAxisSizingMode = 'FIXED';

  // Left sidebar - Filters (200px)
  const filtersSidebar = createFiltersSidebar();
  contentGrid.appendChild(filtersSidebar);

  // Right content area
  const productsArea = figma.createFrame();
  productsArea.name = "Products Area";
  productsArea.resize(1040, 2200);
  productsArea.fills = [];
  productsArea.layoutMode = 'VERTICAL';
  productsArea.itemSpacing = 24;

  // Header with title and sort
  const productsHeader = figma.createFrame();
  productsHeader.name = "Products Header";
  productsHeader.resize(1040, 60);
  productsHeader.fills = [];
  productsHeader.layoutMode = 'HORIZONTAL';
  productsHeader.primaryAxisAlignItems = 'CENTER';
  productsHeader.counterAxisAlignItems = 'CENTER';

  // Title
  const pageTitle = figma.createText();
  pageTitle.fontName = { family: 'Inter', style: 'Bold' };
  pageTitle.fontSize = 24;
  pageTitle.characters = "SEMUA PRODUK";
  pageTitle.fills = [{ type: 'SOLID', color: { r: 0.07, g: 0.11, b: 0.15 } }];
  pageTitle.layoutGrow = 1;
  productsHeader.appendChild(pageTitle);

  // Sort By dropdown
  const sortBy = createSortByDropdown();
  productsHeader.appendChild(sortBy);

  productsArea.appendChild(productsHeader);

  // Divider
  const divider = figma.createRectangle();
  divider.name = "Divider";
  divider.resize(1040, 1);
  divider.fills = [{ type: 'SOLID', color: { r: 0.90, g: 0.91, b: 0.92 } }];
  productsArea.appendChild(divider);

  // Products Grid
  const productsGrid = figma.createFrame();
  productsGrid.name = "Products Grid";
  productsGrid.resize(1040, 1800);
  productsGrid.fills = [];
  productsGrid.layoutMode = 'HORIZONTAL';
  productsGrid.primaryAxisSizingMode = 'FIXED';
  productsGrid.counterAxisSizingMode = 'AUTO';
  productsGrid.primaryAxisAlignItems = 'MIN';
  productsGrid.itemSpacing = 24;
  productsGrid.counterAxisSpacing = 24;
  productsGrid.layoutWrap = 'WRAP';

  // Generate 12 product cards (3 columns x 4 rows)
  for (let i = 0; i < 12; i++) {
    const productCard = await createProductCard();
    productCard.resize(320, 420);
    productsGrid.appendChild(productCard);
  }

  productsArea.appendChild(productsGrid);

  // Pagination
  const pagination = createPagination();
  productsArea.appendChild(pagination);

  contentGrid.appendChild(productsArea);
  mainContent.appendChild(contentGrid);

  shopPage.appendChild(mainContent);

  // Add footer
  const footer = await createFooter();
  shopPage.appendChild(footer);

  figma.viewport.scrollAndZoomIntoView([shopPage]);
}

// Create Breadcrumb Component
function createBreadcrumb() {
  const breadcrumb = figma.createFrame();
  breadcrumb.name = "Breadcrumb";
  breadcrumb.resize(1280, 40);
  breadcrumb.fills = [];
  breadcrumb.layoutMode = 'HORIZONTAL';
  breadcrumb.primaryAxisAlignItems = 'CENTER';
  breadcrumb.itemSpacing = 8;

  const breadcrumbItems = ['🏠 Home', '>', 'Belanja', '>', 'Semua produk'];
  breadcrumbItems.forEach((item, index) => {
    const breadcrumbItem = figma.createText();
    breadcrumbItem.fontName = { family: 'Inter', style: index === breadcrumbItems.length - 1 ? 'Medium' : 'Regular' };
    breadcrumbItem.fontSize = 16;
    breadcrumbItem.characters = item;
    breadcrumbItem.fills = [{ type: 'SOLID', color: item === '>' ? { r: 0.61, g: 0.64, b: 0.69 } : { r: 0.23, g: 0.51, b: 0.96 } }];
    breadcrumb.appendChild(breadcrumbItem);
  });

  return breadcrumb;
}

// Create Filters Sidebar
function createFiltersSidebar() {
  const sidebar = figma.createFrame();
  sidebar.name = "Filters Sidebar";
  sidebar.resize(200, 600);
  sidebar.fills = [{ type: 'SOLID', color: { r: 0.98, g: 0.98, b: 0.98 } }];
  sidebar.cornerRadius = 8;
  sidebar.paddingLeft = 20;
  sidebar.paddingRight = 20;
  sidebar.paddingTop = 24;
  sidebar.paddingBottom = 24;
  sidebar.layoutMode = 'VERTICAL';
  sidebar.itemSpacing = 20;

  // Filters Title
  const filtersTitle = figma.createText();
  filtersTitle.fontName = { family: 'Inter', style: 'Bold' };
  filtersTitle.fontSize = 20;
  filtersTitle.characters = "Filters";
  filtersTitle.fills = [{ type: 'SOLID', color: { r: 0.07, g: 0.11, b: 0.15 } }];
  sidebar.appendChild(filtersTitle);

  // Divider 1
  const divider1 = figma.createRectangle();
  divider1.name = "Divider";
  divider1.resize(160, 1);
  divider1.fills = [{ type: 'SOLID', color: { r: 0.82, g: 0.84, b: 0.86 } }];
  sidebar.appendChild(divider1);

  // Ketersediaan Section
  const availabilitySection = figma.createFrame();
  availabilitySection.name = "Availability Section";
  availabilitySection.resize(160, 120);
  availabilitySection.fills = [];
  availabilitySection.layoutMode = 'VERTICAL';
  availabilitySection.itemSpacing = 12;

  const availabilityTitle = figma.createText();
  availabilityTitle.fontName = { family: 'Inter', style: 'Medium' };
  availabilityTitle.fontSize = 18;
  availabilityTitle.characters = "Ketersediaan";
  availabilityTitle.fills = [{ type: 'SOLID', color: { r: 0.07, g: 0.11, b: 0.15 } }];
  availabilitySection.appendChild(availabilityTitle);

  // In Stock checkbox
  const inStockCheck = createCheckboxItem("☑ Stock tersedia");
  availabilitySection.appendChild(inStockCheck);

  // Out of Stock checkbox
  const outStockCheck = createCheckboxItem("☑ Stock habis");
  availabilitySection.appendChild(outStockCheck);

  sidebar.appendChild(availabilitySection);

  // Divider 2
  const divider2 = figma.createRectangle();
  divider2.name = "Divider";
  divider2.resize(160, 1);
  divider2.fills = [{ type: 'SOLID', color: { r: 0.82, g: 0.84, b: 0.86 } }];
  sidebar.appendChild(divider2);

  // Price Filter Section
  const priceSection = figma.createFrame();
  priceSection.name = "Price Section";
  priceSection.resize(160, 100);
  priceSection.fills = [];
  priceSection.layoutMode = 'VERTICAL';
  priceSection.itemSpacing = 12;

  const priceTitle = figma.createText();
  priceTitle.fontName = { family: 'Inter', style: 'Medium' };
  priceTitle.fontSize = 18;
  priceTitle.characters = "Harga";
  priceTitle.fills = [{ type: 'SOLID', color: { r: 0.07, g: 0.11, b: 0.15 } }];
  priceSection.appendChild(priceTitle);

  const priceSlider = createSlider(160, "Harga maksimal: $3000");
  priceSection.appendChild(priceSlider);

  sidebar.appendChild(priceSection);

  // Divider 3
  const divider3 = figma.createRectangle();
  divider3.name = "Divider";
  divider3.resize(160, 1);
  divider3.fills = [{ type: 'SOLID', color: { r: 0.82, g: 0.84, b: 0.86 } }];
  sidebar.appendChild(divider3);

  // Rating Filter Section
  const ratingSection = figma.createFrame();
  ratingSection.name = "Rating Section";
  ratingSection.resize(160, 120);
  ratingSection.fills = [];
  ratingSection.layoutMode = 'VERTICAL';
  ratingSection.itemSpacing = 12;

  const ratingTitle = figma.createText();
  ratingTitle.fontName = { family: 'Inter', style: 'Medium' };
  ratingTitle.fontSize = 18;
  ratingTitle.characters = "Minimum Rating:";
  ratingTitle.fills = [{ type: 'SOLID', color: { r: 0.07, g: 0.11, b: 0.15 } }];
  ratingSection.appendChild(ratingTitle);

  const ratingSlider = createRatingSlider(160);
  ratingSection.appendChild(ratingSlider);

  sidebar.appendChild(ratingSection);

  return sidebar;
}

// Create Checkbox Item
function createCheckboxItem(label) {
  const checkboxItem = figma.createFrame();
  checkboxItem.name = "Checkbox Item";
  checkboxItem.resize(160, 28);
  checkboxItem.fills = [];
  checkboxItem.layoutMode = 'HORIZONTAL';
  checkboxItem.primaryAxisAlignItems = 'CENTER';
  checkboxItem.itemSpacing = 8;

  const checkboxText = figma.createText();
  checkboxText.fontName = { family: 'Inter', style: 'Regular' };
  checkboxText.fontSize = 16;
  checkboxText.characters = label;
  checkboxText.fills = [{ type: 'SOLID', color: { r: 0.07, g: 0.11, b: 0.15 } }];
  checkboxItem.appendChild(checkboxText);

  return checkboxItem;
}

// Create Slider Component
function createSlider(width, label) {
  const sliderContainer = figma.createFrame();
  sliderContainer.name = "Slider";
  sliderContainer.resize(width, 50);
  sliderContainer.fills = [];
  sliderContainer.layoutMode = 'VERTICAL';
  sliderContainer.itemSpacing = 8;

  // Slider track
  const sliderTrack = figma.createFrame();
  sliderTrack.name = "Slider Track";
  sliderTrack.resize(width, 6);
  sliderTrack.fills = [{ type: 'SOLID', color: { r: 0.82, g: 0.84, b: 0.86 } }];
  sliderTrack.cornerRadius = 3;

  // Slider filled
  const sliderFilled = figma.createRectangle();
  sliderFilled.name = "Slider Filled";
  sliderFilled.resize(width * 0.7, 6);
  sliderFilled.fills = [{ type: 'SOLID', color: { r: 0.23, g: 0.51, b: 0.96 } }];
  sliderFilled.cornerRadius = 3;
  sliderTrack.appendChild(sliderFilled);

  sliderContainer.appendChild(sliderTrack);

  // Label
  const sliderLabel = figma.createText();
  sliderLabel.fontName = { family: 'Inter', style: 'Regular' };
  sliderLabel.fontSize = 14;
  sliderLabel.characters = label;
  sliderLabel.fills = [{ type: 'SOLID', color: { r: 0.42, g: 0.45, b: 0.50 } }];
  sliderContainer.appendChild(sliderLabel);

  return sliderContainer;
}

// Create Rating Slider with markers
function createRatingSlider(width) {
  const sliderContainer = figma.createFrame();
  sliderContainer.name = "Rating Slider";
  sliderContainer.resize(width, 60);
  sliderContainer.fills = [];
  sliderContainer.layoutMode = 'VERTICAL';
  sliderContainer.itemSpacing = 8;

  // Slider track
  const sliderTrack = figma.createFrame();
  sliderTrack.name = "Slider Track";
  sliderTrack.resize(width, 6);
  sliderTrack.fills = [{ type: 'SOLID', color: { r: 0.06, g: 0.72, b: 0.51 } }];
  sliderTrack.cornerRadius = 3;

  sliderContainer.appendChild(sliderTrack);

  // Rating markers (0-5)
  const markers = figma.createFrame();
  markers.name = "Rating Markers";
  markers.resize(width, 20);
  markers.fills = [];
  markers.layoutMode = 'HORIZONTAL';
  markers.primaryAxisSizingMode = 'FIXED';
  markers.primaryAxisAlignItems = 'SPACE_BETWEEN';

  const ratings = ['0', '1', '2', '3', '4', '5'];
  ratings.forEach(rating => {
    const marker = figma.createText();
    marker.fontName = { family: 'Inter', style: 'Regular' };
    marker.fontSize = 12;
    marker.characters = rating;
    marker.fills = [{ type: 'SOLID', color: { r: 0.42, g: 0.45, b: 0.50 } }];
    markers.appendChild(marker);
  });

  sliderContainer.appendChild(markers);

  return sliderContainer;
}

// Create Sort By Dropdown
function createSortByDropdown() {
  const sortByContainer = figma.createFrame();
  sortByContainer.name = "Sort By";
  sortByContainer.resize(400, 50);
  sortByContainer.fills = [];
  sortByContainer.layoutMode = 'HORIZONTAL';
  sortByContainer.primaryAxisAlignItems = 'CENTER';
  sortByContainer.itemSpacing = 20;

  const sortLabel = figma.createText();
  sortLabel.fontName = { family: 'Inter', style: 'Medium' };
  sortLabel.fontSize = 18;
  sortLabel.characters = "Urutkan bedasarkan:";
  sortLabel.fills = [{ type: 'SOLID', color: { r: 0.07, g: 0.11, b: 0.15 } }];
  sortByContainer.appendChild(sortLabel);

  // Dropdown
  const dropdown = figma.createFrame();
  dropdown.name = "Dropdown";
  dropdown.resize(200, 44);
  dropdown.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
  dropdown.strokes = [{ type: 'SOLID', color: { r: 0.61, g: 0.64, b: 0.69 } }];
  dropdown.strokeWeight = 2;
  dropdown.cornerRadius = 8;
  dropdown.paddingLeft = 16;
  dropdown.paddingRight = 16;
  dropdown.layoutMode = 'HORIZONTAL';
  dropdown.primaryAxisAlignItems = 'SPACE_BETWEEN';
  dropdown.counterAxisAlignItems = 'CENTER';

  const dropdownText = figma.createText();
  dropdownText.fontName = { family: 'Inter', style: 'Regular' };
  dropdownText.fontSize = 16;
  dropdownText.characters = "Default";
  dropdownText.fills = [{ type: 'SOLID', color: { r: 0.07, g: 0.11, b: 0.15 } }];
  dropdown.appendChild(dropdownText);

  const dropdownArrow = figma.createText();
  dropdownArrow.fontName = { family: 'Inter', style: 'Regular' };
  dropdownArrow.fontSize = 16;
  dropdownArrow.characters = "▼";
  dropdownArrow.fills = [{ type: 'SOLID', color: { r: 0.42, g: 0.45, b: 0.50 } }];
  dropdown.appendChild(dropdownArrow);

  sortByContainer.appendChild(dropdown);

  return sortByContainer;
}

// Create Pagination Component
function createPagination() {
  const pagination = figma.createFrame();
  pagination.name = "Pagination";
  pagination.resize(1040, 80);
  pagination.fills = [];
  pagination.layoutMode = 'HORIZONTAL';
  pagination.primaryAxisAlignItems = 'CENTER';
  pagination.counterAxisAlignItems = 'CENTER';
  pagination.itemSpacing = 12;

  // Previous button
  const prevBtn = createPaginationButton("«");
  pagination.appendChild(prevBtn);

  // Current page
  const currentPage = createPaginationButton("Page 1", true);
  pagination.appendChild(currentPage);

  // Next button
  const nextBtn = createPaginationButton("»");
  pagination.appendChild(nextBtn);

  return pagination;
}

// Create Pagination Button
function createPaginationButton(label, isCurrent = false) {
  const button = figma.createFrame();
  button.name = `Pagination ${label}`;
  button.resize(label.includes('Page') ? 100 : 50, 50);
  button.fills = [{ type: 'SOLID', color: isCurrent ? { r: 0.94, g: 0.27, b: 0.27 } : { r: 0.94, g: 0.27, b: 0.27 } }];
  button.cornerRadius = 8;
  button.layoutMode = 'HORIZONTAL';
  button.primaryAxisAlignItems = 'CENTER';
  button.counterAxisAlignItems = 'CENTER';
  button.effects = [{
    type: 'DROP_SHADOW',
    color: { r: 0, g: 0, b: 0, a: 0.1 },
    offset: { x: 0, y: 2 },
    radius: 4,
    visible: true,
    blendMode: 'NORMAL'
  }];

  const buttonText = figma.createText();
  buttonText.fontName = { family: 'Inter', style: 'Bold' };
  buttonText.fontSize = 16;
  buttonText.characters = label;
  buttonText.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
  button.appendChild(buttonText);

  return button;
}
