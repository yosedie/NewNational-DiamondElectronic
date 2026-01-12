// Figma Plugin - Nasional Elektronik Component Generator
// This plugin generates e-commerce UI components automatically

// Show UI
figma.showUI(__html__, { width: 400, height: 500 });

// Listen for messages from UI
figma.ui.onmessage = async (msg) => {
  if (msg.type === 'generate-all-pages') {
    try {
      await generateAllPages();
      figma.ui.postMessage({ type: 'generation-complete' });
      figma.notify('🎉 5 Admin pages generated successfully!');
    } catch (error) {
      console.error('Error generating pages:', error);
      figma.notify('❌ Error: ' + error.message, { error: true });
      figma.ui.postMessage({ type: 'generation-complete' });
    }
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
// GENERATE ALL PAGES (ADMIN: DASHBOARD + ORDERS + PRODUCTS + CATEGORIES + USERS)
// ==========================================
async function generateAllPages() {
  try {
    // Load fonts first
    figma.notify('Loading fonts...');
    await figma.loadFontAsync({ family: 'Inter', style: 'Regular' });
    await figma.loadFontAsync({ family: 'Inter', style: 'Medium' });
    await figma.loadFontAsync({ family: 'Inter', style: 'Bold' });

    // Create main page
    figma.notify('Creating page...');
    const page = figma.createPage();
    page.name = "📄 Admin Pages - Nasional Elektronik";
    figma.currentPage = page;

    // Generate Admin Dashboard
    figma.notify('Generating Admin Dashboard... (1/5)');
    const adminDashboard = await createAdminDashboardFrame();
    adminDashboard.x = 0;
    adminDashboard.y = 0;
    page.appendChild(adminDashboard);
    console.log('Admin Dashboard created and appended');

    // Generate Admin Orders
    figma.notify('Generating Admin Orders... (2/5)');
    const adminOrders = await createAdminOrdersFrame();
    adminOrders.x = 1600;
    adminOrders.y = 0;
    page.appendChild(adminOrders);
    console.log('Admin Orders created and appended');

    // Generate Admin Products
    figma.notify('Generating Admin Products... (3/5)');
    const adminProducts = await createAdminProductsFrame();
    adminProducts.x = 3200;
    adminProducts.y = 0;
    page.appendChild(adminProducts);
    console.log('Admin Products created and appended');

    // Generate Admin Categories
    figma.notify('Generating Admin Categories... (4/5)');
    const adminCategories = await createAdminCategoriesFrame();
    adminCategories.x = 4800;
    adminCategories.y = 0;
    page.appendChild(adminCategories);
    console.log('Admin Categories created and appended');

    // Generate Admin Users
    figma.notify('Generating Admin Users... (5/5)');
    const adminUsers = await createAdminUsersFrame();
    adminUsers.x = 6400;
    adminUsers.y = 0;
    page.appendChild(adminUsers);
    console.log('Admin Users created and appended');

    // Zoom to fit all pages
    figma.notify('Finalizing...');
    figma.viewport.scrollAndZoomIntoView([adminDashboard, adminOrders, adminProducts, adminCategories, adminUsers]);

    console.log('All 5 admin pages generated successfully');
  } catch (error) {
    console.error('Error in generateAllPages:', error);
    throw error;
  }
}

// Create Homepage Frame
async function createHomepageFrame() {
  try {
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

    console.log('Homepage frame created successfully');
    return homepage;
  } catch (error) {
    console.error('Error in createHomepageFrame:', error);
    throw new Error('Failed to create Homepage: ' + error.message);
  }
}

// Create Shop Page Frame
async function createShopPageFrame() {
  try {
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

    console.log('Shop Page frame created successfully');
    return shopPage;
  } catch (error) {
    console.error('Error in createShopPageFrame:', error);
    throw new Error('Failed to create Shop Page: ' + error.message);
  }
}

// Create Product Detail Page Frame
async function createProductDetailFrame() {
  try {
    const productDetailPage = figma.createFrame();
    productDetailPage.name = "Product Detail - Desktop";
    productDetailPage.resize(1440, 3500);
    productDetailPage.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
    productDetailPage.layoutMode = 'VERTICAL';

    // Add header
    const header = await createHeader();
    productDetailPage.appendChild(header);

    // Main Content Container
    const mainContent = figma.createFrame();
    mainContent.name = "Main Content";
    mainContent.resize(1440, 3100);
    mainContent.fills = [];
    mainContent.layoutMode = 'VERTICAL';
    mainContent.paddingLeft = 80;
    mainContent.paddingRight = 80;
    mainContent.paddingTop = 40;
    mainContent.paddingBottom = 40;
    mainContent.itemSpacing = 32;

    // Product Grid (3 columns - 2 for left, 1 for right)
    const productGrid = figma.createFrame();
    productGrid.name = "Product Grid";
    productGrid.resize(1280, 2800);
    productGrid.fills = [];
    productGrid.layoutMode = 'HORIZONTAL';
    productGrid.primaryAxisAlignItems = 'MIN';
    productGrid.itemSpacing = 32;

    // Left Side (2/3 width) - Product Images and Details
    const leftSide = figma.createFrame();
    leftSide.name = "Left Side - Product Details";
    leftSide.resize(840, 2800);
    leftSide.fills = [];
    leftSide.layoutMode = 'VERTICAL';
    leftSide.itemSpacing = 32;

    // Product Images Section
    const imagesSection = createProductImageSection();
    leftSide.appendChild(imagesSection);

    // Product Info Section
    const infoSection = createProductInfoSection();
    leftSide.appendChild(infoSection);

    // Reviews Card
    const reviewsCard = createReviewsCard();
    leftSide.appendChild(reviewsCard);

    // Description Card
    const descriptionCard = createDescriptionCard();
    leftSide.appendChild(descriptionCard);

    productGrid.appendChild(leftSide);

    // Right Sidebar (1/3 width) - Product Summary
    const rightSidebar = figma.createFrame();
    rightSidebar.name = "Right Sidebar - Summary";
    rightSidebar.resize(408, 600);
    rightSidebar.fills = [];
    rightSidebar.layoutMode = 'VERTICAL';

    const summaryCard = createProductSummaryCard();
    rightSidebar.appendChild(summaryCard);

    productGrid.appendChild(rightSidebar);

    mainContent.appendChild(productGrid);
    productDetailPage.appendChild(mainContent);

    // Add footer
    const footer = await createFooter();
    productDetailPage.appendChild(footer);

    console.log('Product Detail Page frame created successfully');
    return productDetailPage;
  } catch (error) {
    console.error('Error in createProductDetailFrame:', error);
    throw new Error('Failed to create Product Detail Page: ' + error.message);
  }
}

// Create Login Page Frame
async function createLoginFrame() {
  try {
    const loginPage = figma.createFrame();
    loginPage.name = "Login Page - Desktop";
    loginPage.resize(1440, 900);
    loginPage.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
    loginPage.layoutMode = 'VERTICAL';

    // Add header
    const header = await createHeader();
    loginPage.appendChild(header);

    // Section Title Area
    const sectionTitle = createSectionTitleComponent("Masuk", "Home | Masuk");
    loginPage.appendChild(sectionTitle);

    // Main Content Container
    const mainContent = figma.createFrame();
    mainContent.name = "Main Content";
    mainContent.resize(1440, 600);
    mainContent.fills = [];
    mainContent.layoutMode = 'VERTICAL';
    mainContent.primaryAxisAlignItems = 'CENTER';
    mainContent.counterAxisAlignItems = 'CENTER';
    mainContent.paddingTop = 48;
    mainContent.paddingBottom = 48;
    mainContent.itemSpacing = 20;

    // Page Title
    const pageTitle = figma.createText();
    pageTitle.fontName = { family: 'Inter', style: 'Regular' };
    pageTitle.fontSize = 24;
    pageTitle.characters = "Masuk ke akun anda";
    pageTitle.fills = [{ type: 'SOLID', color: { r: 0.07, g: 0.11, b: 0.15 } }];
    mainContent.appendChild(pageTitle);

    // Form Card
    const formCard = figma.createFrame();
    formCard.name = "Form Card";
    formCard.resize(480, 500);
    formCard.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
    formCard.cornerRadius = 8;
    formCard.layoutMode = 'VERTICAL';
    formCard.paddingTop = 48;
    formCard.paddingBottom = 48;
    formCard.paddingLeft = 48;
    formCard.paddingRight = 48;
    formCard.itemSpacing = 24;
    formCard.effects = [{
      type: 'DROP_SHADOW',
      color: { r: 0, g: 0, b: 0, a: 0.1 },
      offset: { x: 0, y: 4 },
      radius: 16,
      visible: true,
      blendMode: 'NORMAL'
    }];

    // Email Input
    const emailInput = createFormInput("Alamat email", "email", "email");
    formCard.appendChild(emailInput);

    // Password Input
    const passwordInput = createFormInput("Password", "password", "password");
    formCard.appendChild(passwordInput);

    // Remember Me & Forgot Password Row
    const optionsRow = figma.createFrame();
    optionsRow.name = "Options Row";
    optionsRow.resize(384, 24);
    optionsRow.fills = [];
    optionsRow.layoutMode = 'HORIZONTAL';
    optionsRow.primaryAxisSizingMode = 'FIXED';
    optionsRow.primaryAxisAlignItems = 'SPACE_BETWEEN';

    // Remember Me Checkbox
    const rememberMe = figma.createFrame();
    rememberMe.name = "Remember Me";
    rememberMe.resize(150, 24);
    rememberMe.fills = [];
    rememberMe.layoutMode = 'HORIZONTAL';
    rememberMe.itemSpacing = 8;

    const checkbox = figma.createFrame();
    checkbox.name = "Checkbox";
    checkbox.resize(16, 16);
    checkbox.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
    checkbox.strokeWeight = 1;
    checkbox.strokes = [{ type: 'SOLID', color: { r: 0.82, g: 0.84, b: 0.86 } }];
    checkbox.cornerRadius = 4;
    rememberMe.appendChild(checkbox);

    const rememberText = figma.createText();
    rememberText.fontName = { family: 'Inter', style: 'Regular' };
    rememberText.fontSize = 14;
    rememberText.characters = "Simpan login";
    rememberText.fills = [{ type: 'SOLID', color: { r: 0.07, g: 0.11, b: 0.15 } }];
    rememberMe.appendChild(rememberText);

    optionsRow.appendChild(rememberMe);

    // Forgot Password Link
    const forgotPassword = figma.createText();
    forgotPassword.fontName = { family: 'Inter', style: 'Bold' };
    forgotPassword.fontSize = 14;
    forgotPassword.characters = "Lupa password?";
    forgotPassword.fills = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }];
    optionsRow.appendChild(forgotPassword);

    formCard.appendChild(optionsRow);

    // Submit Button
    const submitBtn = figma.createFrame();
    submitBtn.name = "Submit Button";
    submitBtn.resize(384, 46);
    submitBtn.fills = [{ type: 'SOLID', color: { r: 0.94, g: 0.27, b: 0.27 } }];
    submitBtn.cornerRadius = 6;
    submitBtn.layoutMode = 'HORIZONTAL';
    submitBtn.primaryAxisAlignItems = 'CENTER';
    submitBtn.counterAxisAlignItems = 'CENTER';

    const submitText = figma.createText();
    submitText.fontName = { family: 'Inter', style: 'Bold' };
    submitText.fontSize = 14;
    submitText.characters = "Masuk";
    submitText.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
    submitBtn.appendChild(submitText);

    formCard.appendChild(submitBtn);

    // Divider with "Atau lanjutkan dengan"
    const dividerSection = figma.createFrame();
    dividerSection.name = "Divider Section";
    dividerSection.resize(384, 40);
    dividerSection.fills = [];
    dividerSection.layoutMode = 'HORIZONTAL';
    dividerSection.primaryAxisAlignItems = 'CENTER';
    dividerSection.counterAxisAlignItems = 'CENTER';
    dividerSection.itemSpacing = 12;

    const dividerLeft = figma.createRectangle();
    dividerLeft.name = "Divider Left";
    dividerLeft.resize(140, 1);
    dividerLeft.fills = [{ type: 'SOLID', color: { r: 0.90, g: 0.91, b: 0.92 } }];
    dividerSection.appendChild(dividerLeft);

    const dividerText = figma.createText();
    dividerText.fontName = { family: 'Inter', style: 'Medium' };
    dividerText.fontSize = 14;
    dividerText.characters = "Atau lanjutkan dengan";
    dividerText.fills = [{ type: 'SOLID', color: { r: 0.07, g: 0.11, b: 0.15 } }];
    dividerSection.appendChild(dividerText);

    const dividerRight = figma.createRectangle();
    dividerRight.name = "Divider Right";
    dividerRight.resize(140, 1);
    dividerRight.fills = [{ type: 'SOLID', color: { r: 0.90, g: 0.91, b: 0.92 } }];
    dividerSection.appendChild(dividerRight);

    formCard.appendChild(dividerSection);

    // Google Sign In Button
    const googleBtn = figma.createFrame();
    googleBtn.name = "Google Sign In";
    googleBtn.resize(384, 46);
    googleBtn.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
    googleBtn.strokeWeight = 1;
    googleBtn.strokes = [{ type: 'SOLID', color: { r: 0.82, g: 0.84, b: 0.86 } }];
    googleBtn.cornerRadius = 6;
    googleBtn.layoutMode = 'HORIZONTAL';
    googleBtn.primaryAxisAlignItems = 'CENTER';
    googleBtn.counterAxisAlignItems = 'CENTER';
    googleBtn.itemSpacing = 12;

    const googleIcon = figma.createText();
    googleIcon.fontName = { family: 'Inter', style: 'Regular' };
    googleIcon.fontSize = 20;
    googleIcon.characters = "G";
    googleIcon.fills = [{ type: 'SOLID', color: { r: 0.94, g: 0.27, b: 0.27 } }];
    googleBtn.appendChild(googleIcon);

    const googleText = figma.createText();
    googleText.fontName = { family: 'Inter', style: 'Bold' };
    googleText.fontSize = 14;
    googleText.characters = "Google";
    googleText.fills = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }];
    googleBtn.appendChild(googleText);

    formCard.appendChild(googleBtn);

    mainContent.appendChild(formCard);
    loginPage.appendChild(mainContent);

    // Add footer
    const footer = await createFooter();
    loginPage.appendChild(footer);

    console.log('Login Page frame created successfully');
    return loginPage;
  } catch (error) {
    console.error('Error in createLoginFrame:', error);
    throw new Error('Failed to create Login Page: ' + error.message);
  }
}

// Create Register Page Frame
async function createRegisterFrame() {
  try {
    const registerPage = figma.createFrame();
    registerPage.name = "Register Page - Desktop";
    registerPage.resize(1440, 1000);
    registerPage.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
    registerPage.layoutMode = 'VERTICAL';

    // Add header
    const header = await createHeader();
    registerPage.appendChild(header);

    // Section Title Area
    const sectionTitle = createSectionTitleComponent("Daftar", "Home | Daftar");
    registerPage.appendChild(sectionTitle);

    // Main Content Container
    const mainContent = figma.createFrame();
    mainContent.name = "Main Content";
    mainContent.resize(1440, 700);
    mainContent.fills = [];
    mainContent.layoutMode = 'VERTICAL';
    mainContent.primaryAxisAlignItems = 'CENTER';
    mainContent.counterAxisAlignItems = 'CENTER';
    mainContent.paddingTop = 48;
    mainContent.paddingBottom = 48;
    mainContent.itemSpacing = 20;

    // Page Title
    const pageTitle = figma.createText();
    pageTitle.fontName = { family: 'Inter', style: 'Regular' };
    pageTitle.fontSize = 24;
    pageTitle.characters = "Daftar dalam website kami";
    pageTitle.fills = [{ type: 'SOLID', color: { r: 0.07, g: 0.11, b: 0.15 } }];
    mainContent.appendChild(pageTitle);

    // Form Card
    const formCard = figma.createFrame();
    formCard.name = "Form Card";
    formCard.resize(480, 600);
    formCard.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
    formCard.cornerRadius = 8;
    formCard.layoutMode = 'VERTICAL';
    formCard.paddingTop = 48;
    formCard.paddingBottom = 48;
    formCard.paddingLeft = 48;
    formCard.paddingRight = 48;
    formCard.itemSpacing = 24;
    formCard.effects = [{
      type: 'DROP_SHADOW',
      color: { r: 0, g: 0, b: 0, a: 0.1 },
      offset: { x: 0, y: 4 },
      radius: 16,
      visible: true,
      blendMode: 'NORMAL'
    }];

    // First Name Input
    const firstNameInput = createFormInput("Nama depan", "text", "name");
    formCard.appendChild(firstNameInput);

    // Last Name Input
    const lastNameInput = createFormInput("Nama belakang", "text", "lastname");
    formCard.appendChild(lastNameInput);

    // Email Input
    const emailInput = createFormInput("Alamat email", "email", "email");
    formCard.appendChild(emailInput);

    // Password Input
    const passwordInput = createFormInput("Password", "password", "password");
    formCard.appendChild(passwordInput);

    // Confirm Password Input
    const confirmPasswordInput = createFormInput("Ulangi password", "password", "confirmpassword");
    formCard.appendChild(confirmPasswordInput);

    // Terms Checkbox
    const termsRow = figma.createFrame();
    termsRow.name = "Terms Row";
    termsRow.resize(384, 24);
    termsRow.fills = [];
    termsRow.layoutMode = 'HORIZONTAL';
    termsRow.itemSpacing = 8;

    const checkbox = figma.createFrame();
    checkbox.name = "Checkbox";
    checkbox.resize(16, 16);
    checkbox.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
    checkbox.strokeWeight = 1;
    checkbox.strokes = [{ type: 'SOLID', color: { r: 0.82, g: 0.84, b: 0.86 } }];
    checkbox.cornerRadius = 4;
    termsRow.appendChild(checkbox);

    const termsText = figma.createText();
    termsText.fontName = { family: 'Inter', style: 'Regular' };
    termsText.fontSize = 14;
    termsText.characters = "Terima persyaratan dan kebijakan privasi kami";
    termsText.fills = [{ type: 'SOLID', color: { r: 0.07, g: 0.11, b: 0.15 } }];
    termsText.resize(350, 24);
    termsText.textAutoResize = 'HEIGHT';
    termsRow.appendChild(termsText);

    formCard.appendChild(termsRow);

    // Submit Button
    const submitBtn = figma.createFrame();
    submitBtn.name = "Submit Button";
    submitBtn.resize(384, 46);
    submitBtn.fills = [{ type: 'SOLID', color: { r: 0.94, g: 0.27, b: 0.27 } }];
    submitBtn.cornerRadius = 6;
    submitBtn.layoutMode = 'HORIZONTAL';
    submitBtn.primaryAxisAlignItems = 'CENTER';
    submitBtn.counterAxisAlignItems = 'CENTER';

    const submitText = figma.createText();
    submitText.fontName = { family: 'Inter', style: 'Bold' };
    submitText.fontSize = 14;
    submitText.characters = "Daftar";
    submitText.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
    submitBtn.appendChild(submitText);

    formCard.appendChild(submitBtn);

    mainContent.appendChild(formCard);
    registerPage.appendChild(mainContent);

    // Add footer
    const footer = await createFooter();
    registerPage.appendChild(footer);

    console.log('Register Page frame created successfully');
    return registerPage;
  } catch (error) {
    console.error('Error in createRegisterFrame:', error);
    throw new Error('Failed to create Register Page: ' + error.message);
  }
}

// ==========================================
// HELPER FUNCTIONS FOR SHOP PAGE
// ==========================================

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

// ==========================================
// HELPER FUNCTIONS FOR PRODUCT DETAIL PAGE
// ==========================================

// Create Product Image Section
function createProductImageSection() {
  const imagesSection = figma.createFrame();
  imagesSection.name = "Product Images";
  imagesSection.resize(840, 480);
  imagesSection.fills = [];
  imagesSection.layoutMode = 'HORIZONTAL';
  imagesSection.primaryAxisAlignItems = 'MIN';
  imagesSection.itemSpacing = 32;

  // Images Container (left)
  const imagesContainer = figma.createFrame();
  imagesContainer.name = "Images Container";
  imagesContainer.resize(400, 480);
  imagesContainer.fills = [];
  imagesContainer.layoutMode = 'VERTICAL';
  imagesContainer.itemSpacing = 20;

  // Main Product Image
  const mainImage = figma.createFrame();
  mainImage.name = "Main Product Image";
  mainImage.resize(350, 350);
  mainImage.fills = [{ type: 'SOLID', color: { r: 0.95, g: 0.96, b: 0.96 } }];
  mainImage.cornerRadius = 8;
  mainImage.layoutMode = 'VERTICAL';
  mainImage.primaryAxisAlignItems = 'CENTER';
  mainImage.counterAxisAlignItems = 'CENTER';

  const imageLabel = figma.createText();
  imageLabel.fontName = { family: 'Inter', style: 'Medium' };
  imageLabel.fontSize = 14;
  imageLabel.characters = "PRODUCT IMAGE\n350x350";
  imageLabel.textAlignHorizontal = 'CENTER';
  imageLabel.fills = [{ type: 'SOLID', color: { r: 0.61, g: 0.64, b: 0.69 } }];
  mainImage.appendChild(imageLabel);

  imagesContainer.appendChild(mainImage);

  // Thumbnail Images
  const thumbnails = figma.createFrame();
  thumbnails.name = "Thumbnails";
  thumbnails.resize(350, 100);
  thumbnails.fills = [];
  thumbnails.layoutMode = 'HORIZONTAL';
  thumbnails.itemSpacing = 10;

  for (let i = 0; i < 3; i++) {
    const thumb = figma.createFrame();
    thumb.name = `Thumbnail ${i + 1}`;
    thumb.resize(100, 100);
    thumb.fills = [{ type: 'SOLID', color: { r: 0.90, g: 0.91, b: 0.92 } }];
    thumb.cornerRadius = 4;
    thumbnails.appendChild(thumb);
  }

  imagesContainer.appendChild(thumbnails);
  imagesSection.appendChild(imagesContainer);

  // Product Basic Info (right)
  const basicInfo = figma.createFrame();
  basicInfo.name = "Product Basic Info";
  basicInfo.resize(408, 480);
  basicInfo.fills = [];
  basicInfo.layoutMode = 'VERTICAL';
  basicInfo.itemSpacing = 16;

  // Product Title
  const title = figma.createText();
  title.fontName = { family: 'Inter', style: 'Bold' };
  title.fontSize = 24;
  title.characters = "Smart Phone Demo";
  title.fills = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }];
  title.resize(408, 60);
  title.textAutoResize = 'HEIGHT';
  basicInfo.appendChild(title);

  // Rating
  const rating = figma.createFrame();
  rating.name = "Rating";
  rating.resize(408, 24);
  rating.fills = [];
  rating.layoutMode = 'HORIZONTAL';
  rating.itemSpacing = 12;

  const stars = figma.createText();
  stars.fontName = { family: 'Inter', style: 'Regular' };
  stars.fontSize = 18;
  stars.characters = "★★★★☆";
  stars.fills = [{ type: 'SOLID', color: { r: 0.96, g: 0.75, b: 0.17 } }];
  rating.appendChild(stars);

  const ratingText = figma.createText();
  ratingText.fontName = { family: 'Inter', style: 'Regular' };
  ratingText.fontSize = 14;
  ratingText.characters = "(4.0)";
  ratingText.fills = [{ type: 'SOLID', color: { r: 0.61, g: 0.64, b: 0.69 } }];
  rating.appendChild(ratingText);

  basicInfo.appendChild(rating);

  // Price
  const price = figma.createText();
  price.fontName = { family: 'Inter', style: 'Bold' };
  price.fontSize = 20;
  price.characters = "Rp 5,000,000";
  price.fills = [{ type: 'SOLID', color: { r: 0.94, g: 0.27, b: 0.27 } }];
  basicInfo.appendChild(price);

  // Wishlist Button
  const wishlistBtn = figma.createFrame();
  wishlistBtn.name = "Wishlist Button";
  wishlistBtn.resize(200, 40);
  wishlistBtn.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
  wishlistBtn.strokeWeight = 1;
  wishlistBtn.strokes = [{ type: 'SOLID', color: { r: 0.94, g: 0.27, b: 0.27 } }];
  wishlistBtn.cornerRadius = 8;
  wishlistBtn.layoutMode = 'HORIZONTAL';
  wishlistBtn.primaryAxisAlignItems = 'CENTER';
  wishlistBtn.counterAxisAlignItems = 'CENTER';
  wishlistBtn.itemSpacing = 8;
  wishlistBtn.paddingLeft = 16;
  wishlistBtn.paddingRight = 16;

  const heartIcon = figma.createText();
  heartIcon.fontName = { family: 'Inter', style: 'Regular' };
  heartIcon.fontSize = 16;
  heartIcon.characters = "♥";
  heartIcon.fills = [{ type: 'SOLID', color: { r: 0.94, g: 0.27, b: 0.27 } }];
  wishlistBtn.appendChild(heartIcon);

  const wishlistText = figma.createText();
  wishlistText.fontName = { family: 'Inter', style: 'Medium' };
  wishlistText.fontSize = 14;
  wishlistText.characters = "Add to Wishlist";
  wishlistText.fills = [{ type: 'SOLID', color: { r: 0.94, g: 0.27, b: 0.27 } }];
  wishlistBtn.appendChild(wishlistText);

  basicInfo.appendChild(wishlistBtn);

  // Divider
  const divider1 = figma.createRectangle();
  divider1.name = "Divider";
  divider1.resize(408, 1);
  divider1.fills = [{ type: 'SOLID', color: { r: 0.90, g: 0.91, b: 0.92 } }];
  basicInfo.appendChild(divider1);

  // Product Info Details
  const infoDetails = figma.createFrame();
  infoDetails.name = "Product Info";
  infoDetails.resize(408, 120);
  infoDetails.fills = [];
  infoDetails.layoutMode = 'VERTICAL';
  infoDetails.itemSpacing = 12;

  const infoTitle = figma.createText();
  infoTitle.fontName = { family: 'Inter', style: 'Bold' };
  infoTitle.fontSize = 14;
  infoTitle.characters = "Informasi Produk";
  infoTitle.fills = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }];
  infoDetails.appendChild(infoTitle);

  const infoItems = [
    { label: "Manufacturer:", value: "Diamond Electronic" },
    { label: "Category:", value: "Elektronik" },
    { label: "Color:", value: "Silver, Blue" }
  ];

  infoItems.forEach(item => {
    const infoRow = figma.createFrame();
    infoRow.name = item.label;
    infoRow.resize(408, 20);
    infoRow.fills = [];
    infoRow.layoutMode = 'HORIZONTAL';
    infoRow.itemSpacing = 8;

    const label = figma.createText();
    label.fontName = { family: 'Inter', style: 'Regular' };
    label.fontSize = 14;
    label.characters = item.label;
    label.fills = [{ type: 'SOLID', color: { r: 0.61, g: 0.64, b: 0.69 } }];
    infoRow.appendChild(label);

    const value = figma.createText();
    value.fontName = { family: 'Inter', style: 'Regular' };
    value.fontSize = 14;
    value.characters = item.value;
    value.fills = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }];
    infoRow.appendChild(value);

    infoDetails.appendChild(infoRow);
  });

  basicInfo.appendChild(infoDetails);

  // Divider
  const divider2 = figma.createRectangle();
  divider2.name = "Divider";
  divider2.resize(408, 1);
  divider2.fills = [{ type: 'SOLID', color: { r: 0.90, g: 0.91, b: 0.92 } }];
  basicInfo.appendChild(divider2);

  // Social Share
  const socialShare = figma.createFrame();
  socialShare.name = "Social Share";
  socialShare.resize(408, 40);
  socialShare.fills = [];
  socialShare.layoutMode = 'HORIZONTAL';
  socialShare.itemSpacing = 12;

  const shareText = figma.createText();
  shareText.fontName = { family: 'Inter', style: 'Medium' };
  shareText.fontSize = 14;
  shareText.characters = "Bagikan:";
  shareText.fills = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }];
  socialShare.appendChild(shareText);

  const socialIcons = ['FB', 'TW', 'IG', 'WA'];
  socialIcons.forEach(icon => {
    const socialBtn = figma.createFrame();
    socialBtn.name = icon;
    socialBtn.resize(40, 40);
    socialBtn.fills = [{ type: 'SOLID', color: { r: 0.95, g: 0.96, b: 0.96 } }];
    socialBtn.cornerRadius = 20;
    socialBtn.layoutMode = 'VERTICAL';
    socialBtn.primaryAxisAlignItems = 'CENTER';
    socialBtn.counterAxisAlignItems = 'CENTER';

    const iconText = figma.createText();
    iconText.fontName = { family: 'Inter', style: 'Bold' };
    iconText.fontSize = 12;
    iconText.characters = icon;
    iconText.fills = [{ type: 'SOLID', color: { r: 0.42, g: 0.45, b: 0.50 } }];
    socialBtn.appendChild(iconText);

    socialShare.appendChild(socialBtn);
  });

  basicInfo.appendChild(socialShare);

  imagesSection.appendChild(basicInfo);

  return imagesSection;
}

// Create Product Info Section (additional content)
function createProductInfoSection() {
  const infoSection = figma.createFrame();
  infoSection.name = "Additional Info Section";
  infoSection.resize(840, 1);
  infoSection.fills = [];

  return infoSection;
}

// Create Reviews Card
function createReviewsCard() {
  const reviewsCard = figma.createFrame();
  reviewsCard.name = "Reviews Card";
  reviewsCard.resize(840, 350);
  reviewsCard.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
  reviewsCard.strokeWeight = 1;
  reviewsCard.strokes = [{ type: 'SOLID', color: { r: 0.90, g: 0.91, b: 0.92 } }];
  reviewsCard.cornerRadius = 8;
  reviewsCard.layoutMode = 'VERTICAL';
  reviewsCard.paddingTop = 24;
  reviewsCard.paddingBottom = 24;
  reviewsCard.paddingLeft = 24;
  reviewsCard.paddingRight = 24;
  reviewsCard.itemSpacing = 16;

  // Card Title
  const cardTitle = figma.createText();
  cardTitle.fontName = { family: 'Inter', style: 'Bold' };
  cardTitle.fontSize = 18;
  cardTitle.characters = "Ulasan Pelanggan";
  cardTitle.fills = [{ type: 'SOLID', color: { r: 0.07, g: 0.11, b: 0.15 } }];
  reviewsCard.appendChild(cardTitle);

  // Overall Rating
  const overallRating = figma.createFrame();
  overallRating.name = "Overall Rating";
  overallRating.resize(792, 24);
  overallRating.fills = [];
  overallRating.layoutMode = 'HORIZONTAL';
  overallRating.itemSpacing = 8;

  const starsOverall = figma.createText();
  starsOverall.fontName = { family: 'Inter', style: 'Regular' };
  starsOverall.fontSize = 16;
  starsOverall.characters = "★★★★☆";
  starsOverall.fills = [{ type: 'SOLID', color: { r: 0.96, g: 0.75, b: 0.17 } }];
  overallRating.appendChild(starsOverall);

  const ratingNum = figma.createText();
  ratingNum.fontName = { family: 'Inter', style: 'Regular' };
  ratingNum.fontSize = 14;
  ratingNum.characters = "4.0 dari 5";
  ratingNum.fills = [{ type: 'SOLID', color: { r: 0.61, g: 0.64, b: 0.69 } }];
  overallRating.appendChild(ratingNum);

  reviewsCard.appendChild(overallRating);

  // Review Count
  const reviewCount = figma.createText();
  reviewCount.fontName = { family: 'Inter', style: 'Regular' };
  reviewCount.fontSize = 14;
  reviewCount.characters = "Berdasarkan 127 ulasan";
  reviewCount.fills = [{ type: 'SOLID', color: { r: 0.61, g: 0.64, b: 0.69 } }];
  reviewsCard.appendChild(reviewCount);

  // Sample Review 1
  const review1 = createSingleReview(
    "★★★★★",
    "2 hari lalu",
    "Produk berkualitas bagus, sesuai deskripsi. Pengiriman cepat dan packing aman.",
    "Budi Santoso"
  );
  reviewsCard.appendChild(review1);

  // Sample Review 2
  const review2 = createSingleReview(
    "★★★★☆",
    "1 minggu lalu",
    "Harga terjangkau, kualitas memuaskan. Recommended seller!",
    "Siti Rahayu"
  );
  reviewsCard.appendChild(review2);

  return reviewsCard;
}

// Create Single Review Component
function createSingleReview(stars, time, comment, author) {
  const review = figma.createFrame();
  review.name = "Review";
  review.resize(792, 80);
  review.fills = [];
  review.layoutMode = 'VERTICAL';
  review.itemSpacing = 8;
  review.paddingTop = 12;
  review.strokeTopWeight = 1;
  review.strokes = [{ type: 'SOLID', color: { r: 0.90, g: 0.91, b: 0.92 } }];

  // Review Header
  const reviewHeader = figma.createFrame();
  reviewHeader.name = "Review Header";
  reviewHeader.resize(792, 20);
  reviewHeader.fills = [];
  reviewHeader.layoutMode = 'HORIZONTAL';
  reviewHeader.itemSpacing = 8;

  const reviewStars = figma.createText();
  reviewStars.fontName = { family: 'Inter', style: 'Regular' };
  reviewStars.fontSize = 14;
  reviewStars.characters = stars;
  reviewStars.fills = [{ type: 'SOLID', color: { r: 0.96, g: 0.75, b: 0.17 } }];
  reviewHeader.appendChild(reviewStars);

  const reviewTime = figma.createText();
  reviewTime.fontName = { family: 'Inter', style: 'Regular' };
  reviewTime.fontSize = 12;
  reviewTime.characters = time;
  reviewTime.fills = [{ type: 'SOLID', color: { r: 0.61, g: 0.64, b: 0.69 } }];
  reviewHeader.appendChild(reviewTime);

  review.appendChild(reviewHeader);

  // Review Comment
  const reviewComment = figma.createText();
  reviewComment.fontName = { family: 'Inter', style: 'Regular' };
  reviewComment.fontSize = 14;
  reviewComment.characters = comment;
  reviewComment.fills = [{ type: 'SOLID', color: { r: 0.22, g: 0.26, b: 0.31 } }];
  reviewComment.resize(792, 40);
  reviewComment.textAutoResize = 'HEIGHT';
  review.appendChild(reviewComment);

  // Review Author
  const reviewAuthor = figma.createText();
  reviewAuthor.fontName = { family: 'Inter', style: 'Regular' };
  reviewAuthor.fontSize = 12;
  reviewAuthor.characters = `- ${author}`;
  reviewAuthor.fills = [{ type: 'SOLID', color: { r: 0.42, g: 0.45, b: 0.50 } }];
  review.appendChild(reviewAuthor);

  return review;
}

// Create Description Card
function createDescriptionCard() {
  const descCard = figma.createFrame();
  descCard.name = "Description Card";
  descCard.resize(840, 800);
  descCard.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
  descCard.strokeWeight = 1;
  descCard.strokes = [{ type: 'SOLID', color: { r: 0.90, g: 0.91, b: 0.92 } }];
  descCard.cornerRadius = 8;
  descCard.layoutMode = 'VERTICAL';

  // Description Section
  const descSection = figma.createFrame();
  descSection.name = "Description Section";
  descSection.resize(840, 200);
  descSection.fills = [];
  descSection.layoutMode = 'VERTICAL';
  descSection.paddingTop = 24;
  descSection.paddingBottom = 24;
  descSection.paddingLeft = 24;
  descSection.paddingRight = 24;
  descSection.itemSpacing = 16;
  descSection.strokeBottomWeight = 1;
  descSection.strokes = [{ type: 'SOLID', color: { r: 0.90, g: 0.91, b: 0.92 } }];

  const descTitle = figma.createText();
  descTitle.fontName = { family: 'Inter', style: 'Bold' };
  descTitle.fontSize = 20;
  descTitle.characters = "Deskripsi Produk";
  descTitle.fills = [{ type: 'SOLID', color: { r: 0.07, g: 0.11, b: 0.15 } }];
  descSection.appendChild(descTitle);

  const descText = figma.createText();
  descText.fontName = { family: 'Inter', style: 'Regular' };
  descText.fontSize = 14;
  descText.characters = "Produk berkualitas tinggi dari Diamond Electronic. Sempurna untuk memenuhi\nkebutuhan rumah tangga Anda dengan desain modern dan teknologi terkini.";
  descText.fills = [{ type: 'SOLID', color: { r: 0.22, g: 0.26, b: 0.31 } }];
  descText.resize(792, 60);
  descText.textAutoResize = 'HEIGHT';
  descSection.appendChild(descText);

  descCard.appendChild(descSection);

  // Specifications Section
  const specsSection = figma.createFrame();
  specsSection.name = "Specifications Section";
  specsSection.resize(840, 200);
  specsSection.fills = [];
  specsSection.layoutMode = 'VERTICAL';
  specsSection.paddingTop = 24;
  specsSection.paddingBottom = 24;
  specsSection.paddingLeft = 24;
  specsSection.paddingRight = 24;
  specsSection.itemSpacing = 16;
  specsSection.strokeBottomWeight = 1;
  specsSection.strokes = [{ type: 'SOLID', color: { r: 0.90, g: 0.91, b: 0.92 } }];

  const specsTitle = figma.createText();
  specsTitle.fontName = { family: 'Inter', style: 'Bold' };
  specsTitle.fontSize = 20;
  specsTitle.characters = "Spesifikasi Produk";
  specsTitle.fills = [{ type: 'SOLID', color: { r: 0.07, g: 0.11, b: 0.15 } }];
  specsSection.appendChild(specsTitle);

  const specsGrid = figma.createFrame();
  specsGrid.name = "Specs Grid";
  specsGrid.resize(792, 120);
  specsGrid.fills = [];
  specsGrid.layoutMode = 'HORIZONTAL';
  specsGrid.itemSpacing = 32;

  // Column 1
  const specsCol1 = figma.createFrame();
  specsCol1.name = "Specs Column 1";
  specsCol1.resize(380, 120);
  specsCol1.fills = [];
  specsCol1.layoutMode = 'VERTICAL';
  specsCol1.itemSpacing = 8;

  const col1Title = figma.createText();
  col1Title.fontName = { family: 'Inter', style: 'Medium' };
  col1Title.fontSize = 14;
  col1Title.characters = "Spesifikasi Umum";
  col1Title.fills = [{ type: 'SOLID', color: { r: 0.07, g: 0.11, b: 0.15 } }];
  specsCol1.appendChild(col1Title);

  const specs1 = [
    { label: "Merek", value: "Diamond Electronic" },
    { label: "Model", value: "DE-2025" },
    { label: "Garansi", value: "1 Tahun" }
  ];

  specs1.forEach(spec => {
    const specRow = createSpecRow(spec.label, spec.value);
    specsCol1.appendChild(specRow);
  });

  specsGrid.appendChild(specsCol1);

  // Column 2
  const specsCol2 = figma.createFrame();
  specsCol2.name = "Specs Column 2";
  specsCol2.resize(380, 120);
  specsCol2.fills = [];
  specsCol2.layoutMode = 'VERTICAL';
  specsCol2.itemSpacing = 8;

  const col2Title = figma.createText();
  col2Title.fontName = { family: 'Inter', style: 'Medium' };
  col2Title.fontSize = 14;
  col2Title.characters = "Dimensi";
  col2Title.fills = [{ type: 'SOLID', color: { r: 0.07, g: 0.11, b: 0.15 } }];
  specsCol2.appendChild(col2Title);

  const specs2 = [
    { label: "Panjang", value: "30 cm" },
    { label: "Lebar", value: "20 cm" },
    { label: "Tinggi", value: "15 cm" }
  ];

  specs2.forEach(spec => {
    const specRow = createSpecRow(spec.label, spec.value);
    specsCol2.appendChild(specRow);
  });

  specsGrid.appendChild(specsCol2);

  specsSection.appendChild(specsGrid);
  descCard.appendChild(specsSection);

  // Shipping Section
  const shippingSection = figma.createFrame();
  shippingSection.name = "Shipping Section";
  shippingSection.resize(840, 150);
  shippingSection.fills = [];
  shippingSection.layoutMode = 'VERTICAL';
  shippingSection.paddingTop = 24;
  shippingSection.paddingBottom = 24;
  shippingSection.paddingLeft = 24;
  shippingSection.paddingRight = 24;
  shippingSection.itemSpacing = 12;
  shippingSection.strokeBottomWeight = 1;
  shippingSection.strokes = [{ type: 'SOLID', color: { r: 0.90, g: 0.91, b: 0.92 } }];

  const shippingTitle = figma.createText();
  shippingTitle.fontName = { family: 'Inter', style: 'Bold' };
  shippingTitle.fontSize = 20;
  shippingTitle.characters = "Informasi Pengiriman";
  shippingTitle.fills = [{ type: 'SOLID', color: { r: 0.07, g: 0.11, b: 0.15 } }];
  shippingSection.appendChild(shippingTitle);

  const shipping1 = createShippingItem("📦", "Pengiriman Lokal", "Estimasi 2-3 hari kerja untuk Surabaya");
  shippingSection.appendChild(shipping1);

  const shipping2 = createShippingItem("✓", "Pengiriman Nasional", "Estimasi 5-7 hari kerja untuk luar kota");
  shippingSection.appendChild(shipping2);

  descCard.appendChild(shippingSection);

  // Return Policy Section
  const returnSection = figma.createFrame();
  returnSection.name = "Return Policy Section";
  returnSection.resize(840, 150);
  returnSection.fills = [];
  returnSection.layoutMode = 'VERTICAL';
  returnSection.paddingTop = 24;
  returnSection.paddingBottom = 24;
  returnSection.paddingLeft = 24;
  returnSection.paddingRight = 24;
  returnSection.itemSpacing = 16;

  const returnTitle = figma.createText();
  returnTitle.fontName = { family: 'Inter', style: 'Bold' };
  returnTitle.fontSize = 20;
  returnTitle.characters = "Kebijakan Pengembalian";
  returnTitle.fills = [{ type: 'SOLID', color: { r: 0.07, g: 0.11, b: 0.15 } }];
  returnSection.appendChild(returnTitle);

  const returnAlert = figma.createFrame();
  returnAlert.name = "Return Alert";
  returnAlert.resize(792, 70);
  returnAlert.fills = [{ type: 'SOLID', color: { r: 0.99, g: 0.97, b: 0.88 } }];
  returnAlert.strokeWeight = 1;
  returnAlert.strokes = [{ type: 'SOLID', color: { r: 0.98, g: 0.87, b: 0.57 } }];
  returnAlert.cornerRadius = 6;
  returnAlert.layoutMode = 'HORIZONTAL';
  returnAlert.paddingTop = 16;
  returnAlert.paddingBottom = 16;
  returnAlert.paddingLeft = 16;
  returnAlert.paddingRight = 16;
  returnAlert.itemSpacing = 12;

  const alertIcon = figma.createText();
  alertIcon.fontName = { family: 'Inter', style: 'Bold' };
  alertIcon.fontSize = 20;
  alertIcon.characters = "⚠";
  alertIcon.fills = [{ type: 'SOLID', color: { r: 0.72, g: 0.54, b: 0.05 } }];
  returnAlert.appendChild(alertIcon);

  const alertText = figma.createText();
  alertText.fontName = { family: 'Inter', style: 'Regular' };
  alertText.fontSize = 14;
  alertText.characters = "Perhatian: Produk dapat dikembalikan dalam 7 hari jika ada cacat\npabrik atau tidak sesuai deskripsi.";
  alertText.fills = [{ type: 'SOLID', color: { r: 0.72, g: 0.54, b: 0.05 } }];
  alertText.resize(720, 40);
  alertText.textAutoResize = 'HEIGHT';
  returnAlert.appendChild(alertText);

  returnSection.appendChild(returnAlert);
  descCard.appendChild(returnSection);

  return descCard;
}

// Create Spec Row Component
function createSpecRow(label, value) {
  const specRow = figma.createFrame();
  specRow.name = `Spec ${label}`;
  specRow.resize(380, 20);
  specRow.fills = [];
  specRow.layoutMode = 'HORIZONTAL';
  specRow.primaryAxisSizingMode = 'FIXED';
  specRow.primaryAxisAlignItems = 'SPACE_BETWEEN';

  const specLabel = figma.createText();
  specLabel.fontName = { family: 'Inter', style: 'Regular' };
  specLabel.fontSize = 14;
  specLabel.characters = label;
  specLabel.fills = [{ type: 'SOLID', color: { r: 0.61, g: 0.64, b: 0.69 } }];
  specRow.appendChild(specLabel);

  const specValue = figma.createText();
  specValue.fontName = { family: 'Inter', style: 'Regular' };
  specValue.fontSize = 14;
  specValue.characters = value;
  specValue.fills = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }];
  specRow.appendChild(specValue);

  return specRow;
}

// Create Shipping Item Component
function createShippingItem(icon, title, description) {
  const item = figma.createFrame();
  item.name = title;
  item.resize(792, 40);
  item.fills = [];
  item.layoutMode = 'HORIZONTAL';
  item.itemSpacing = 12;

  const iconCircle = figma.createFrame();
  iconCircle.name = "Icon";
  iconCircle.resize(32, 32);
  iconCircle.fills = [{ type: 'SOLID', color: { r: 0.86, g: 0.93, b: 0.99 } }];
  iconCircle.cornerRadius = 16;
  iconCircle.layoutMode = 'VERTICAL';
  iconCircle.primaryAxisAlignItems = 'CENTER';
  iconCircle.counterAxisAlignItems = 'CENTER';

  const iconText = figma.createText();
  iconText.fontName = { family: 'Inter', style: 'Regular' };
  iconText.fontSize = 16;
  iconText.characters = icon;
  iconText.fills = [{ type: 'SOLID', color: { r: 0.23, g: 0.51, b: 0.96 } }];
  iconCircle.appendChild(iconText);

  item.appendChild(iconCircle);

  const textContent = figma.createFrame();
  textContent.name = "Text Content";
  textContent.resize(748, 40);
  textContent.fills = [];
  textContent.layoutMode = 'VERTICAL';
  textContent.itemSpacing = 4;

  const titleText = figma.createText();
  titleText.fontName = { family: 'Inter', style: 'Medium' };
  titleText.fontSize = 14;
  titleText.characters = title;
  titleText.fills = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }];
  textContent.appendChild(titleText);

  const descText = figma.createText();
  descText.fontName = { family: 'Inter', style: 'Regular' };
  descText.fontSize = 12;
  descText.characters = description;
  descText.fills = [{ type: 'SOLID', color: { r: 0.61, g: 0.64, b: 0.69 } }];
  textContent.appendChild(descText);

  item.appendChild(textContent);

  return item;
}

// Create Product Summary Card (Right Sidebar)
function createProductSummaryCard() {
  const summaryCard = figma.createFrame();
  summaryCard.name = "Product Summary Card";
  summaryCard.resize(408, 600);
  summaryCard.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
  summaryCard.strokeWeight = 1;
  summaryCard.strokes = [{ type: 'SOLID', color: { r: 0.90, g: 0.91, b: 0.92 } }];
  summaryCard.cornerRadius = 8;
  summaryCard.layoutMode = 'VERTICAL';

  // Summary Section
  const summarySection = figma.createFrame();
  summarySection.name = "Summary Section";
  summarySection.resize(408, 280);
  summarySection.fills = [];
  summarySection.layoutMode = 'VERTICAL';
  summarySection.paddingTop = 24;
  summarySection.paddingBottom = 24;
  summarySection.paddingLeft = 24;
  summarySection.paddingRight = 24;
  summarySection.itemSpacing = 12;
  summarySection.strokeBottomWeight = 1;
  summarySection.strokes = [{ type: 'SOLID', color: { r: 0.90, g: 0.91, b: 0.92 } }];

  const summaryTitle = figma.createText();
  summaryTitle.fontName = { family: 'Inter', style: 'Bold' };
  summaryTitle.fontSize = 20;
  summaryTitle.characters = "Ringkasan Produk";
  summaryTitle.fills = [{ type: 'SOLID', color: { r: 0.07, g: 0.11, b: 0.15 } }];
  summarySection.appendChild(summaryTitle);

  const summaryItems = [
    { label: "Kategori", value: "Elektronik" },
    { label: "Kondisi", value: "Baru" },
    { label: "Stok", value: "94 unit" },
    { label: "Garansi", value: "1 Tahun" }
  ];

  summaryItems.forEach(item => {
    const summaryRow = figma.createFrame();
    summaryRow.name = item.label;
    summaryRow.resize(360, 32);
    summaryRow.fills = [];
    summaryRow.layoutMode = 'HORIZONTAL';
    summaryRow.primaryAxisSizingMode = 'FIXED';
    summaryRow.primaryAxisAlignItems = 'SPACE_BETWEEN';
    summaryRow.paddingTop = 8;
    summaryRow.paddingBottom = 8;

    const label = figma.createText();
    label.fontName = { family: 'Inter', style: 'Regular' };
    label.fontSize = 14;
    label.characters = item.label;
    label.fills = [{ type: 'SOLID', color: { r: 0.61, g: 0.64, b: 0.69 } }];
    summaryRow.appendChild(label);

    const value = figma.createText();
    value.fontName = { family: 'Inter', style: 'Medium' };
    value.fontSize = 14;
    value.characters = item.value;
    value.fills = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }];
    summaryRow.appendChild(value);

    summarySection.appendChild(summaryRow);
  });

  summaryCard.appendChild(summarySection);

  // Action Buttons Section
  const actionsSection = figma.createFrame();
  actionsSection.name = "Action Buttons";
  actionsSection.resize(408, 320);
  actionsSection.fills = [];
  actionsSection.layoutMode = 'VERTICAL';
  actionsSection.paddingTop = 24;
  actionsSection.paddingBottom = 24;
  actionsSection.paddingLeft = 24;
  actionsSection.paddingRight = 24;
  actionsSection.itemSpacing = 16;

  // Quantity Selector
  const quantitySection = figma.createFrame();
  quantitySection.name = "Quantity";
  quantitySection.resize(360, 80);
  quantitySection.fills = [];
  quantitySection.layoutMode = 'VERTICAL';
  quantitySection.itemSpacing = 8;

  const quantityLabel = figma.createText();
  quantityLabel.fontName = { family: 'Inter', style: 'Medium' };
  quantityLabel.fontSize = 14;
  quantityLabel.characters = "Jumlah";
  quantityLabel.fills = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }];
  quantitySection.appendChild(quantityLabel);

  const quantityInput = figma.createFrame();
  quantityInput.name = "Quantity Input";
  quantityInput.resize(120, 40);
  quantityInput.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
  quantityInput.strokeWeight = 1;
  quantityInput.strokes = [{ type: 'SOLID', color: { r: 0.90, g: 0.91, b: 0.92 } }];
  quantityInput.cornerRadius = 8;
  quantityInput.layoutMode = 'HORIZONTAL';
  quantityInput.primaryAxisAlignItems = 'SPACE_BETWEEN';
  quantityInput.counterAxisAlignItems = 'CENTER';
  quantityInput.paddingLeft = 12;
  quantityInput.paddingRight = 12;

  const minusBtn = figma.createText();
  minusBtn.fontName = { family: 'Inter', style: 'Bold' };
  minusBtn.fontSize = 18;
  minusBtn.characters = "−";
  minusBtn.fills = [{ type: 'SOLID', color: { r: 0.61, g: 0.64, b: 0.69 } }];
  quantityInput.appendChild(minusBtn);

  const quantityValue = figma.createText();
  quantityValue.fontName = { family: 'Inter', style: 'Medium' };
  quantityValue.fontSize = 16;
  quantityValue.characters = "1";
  quantityValue.fills = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }];
  quantityInput.appendChild(quantityValue);

  const plusBtn = figma.createText();
  plusBtn.fontName = { family: 'Inter', style: 'Bold' };
  plusBtn.fontSize = 18;
  plusBtn.characters = "+";
  plusBtn.fills = [{ type: 'SOLID', color: { r: 0.61, g: 0.64, b: 0.69 } }];
  quantityInput.appendChild(plusBtn);

  quantitySection.appendChild(quantityInput);
  actionsSection.appendChild(quantitySection);

  // Add to Cart Button
  const addToCartBtn = figma.createFrame();
  addToCartBtn.name = "Add to Cart Button";
  addToCartBtn.resize(360, 50);
  addToCartBtn.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
  addToCartBtn.strokeWeight = 2;
  addToCartBtn.strokes = [{ type: 'SOLID', color: { r: 0.94, g: 0.27, b: 0.27 } }];
  addToCartBtn.cornerRadius = 8;
  addToCartBtn.layoutMode = 'HORIZONTAL';
  addToCartBtn.primaryAxisAlignItems = 'CENTER';
  addToCartBtn.counterAxisAlignItems = 'CENTER';
  addToCartBtn.effects = [{
    type: 'DROP_SHADOW',
    color: { r: 0, g: 0, b: 0, a: 0.1 },
    offset: { x: 0, y: 2 },
    radius: 4,
    visible: true,
    blendMode: 'NORMAL'
  }];

  const addToCartText = figma.createText();
  addToCartText.fontName = { family: 'Inter', style: 'Bold' };
  addToCartText.fontSize = 16;
  addToCartText.characters = "🛒 Tambah ke Keranjang";
  addToCartText.fills = [{ type: 'SOLID', color: { r: 0.94, g: 0.27, b: 0.27 } }];
  addToCartBtn.appendChild(addToCartText);

  actionsSection.appendChild(addToCartBtn);

  // Buy Now Button
  const buyNowBtn = figma.createFrame();
  buyNowBtn.name = "Buy Now Button";
  buyNowBtn.resize(360, 50);
  buyNowBtn.fills = [{ type: 'SOLID', color: { r: 0.94, g: 0.27, b: 0.27 } }];
  buyNowBtn.cornerRadius = 8;
  buyNowBtn.layoutMode = 'HORIZONTAL';
  buyNowBtn.primaryAxisAlignItems = 'CENTER';
  buyNowBtn.counterAxisAlignItems = 'CENTER';
  buyNowBtn.effects = [{
    type: 'DROP_SHADOW',
    color: { r: 0, g: 0, b: 0, a: 0.15 },
    offset: { x: 0, y: 2 },
    radius: 8,
    visible: true,
    blendMode: 'NORMAL'
  }];

  const buyNowText = figma.createText();
  buyNowText.fontName = { family: 'Inter', style: 'Bold' };
  buyNowText.fontSize = 16;
  buyNowText.characters = "⚡ Beli Sekarang";
  buyNowText.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
  buyNowBtn.appendChild(buyNowText);

  actionsSection.appendChild(buyNowBtn);

  // Additional Info
  const additionalInfo = figma.createText();
  additionalInfo.fontName = { family: 'Inter', style: 'Regular' };
  additionalInfo.fontSize = 12;
  additionalInfo.characters = "💳 Tersedia berbagai metode pembayaran\n🚚 Gratis ongkir untuk pembelian di atas Rp 500.000";
  additionalInfo.fills = [{ type: 'SOLID', color: { r: 0.42, g: 0.45, b: 0.50 } }];
  additionalInfo.resize(360, 40);
  additionalInfo.textAutoResize = 'HEIGHT';
  actionsSection.appendChild(additionalInfo);

  summaryCard.appendChild(actionsSection);

  return summaryCard;
}

// ==========================================
// HELPER FUNCTIONS FOR LOGIN & REGISTER PAGES
// ==========================================

// Create Section Title Component
function createSectionTitleComponent(title, breadcrumb) {
  const sectionTitle = figma.createFrame();
  sectionTitle.name = "Section Title";
  sectionTitle.resize(1440, 80);
  sectionTitle.fills = [{ type: 'SOLID', color: { r: 0.98, g: 0.98, b: 0.98 } }];
  sectionTitle.layoutMode = 'VERTICAL';
  sectionTitle.primaryAxisAlignItems = 'CENTER';
  sectionTitle.counterAxisAlignItems = 'CENTER';
  sectionTitle.itemSpacing = 8;

  const titleText = figma.createText();
  titleText.fontName = { family: 'Inter', style: 'Bold' };
  titleText.fontSize = 28;
  titleText.characters = title;
  titleText.fills = [{ type: 'SOLID', color: { r: 0.07, g: 0.11, b: 0.15 } }];
  sectionTitle.appendChild(titleText);

  const breadcrumbText = figma.createText();
  breadcrumbText.fontName = { family: 'Inter', style: 'Regular' };
  breadcrumbText.fontSize = 14;
  breadcrumbText.characters = breadcrumb;
  breadcrumbText.fills = [{ type: 'SOLID', color: { r: 0.61, g: 0.64, b: 0.69 } }];
  sectionTitle.appendChild(breadcrumbText);

  return sectionTitle;
}

// Create Form Input Component
function createFormInput(label, inputType, name) {
  const inputGroup = figma.createFrame();
  inputGroup.name = `${label} Input`;
  inputGroup.resize(384, 70);
  inputGroup.fills = [];
  inputGroup.layoutMode = 'VERTICAL';
  inputGroup.itemSpacing = 8;

  // Label
  const labelText = figma.createText();
  labelText.fontName = { family: 'Inter', style: 'Medium' };
  labelText.fontSize = 14;
  labelText.characters = label;
  labelText.fills = [{ type: 'SOLID', color: { r: 0.07, g: 0.11, b: 0.15 } }];
  inputGroup.appendChild(labelText);

  // Input Field
  const inputField = figma.createFrame();
  inputField.name = "Input Field";
  inputField.resize(384, 46);
  inputField.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
  inputField.strokeWeight = 1;
  inputField.strokes = [{ type: 'SOLID', color: { r: 0.82, g: 0.84, b: 0.86 } }];
  inputField.cornerRadius = 6;
  inputField.layoutMode = 'HORIZONTAL';
  inputField.paddingLeft = 12;
  inputField.paddingRight = 12;
  inputField.primaryAxisAlignItems = 'MIN';
  inputField.counterAxisAlignItems = 'CENTER';

  // Placeholder text
  const placeholder = figma.createText();
  placeholder.fontName = { family: 'Inter', style: 'Regular' };
  placeholder.fontSize = 14;
  placeholder.characters = inputType === 'password' ? '••••••••' : `Enter ${label.toLowerCase()}`;
  placeholder.fills = [{ type: 'SOLID', color: { r: 0.61, g: 0.64, b: 0.69 } }];
  inputField.appendChild(placeholder);

  inputGroup.appendChild(inputField);

  return inputGroup;
}

// ==========================================
// HELPER FUNCTIONS FOR CART PAGE
// ==========================================

// Create Cart Page Frame
async function createCartPageFrame() {
  try {
    const cartPage = figma.createFrame();
    cartPage.name = "Cart Page - Desktop";
    cartPage.resize(1440, 1800);
    cartPage.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
    cartPage.layoutMode = 'VERTICAL';

    // Add header
    const header = await createHeader();
    cartPage.appendChild(header);

    // Section Title Area
    const sectionTitle = createSectionTitleComponent("Keranjang", "Home | Keranjang");
    cartPage.appendChild(sectionTitle);

    // Main Content Container
    const mainContent = figma.createFrame();
    mainContent.name = "Main Content";
    mainContent.resize(1440, 1200);
    mainContent.fills = [];
    mainContent.layoutMode = 'HORIZONTAL';
    mainContent.paddingTop = 48;
    mainContent.paddingBottom = 48;
    mainContent.paddingLeft = 80;
    mainContent.paddingRight = 80;
    mainContent.itemSpacing = 48;

    // Left Column - Cart Items (lg:col-span-7)
    const cartItemsSection = figma.createFrame();
    cartItemsSection.name = "Cart Items Section";
    cartItemsSection.resize(760, 1100);
    cartItemsSection.fills = [];
    cartItemsSection.layoutMode = 'VERTICAL';
    cartItemsSection.itemSpacing = 0;

    // Cart Items Header
    const cartHeader = figma.createText();
    cartHeader.fontName = { family: 'Inter', style: 'Bold' };
    cartHeader.fontSize = 20;
    cartHeader.characters = "Items in your shopping cart";
    cartHeader.fills = [{ type: 'SOLID', color: { r: 0.07, g: 0.11, b: 0.15 } }];
    cartItemsSection.appendChild(cartHeader);

    // Divider Top
    const dividerTop = figma.createRectangle();
    dividerTop.name = "Divider Top";
    dividerTop.resize(760, 1);
    dividerTop.fills = [{ type: 'SOLID', color: { r: 0.82, g: 0.84, b: 0.86 } }];
    cartItemsSection.appendChild(dividerTop);

    // Cart Items (3 sample items)
    for (let i = 0; i < 3; i++) {
      const cartItem = createCartItemRow(`Produk Contoh ${i + 1}`, `Rp ${(1299000 * (i + 1)).toLocaleString('id-ID')}`, i + 1);
      cartItemsSection.appendChild(cartItem);
    }

    // Divider Bottom
    const dividerBottom = figma.createRectangle();
    dividerBottom.name = "Divider Bottom";
    dividerBottom.resize(760, 1);
    dividerBottom.fills = [{ type: 'SOLID', color: { r: 0.82, g: 0.84, b: 0.86 } }];
    cartItemsSection.appendChild(dividerBottom);

    mainContent.appendChild(cartItemsSection);

    // Right Column - Order Summary (lg:col-span-5)
    const orderSummary = createCartOrderSummary();
    mainContent.appendChild(orderSummary);

    cartPage.appendChild(mainContent);

    // Add footer
    const footer = await createFooter();
    cartPage.appendChild(footer);

    console.log('Cart Page frame created successfully');
    return cartPage;
  } catch (error) {
    console.error('Error in createCartPageFrame:', error);
    throw new Error('Failed to create Cart Page: ' + error.message);
  }
}

// Create Cart Item Row
function createCartItemRow(productName, price, quantity) {
  const cartItem = figma.createFrame();
  cartItem.name = "Cart Item";
  cartItem.resize(760, 200);
  cartItem.fills = [];
  cartItem.layoutMode = 'HORIZONTAL';
  cartItem.paddingTop = 24;
  cartItem.paddingBottom = 24;
  cartItem.itemSpacing = 24;
  cartItem.strokeBottomWeight = 1;
  cartItem.strokes = [{ type: 'SOLID', color: { r: 0.82, g: 0.84, b: 0.86 } }];

  // Product Image
  const productImage = figma.createFrame();
  productImage.name = "Product Image";
  productImage.resize(150, 150);
  productImage.fills = [{ type: 'SOLID', color: { r: 0.95, g: 0.96, b: 0.96 } }];
  productImage.cornerRadius = 8;
  productImage.layoutMode = 'VERTICAL';
  productImage.primaryAxisAlignItems = 'CENTER';
  productImage.counterAxisAlignItems = 'CENTER';

  const imageLabel = figma.createText();
  imageLabel.fontName = { family: 'Inter', style: 'Medium' };
  imageLabel.fontSize = 12;
  imageLabel.characters = "192x192";
  imageLabel.textAlignHorizontal = 'CENTER';
  imageLabel.fills = [{ type: 'SOLID', color: { r: 0.61, g: 0.64, b: 0.69 } }];
  productImage.appendChild(imageLabel);

  cartItem.appendChild(productImage);

  // Product Details
  const productDetails = figma.createFrame();
  productDetails.name = "Product Details";
  productDetails.resize(400, 150);
  productDetails.fills = [];
  productDetails.layoutMode = 'VERTICAL';
  productDetails.itemSpacing = 8;

  // Product Name (Link Style)
  const productNameText = figma.createText();
  productNameText.fontName = { family: 'Inter', style: 'Medium' };
  productNameText.fontSize = 14;
  productNameText.characters = productName;
  productNameText.fills = [{ type: 'SOLID', color: { r: 0.22, g: 0.26, b: 0.31 } }];
  productDetails.appendChild(productNameText);

  // Price
  const priceText = figma.createText();
  priceText.fontName = { family: 'Inter', style: 'Medium' };
  priceText.fontSize = 14;
  priceText.characters = price;
  priceText.fills = [{ type: 'SOLID', color: { r: 0.07, g: 0.11, b: 0.15 } }];
  productDetails.appendChild(priceText);

  // Quantity Input
  const quantityRow = figma.createFrame();
  quantityRow.name = "Quantity Row";
  quantityRow.resize(120, 36);
  quantityRow.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
  quantityRow.strokeWeight = 1;
  quantityRow.strokes = [{ type: 'SOLID', color: { r: 0.82, g: 0.84, b: 0.86 } }];
  quantityRow.cornerRadius = 6;
  quantityRow.layoutMode = 'HORIZONTAL';
  quantityRow.primaryAxisAlignItems = 'SPACE_BETWEEN';
  quantityRow.counterAxisAlignItems = 'CENTER';
  quantityRow.paddingLeft = 12;
  quantityRow.paddingRight = 12;

  const minusBtn = figma.createText();
  minusBtn.fontName = { family: 'Inter', style: 'Bold' };
  minusBtn.fontSize = 16;
  minusBtn.characters = "−";
  minusBtn.fills = [{ type: 'SOLID', color: { r: 0.61, g: 0.64, b: 0.69 } }];
  quantityRow.appendChild(minusBtn);

  const quantityValue = figma.createText();
  quantityValue.fontName = { family: 'Inter', style: 'Medium' };
  quantityValue.fontSize = 14;
  quantityValue.characters = String(quantity);
  quantityValue.fills = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }];
  quantityRow.appendChild(quantityValue);

  const plusBtn = figma.createText();
  plusBtn.fontName = { family: 'Inter', style: 'Bold' };
  plusBtn.fontSize = 16;
  plusBtn.characters = "+";
  plusBtn.fills = [{ type: 'SOLID', color: { r: 0.61, g: 0.64, b: 0.69 } }];
  quantityRow.appendChild(plusBtn);

  productDetails.appendChild(quantityRow);

  // Stock Status
  const stockStatus = figma.createFrame();
  stockStatus.name = "Stock Status";
  stockStatus.resize(200, 20);
  stockStatus.fills = [];
  stockStatus.layoutMode = 'HORIZONTAL';
  stockStatus.itemSpacing = 8;

  const checkIcon = figma.createText();
  checkIcon.fontName = { family: 'Inter', style: 'Regular' };
  checkIcon.fontSize = 14;
  checkIcon.characters = "✓";
  checkIcon.fills = [{ type: 'SOLID', color: { r: 0.06, g: 0.72, b: 0.51 } }];
  stockStatus.appendChild(checkIcon);

  const stockText = figma.createText();
  stockText.fontName = { family: 'Inter', style: 'Regular' };
  stockText.fontSize = 14;
  stockText.characters = "Stock tersedia";
  stockText.fills = [{ type: 'SOLID', color: { r: 0.22, g: 0.26, b: 0.31 } }];
  stockStatus.appendChild(stockText);

  productDetails.appendChild(stockStatus);

  cartItem.appendChild(productDetails);

  // Remove Button
  const removeBtn = figma.createFrame();
  removeBtn.name = "Remove Button";
  removeBtn.resize(36, 36);
  removeBtn.fills = [{ type: 'SOLID', color: { r: 0.95, g: 0.96, b: 0.96 } }];
  removeBtn.cornerRadius = 18;
  removeBtn.layoutMode = 'VERTICAL';
  removeBtn.primaryAxisAlignItems = 'CENTER';
  removeBtn.counterAxisAlignItems = 'CENTER';

  const removeIcon = figma.createText();
  removeIcon.fontName = { family: 'Inter', style: 'Regular' };
  removeIcon.fontSize = 16;
  removeIcon.characters = "✕";
  removeIcon.fills = [{ type: 'SOLID', color: { r: 0.61, g: 0.64, b: 0.69 } }];
  removeBtn.appendChild(removeIcon);

  cartItem.appendChild(removeBtn);

  return cartItem;
}

// Create Cart Order Summary
function createCartOrderSummary() {
  const summaryCard = figma.createFrame();
  summaryCard.name = "Order Summary";
  summaryCard.resize(420, 500);
  summaryCard.fills = [{ type: 'SOLID', color: { r: 0.97, g: 0.97, b: 0.97 } }];
  summaryCard.cornerRadius = 8;
  summaryCard.layoutMode = 'VERTICAL';
  summaryCard.paddingTop = 24;
  summaryCard.paddingBottom = 24;
  summaryCard.paddingLeft = 24;
  summaryCard.paddingRight = 24;
  summaryCard.itemSpacing = 16;

  // Summary Title
  const summaryTitle = figma.createText();
  summaryTitle.fontName = { family: 'Inter', style: 'Medium' };
  summaryTitle.fontSize = 18;
  summaryTitle.characters = "Ringkasan pesanan";
  summaryTitle.fills = [{ type: 'SOLID', color: { r: 0.07, g: 0.11, b: 0.15 } }];
  summaryCard.appendChild(summaryTitle);

  // Summary Items
  const summaryItems = [
    { label: "Subtotal", value: "Rp 7.794.000" },
    { label: "Estimasi pengiriman", value: "Rp 5" },
    { label: "Estimasi pajak", value: "Rp 1.558.800" }
  ];

  summaryItems.forEach((item, index) => {
    const summaryRow = figma.createFrame();
    summaryRow.name = item.label;
    summaryRow.resize(372, 40);
    summaryRow.fills = [];
    summaryRow.layoutMode = 'HORIZONTAL';
    summaryRow.primaryAxisSizingMode = 'FIXED';
    summaryRow.primaryAxisAlignItems = 'SPACE_BETWEEN';
    summaryRow.counterAxisAlignItems = 'CENTER';

    if (index > 0) {
      summaryRow.strokeTopWeight = 1;
      summaryRow.strokes = [{ type: 'SOLID', color: { r: 0.82, g: 0.84, b: 0.86 } }];
      summaryRow.paddingTop = 16;
    }

    const label = figma.createText();
    label.fontName = { family: 'Inter', style: 'Regular' };
    label.fontSize = 14;
    label.characters = item.label;
    label.fills = [{ type: 'SOLID', color: { r: 0.42, g: 0.45, b: 0.50 } }];
    summaryRow.appendChild(label);

    const value = figma.createText();
    value.fontName = { family: 'Inter', style: 'Medium' };
    value.fontSize = 14;
    value.characters = item.value;
    value.fills = [{ type: 'SOLID', color: { r: 0.07, g: 0.11, b: 0.15 } }];
    summaryRow.appendChild(value);

    summaryCard.appendChild(summaryRow);
  });

  // Total Row
  const totalRow = figma.createFrame();
  totalRow.name = "Total Row";
  totalRow.resize(372, 50);
  totalRow.fills = [];
  totalRow.layoutMode = 'HORIZONTAL';
  totalRow.primaryAxisSizingMode = 'FIXED';
  totalRow.primaryAxisAlignItems = 'SPACE_BETWEEN';
  totalRow.counterAxisAlignItems = 'CENTER';
  totalRow.strokeTopWeight = 1;
  totalRow.strokes = [{ type: 'SOLID', color: { r: 0.82, g: 0.84, b: 0.86 } }];
  totalRow.paddingTop = 16;

  const totalLabel = figma.createText();
  totalLabel.fontName = { family: 'Inter', style: 'Medium' };
  totalLabel.fontSize = 16;
  totalLabel.characters = "Total pesanan";
  totalLabel.fills = [{ type: 'SOLID', color: { r: 0.07, g: 0.11, b: 0.15 } }];
  totalRow.appendChild(totalLabel);

  const totalValue = figma.createText();
  totalValue.fontName = { family: 'Inter', style: 'Medium' };
  totalValue.fontSize = 16;
  totalValue.characters = "Rp 9.352.805";
  totalValue.fills = [{ type: 'SOLID', color: { r: 0.07, g: 0.11, b: 0.15 } }];
  totalRow.appendChild(totalValue);

  summaryCard.appendChild(totalRow);

  // Checkout Button
  const checkoutBtn = figma.createFrame();
  checkoutBtn.name = "Checkout Button";
  checkoutBtn.resize(372, 46);
  checkoutBtn.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
  checkoutBtn.strokeWeight = 1;
  checkoutBtn.strokes = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }];
  checkoutBtn.cornerRadius = 0;
  checkoutBtn.layoutMode = 'HORIZONTAL';
  checkoutBtn.primaryAxisAlignItems = 'CENTER';
  checkoutBtn.counterAxisAlignItems = 'CENTER';
  checkoutBtn.effects = [{
    type: 'DROP_SHADOW',
    color: { r: 0, g: 0, b: 0, a: 0.05 },
    offset: { x: 0, y: 2 },
    radius: 4,
    visible: true,
    blendMode: 'NORMAL'
  }];

  const checkoutText = figma.createText();
  checkoutText.fontName = { family: 'Inter', style: 'Bold' };
  checkoutText.fontSize = 14;
  checkoutText.characters = "CHECKOUT";
  checkoutText.fills = [{ type: 'SOLID', color: { r: 0.94, g: 0.27, b: 0.27 } }];
  checkoutBtn.appendChild(checkoutText);

  summaryCard.appendChild(checkoutBtn);

  return summaryCard;
}

// ==========================================
// HELPER FUNCTIONS FOR CHECKOUT PAGE
// ==========================================

// Create Checkout Page Frame
async function createCheckoutPageFrame() {
  try {
    const checkoutPage = figma.createFrame();
    checkoutPage.name = "Checkout Page - Desktop";
    checkoutPage.resize(1440, 2400);
    checkoutPage.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
    checkoutPage.layoutMode = 'VERTICAL';

    // Add header
    const header = await createHeader();
    checkoutPage.appendChild(header);

    // Section Title Area
    const sectionTitle = createSectionTitleComponent("Checkout", "Home | Cart | Checkout");
    checkoutPage.appendChild(sectionTitle);

    // Main Content Container (Two columns)
    const mainContent = figma.createFrame();
    mainContent.name = "Main Content";
    mainContent.resize(1440, 1800);
    mainContent.fills = [];
    mainContent.layoutMode = 'HORIZONTAL';
    mainContent.paddingTop = 48;
    mainContent.paddingBottom = 48;
    mainContent.paddingLeft = 80;
    mainContent.paddingRight = 80;
    mainContent.itemSpacing = 64;

    // Left Column - Form Section
    const formSection = createCheckoutFormSection();
    mainContent.appendChild(formSection);

    // Right Column - Order Summary
    const orderSummary = createCheckoutOrderSummary();
    mainContent.appendChild(orderSummary);

    checkoutPage.appendChild(mainContent);

    // Add footer
    const footer = await createFooter();
    checkoutPage.appendChild(footer);

    console.log('Checkout Page frame created successfully');
    return checkoutPage;
  } catch (error) {
    console.error('Error in createCheckoutPageFrame:', error);
    throw new Error('Failed to create Checkout Page: ' + error.message);
  }
}

// Create Checkout Form Section (Left Column)
function createCheckoutFormSection() {
  const formSection = figma.createFrame();
  formSection.name = "Form Section";
  formSection.resize(700, 1700);
  formSection.fills = [];
  formSection.layoutMode = 'VERTICAL';
  formSection.itemSpacing = 32;

  // Contact Information Section
  const contactSection = figma.createFrame();
  contactSection.name = "Contact Information";
  contactSection.resize(700, 400);
  contactSection.fills = [];
  contactSection.layoutMode = 'VERTICAL';
  contactSection.itemSpacing = 16;

  const contactTitle = figma.createText();
  contactTitle.fontName = { family: 'Inter', style: 'Medium' };
  contactTitle.fontSize = 18;
  contactTitle.characters = "Contact information";
  contactTitle.fills = [{ type: 'SOLID', color: { r: 0.07, g: 0.11, b: 0.15 } }];
  contactSection.appendChild(contactTitle);

  // Name inputs row
  const nameRow = figma.createFrame();
  nameRow.name = "Name Row";
  nameRow.resize(700, 70);
  nameRow.fills = [];
  nameRow.layoutMode = 'HORIZONTAL';
  nameRow.itemSpacing = 16;

  const firstNameInput = createCheckoutFormInput("Nama Depan *", "John", 342);
  nameRow.appendChild(firstNameInput);

  const lastNameInput = createCheckoutFormInput("Nama Belakang *", "Doe", 342);
  nameRow.appendChild(lastNameInput);

  contactSection.appendChild(nameRow);

  // Phone input
  const phoneInput = createCheckoutFormInput("Phone number *", "+62 812 3456 7890", 700);
  contactSection.appendChild(phoneInput);

  // Email input
  const emailInput = createCheckoutFormInput("Alamat email *", "john.doe@example.com", 700);
  contactSection.appendChild(emailInput);

  formSection.appendChild(contactSection);

  // Payment Methods Section
  const paymentSection = createPaymentMethodsSection();
  formSection.appendChild(paymentSection);

  // Shipping Address Section
  const shippingSection = figma.createFrame();
  shippingSection.name = "Shipping Address";
  shippingSection.resize(700, 500);
  shippingSection.fills = [];
  shippingSection.layoutMode = 'VERTICAL';
  shippingSection.itemSpacing = 16;

  const shippingTitle = figma.createText();
  shippingTitle.fontName = { family: 'Inter', style: 'Medium' };
  shippingTitle.fontSize = 18;
  shippingTitle.characters = "Alamat pengiriman";
  shippingTitle.fills = [{ type: 'SOLID', color: { r: 0.07, g: 0.11, b: 0.15 } }];
  shippingSection.appendChild(shippingTitle);

  // Address input
  const addressInput = createCheckoutFormInput("Address *", "Jl. Raya Darmo No. 123", 700);
  shippingSection.appendChild(addressInput);

  // City, Country, Postal Code row
  const locationRow = figma.createFrame();
  locationRow.name = "Location Row";
  locationRow.resize(700, 70);
  locationRow.fills = [];
  locationRow.layoutMode = 'HORIZONTAL';
  locationRow.itemSpacing = 16;

  const cityInput = createCheckoutFormInput("City *", "Surabaya", 224);
  locationRow.appendChild(cityInput);

  const countryInput = createCheckoutFormInput("Country *", "Indonesia", 224);
  locationRow.appendChild(countryInput);

  const postalInput = createCheckoutFormInput("Postal code *", "60241", 224);
  locationRow.appendChild(postalInput);

  shippingSection.appendChild(locationRow);

  // Order Notice textarea
  const noticeSection = figma.createFrame();
  noticeSection.name = "Order Notice";
  noticeSection.resize(700, 120);
  noticeSection.fills = [];
  noticeSection.layoutMode = 'VERTICAL';
  noticeSection.itemSpacing = 8;

  const noticeLabel = figma.createText();
  noticeLabel.fontName = { family: 'Inter', style: 'Medium' };
  noticeLabel.fontSize = 14;
  noticeLabel.characters = "Order notice";
  noticeLabel.fills = [{ type: 'SOLID', color: { r: 0.22, g: 0.26, b: 0.31 } }];
  noticeSection.appendChild(noticeLabel);

  const noticeInput = figma.createFrame();
  noticeInput.name = "Textarea";
  noticeInput.resize(700, 80);
  noticeInput.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
  noticeInput.strokeWeight = 1;
  noticeInput.strokes = [{ type: 'SOLID', color: { r: 0.82, g: 0.84, b: 0.86 } }];
  noticeInput.cornerRadius = 6;
  noticeInput.paddingTop = 12;
  noticeInput.paddingLeft = 12;

  const noticePlaceholder = figma.createText();
  noticePlaceholder.fontName = { family: 'Inter', style: 'Regular' };
  noticePlaceholder.fontSize = 14;
  noticePlaceholder.characters = "Catatan khusus untuk pesanan Anda...";
  noticePlaceholder.fills = [{ type: 'SOLID', color: { r: 0.61, g: 0.64, b: 0.69 } }];
  noticeInput.appendChild(noticePlaceholder);

  noticeSection.appendChild(noticeInput);
  shippingSection.appendChild(noticeSection);

  formSection.appendChild(shippingSection);

  // Place Order Button
  const placeOrderBtn = figma.createFrame();
  placeOrderBtn.name = "Place Order Button";
  placeOrderBtn.resize(700, 50);
  placeOrderBtn.fills = [{ type: 'SOLID', color: { r: 0.94, g: 0.27, b: 0.27 } }];
  placeOrderBtn.cornerRadius = 6;
  placeOrderBtn.layoutMode = 'HORIZONTAL';
  placeOrderBtn.primaryAxisAlignItems = 'CENTER';
  placeOrderBtn.counterAxisAlignItems = 'CENTER';
  placeOrderBtn.effects = [{
    type: 'DROP_SHADOW',
    color: { r: 0, g: 0, b: 0, a: 0.1 },
    offset: { x: 0, y: 2 },
    radius: 4,
    visible: true,
    blendMode: 'NORMAL'
  }];

  const placeOrderText = figma.createText();
  placeOrderText.fontName = { family: 'Inter', style: 'Bold' };
  placeOrderText.fontSize = 16;
  placeOrderText.characters = "Place Order";
  placeOrderText.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
  placeOrderBtn.appendChild(placeOrderText);

  formSection.appendChild(placeOrderBtn);

  return formSection;
}

// Create Payment Methods Section
function createPaymentMethodsSection() {
  const paymentSection = figma.createFrame();
  paymentSection.name = "Payment Methods";
  paymentSection.resize(700, 250);
  paymentSection.fills = [];
  paymentSection.layoutMode = 'VERTICAL';
  paymentSection.itemSpacing = 16;

  const paymentTitle = figma.createText();
  paymentTitle.fontName = { family: 'Inter', style: 'Medium' };
  paymentTitle.fontSize = 18;
  paymentTitle.characters = "Metode pembayaran";
  paymentTitle.fills = [{ type: 'SOLID', color: { r: 0.07, g: 0.11, b: 0.15 } }];
  paymentSection.appendChild(paymentTitle);

  // Payment options
  const paymentOptions = [
    { name: "Bank Transfer", description: "Transfer melalui Bank BCA, Mandiri, BNI", selected: true },
    { name: "E-Wallet", description: "GoPay, OVO, Dana, ShopeePay", selected: false },
    { name: "Cash on Delivery", description: "Bayar saat barang diterima", selected: false }
  ];

  paymentOptions.forEach(option => {
    const optionRow = figma.createFrame();
    optionRow.name = option.name;
    optionRow.resize(700, 56);
    optionRow.fills = [{ type: 'SOLID', color: option.selected ? { r: 0.95, g: 0.97, b: 1 } : { r: 1, g: 1, b: 1 } }];
    optionRow.strokeWeight = option.selected ? 2 : 1;
    optionRow.strokes = [{ type: 'SOLID', color: option.selected ? { r: 0.23, g: 0.51, b: 0.96 } : { r: 0.82, g: 0.84, b: 0.86 } }];
    optionRow.cornerRadius = 8;
    optionRow.layoutMode = 'HORIZONTAL';
    optionRow.paddingLeft = 16;
    optionRow.paddingRight = 16;
    optionRow.counterAxisAlignItems = 'CENTER';
    optionRow.itemSpacing = 12;

    // Radio button
    const radio = figma.createFrame();
    radio.name = "Radio";
    radio.resize(20, 20);
    radio.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
    radio.strokeWeight = 2;
    radio.strokes = [{ type: 'SOLID', color: option.selected ? { r: 0.23, g: 0.51, b: 0.96 } : { r: 0.82, g: 0.84, b: 0.86 } }];
    radio.cornerRadius = 10;

    if (option.selected) {
      radio.layoutMode = 'VERTICAL';
      radio.primaryAxisAlignItems = 'CENTER';
      radio.counterAxisAlignItems = 'CENTER';

      const radioInner = figma.createEllipse();
      radioInner.name = "Inner Circle";
      radioInner.resize(10, 10);
      radioInner.fills = [{ type: 'SOLID', color: { r: 0.23, g: 0.51, b: 0.96 } }];
      radio.appendChild(radioInner);
    }

    optionRow.appendChild(radio);

    // Text content
    const textContent = figma.createFrame();
    textContent.name = "Text Content";
    textContent.resize(640, 40);
    textContent.fills = [];
    textContent.layoutMode = 'VERTICAL';
    textContent.itemSpacing = 4;

    const optionName = figma.createText();
    optionName.fontName = { family: 'Inter', style: 'Medium' };
    optionName.fontSize = 14;
    optionName.characters = option.name;
    optionName.fills = [{ type: 'SOLID', color: { r: 0.07, g: 0.11, b: 0.15 } }];
    textContent.appendChild(optionName);

    const optionDesc = figma.createText();
    optionDesc.fontName = { family: 'Inter', style: 'Regular' };
    optionDesc.fontSize = 12;
    optionDesc.characters = option.description;
    optionDesc.fills = [{ type: 'SOLID', color: { r: 0.61, g: 0.64, b: 0.69 } }];
    textContent.appendChild(optionDesc);

    optionRow.appendChild(textContent);
    paymentSection.appendChild(optionRow);
  });

  return paymentSection;
}

// Create Checkout Form Input
function createCheckoutFormInput(label, placeholder, width) {
  const inputGroup = figma.createFrame();
  inputGroup.name = `${label} Input`;
  inputGroup.resize(width, 70);
  inputGroup.fills = [];
  inputGroup.layoutMode = 'VERTICAL';
  inputGroup.itemSpacing = 8;

  const labelText = figma.createText();
  labelText.fontName = { family: 'Inter', style: 'Medium' };
  labelText.fontSize = 14;
  labelText.characters = label;
  labelText.fills = [{ type: 'SOLID', color: { r: 0.22, g: 0.26, b: 0.31 } }];
  inputGroup.appendChild(labelText);

  const inputField = figma.createFrame();
  inputField.name = "Input Field";
  inputField.resize(width, 46);
  inputField.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
  inputField.strokeWeight = 1;
  inputField.strokes = [{ type: 'SOLID', color: { r: 0.82, g: 0.84, b: 0.86 } }];
  inputField.cornerRadius = 6;
  inputField.layoutMode = 'HORIZONTAL';
  inputField.paddingLeft = 12;
  inputField.paddingRight = 12;
  inputField.primaryAxisAlignItems = 'MIN';
  inputField.counterAxisAlignItems = 'CENTER';

  const placeholderText = figma.createText();
  placeholderText.fontName = { family: 'Inter', style: 'Regular' };
  placeholderText.fontSize = 14;
  placeholderText.characters = placeholder;
  placeholderText.fills = [{ type: 'SOLID', color: { r: 0.61, g: 0.64, b: 0.69 } }];
  inputField.appendChild(placeholderText);

  inputGroup.appendChild(inputField);

  return inputGroup;
}

// Create Checkout Order Summary (Right Column)
function createCheckoutOrderSummary() {
  const summarySection = figma.createFrame();
  summarySection.name = "Order Summary";
  summarySection.resize(480, 800);
  summarySection.fills = [{ type: 'SOLID', color: { r: 0.97, g: 0.97, b: 0.97 } }];
  summarySection.cornerRadius = 8;
  summarySection.layoutMode = 'VERTICAL';
  summarySection.paddingTop = 24;
  summarySection.paddingBottom = 24;
  summarySection.paddingLeft = 24;
  summarySection.paddingRight = 24;
  summarySection.itemSpacing = 16;

  // Summary Title
  const summaryTitle = figma.createText();
  summaryTitle.fontName = { family: 'Inter', style: 'Medium' };
  summaryTitle.fontSize = 18;
  summaryTitle.characters = "Ringkasan pesanan";
  summaryTitle.fills = [{ type: 'SOLID', color: { r: 0.07, g: 0.11, b: 0.15 } }];
  summarySection.appendChild(summaryTitle);

  // Product List
  const productList = figma.createFrame();
  productList.name = "Product List";
  productList.resize(432, 350);
  productList.fills = [];
  productList.layoutMode = 'VERTICAL';
  productList.itemSpacing = 0;

  // Sample products
  const products = [
    { name: "Smart TV LED 55 inch", quantity: 1, price: "Rp 5.999.000" },
    { name: "Wireless Speaker", quantity: 2, price: "Rp 1.299.000" },
    { name: "Smart Watch Pro", quantity: 1, price: "Rp 2.499.000" }
  ];

  products.forEach(product => {
    const productItem = figma.createFrame();
    productItem.name = product.name;
    productItem.resize(432, 100);
    productItem.fills = [];
    productItem.layoutMode = 'HORIZONTAL';
    productItem.paddingTop = 16;
    productItem.paddingBottom = 16;
    productItem.itemSpacing = 16;
    productItem.strokeBottomWeight = 1;
    productItem.strokes = [{ type: 'SOLID', color: { r: 0.82, g: 0.84, b: 0.86 } }];

    // Product Image
    const productImage = figma.createFrame();
    productImage.name = "Image";
    productImage.resize(60, 60);
    productImage.fills = [{ type: 'SOLID', color: { r: 0.90, g: 0.91, b: 0.92 } }];
    productImage.cornerRadius = 8;
    productItem.appendChild(productImage);

    // Product Info
    const productInfo = figma.createFrame();
    productInfo.name = "Info";
    productInfo.resize(280, 60);
    productInfo.fills = [];
    productInfo.layoutMode = 'VERTICAL';
    productInfo.itemSpacing = 4;

    const productName = figma.createText();
    productName.fontName = { family: 'Inter', style: 'Medium' };
    productName.fontSize = 14;
    productName.characters = product.name;
    productName.fills = [{ type: 'SOLID', color: { r: 0.07, g: 0.11, b: 0.15 } }];
    productInfo.appendChild(productName);

    const productQty = figma.createText();
    productQty.fontName = { family: 'Inter', style: 'Regular' };
    productQty.fontSize = 12;
    productQty.characters = `x${product.quantity}`;
    productQty.fills = [{ type: 'SOLID', color: { r: 0.61, g: 0.64, b: 0.69 } }];
    productInfo.appendChild(productQty);

    productItem.appendChild(productInfo);

    // Price
    const priceText = figma.createText();
    priceText.fontName = { family: 'Inter', style: 'Medium' };
    priceText.fontSize = 14;
    priceText.characters = product.price;
    priceText.fills = [{ type: 'SOLID', color: { r: 0.07, g: 0.11, b: 0.15 } }];
    productItem.appendChild(priceText);

    productList.appendChild(productItem);
  });

  summarySection.appendChild(productList);

  // Price Breakdown
  const priceBreakdown = figma.createFrame();
  priceBreakdown.name = "Price Breakdown";
  priceBreakdown.resize(432, 180);
  priceBreakdown.fills = [];
  priceBreakdown.layoutMode = 'VERTICAL';
  priceBreakdown.itemSpacing = 12;
  priceBreakdown.strokeTopWeight = 1;
  priceBreakdown.strokes = [{ type: 'SOLID', color: { r: 0.82, g: 0.84, b: 0.86 } }];
  priceBreakdown.paddingTop = 16;

  const breakdownItems = [
    { label: "Subtotal", value: "Rp 11.096.000" },
    { label: "Pengiriman", value: "Rp 5" },
    { label: "Taxes", value: "Rp 2.219.200" }
  ];

  breakdownItems.forEach(item => {
    const row = figma.createFrame();
    row.name = item.label;
    row.resize(432, 24);
    row.fills = [];
    row.layoutMode = 'HORIZONTAL';
    row.primaryAxisSizingMode = 'FIXED';
    row.primaryAxisAlignItems = 'SPACE_BETWEEN';

    const label = figma.createText();
    label.fontName = { family: 'Inter', style: 'Regular' };
    label.fontSize = 14;
    label.characters = item.label;
    label.fills = [{ type: 'SOLID', color: { r: 0.42, g: 0.45, b: 0.50 } }];
    row.appendChild(label);

    const value = figma.createText();
    value.fontName = { family: 'Inter', style: 'Regular' };
    value.fontSize = 14;
    value.characters = item.value;
    value.fills = [{ type: 'SOLID', color: { r: 0.07, g: 0.11, b: 0.15 } }];
    row.appendChild(value);

    priceBreakdown.appendChild(row);
  });

  // Total
  const totalRow = figma.createFrame();
  totalRow.name = "Total";
  totalRow.resize(432, 40);
  totalRow.fills = [];
  totalRow.layoutMode = 'HORIZONTAL';
  totalRow.primaryAxisSizingMode = 'FIXED';
  totalRow.primaryAxisAlignItems = 'SPACE_BETWEEN';
  totalRow.strokeTopWeight = 1;
  totalRow.strokes = [{ type: 'SOLID', color: { r: 0.82, g: 0.84, b: 0.86 } }];
  totalRow.paddingTop = 16;

  const totalLabel = figma.createText();
  totalLabel.fontName = { family: 'Inter', style: 'Medium' };
  totalLabel.fontSize = 16;
  totalLabel.characters = "Total";
  totalLabel.fills = [{ type: 'SOLID', color: { r: 0.07, g: 0.11, b: 0.15 } }];
  totalRow.appendChild(totalLabel);

  const totalValue = figma.createText();
  totalValue.fontName = { family: 'Inter', style: 'Medium' };
  totalValue.fontSize = 16;
  totalValue.characters = "Rp 13.315.205";
  totalValue.fills = [{ type: 'SOLID', color: { r: 0.07, g: 0.11, b: 0.15 } }];
  totalRow.appendChild(totalValue);

  priceBreakdown.appendChild(totalRow);
  summarySection.appendChild(priceBreakdown);

  return summarySection;
}

// ==========================================
// HELPER FUNCTIONS FOR ADMIN DASHBOARD
// ==========================================

// Create Admin Dashboard Frame
async function createAdminDashboardFrame() {
  try {
    const adminDashboard = figma.createFrame();
    adminDashboard.name = "Admin Dashboard - Desktop";
    adminDashboard.resize(1440, 1200);
    adminDashboard.fills = [{ type: 'SOLID', color: { r: 0.97, g: 0.97, b: 0.98 } }];
    adminDashboard.layoutMode = 'HORIZONTAL';

    // Sidebar
    const sidebar = createAdminSidebar();
    adminDashboard.appendChild(sidebar);

    // Main Area (Top Bar + Content)
    const mainArea = figma.createFrame();
    mainArea.name = "Main Area";
    mainArea.resize(1176, 1200);
    mainArea.fills = [{ type: 'SOLID', color: { r: 0.97, g: 0.97, b: 0.98 } }];
    mainArea.layoutMode = 'VERTICAL';

    // Top Bar
    const topBar = createAdminTopBar();
    mainArea.appendChild(topBar);

    // Content Area
    const contentArea = figma.createFrame();
    contentArea.name = "Content Area";
    contentArea.resize(1176, 1136);
    contentArea.fills = [];
    contentArea.layoutMode = 'VERTICAL';
    contentArea.paddingTop = 24;
    contentArea.paddingBottom = 24;
    contentArea.paddingLeft = 24;
    contentArea.paddingRight = 24;
    contentArea.itemSpacing = 24;

    // Page Header
    const pageHeader = figma.createFrame();
    pageHeader.name = "Page Header";
    pageHeader.resize(1128, 60);
    pageHeader.fills = [];
    pageHeader.layoutMode = 'VERTICAL';
    pageHeader.itemSpacing = 4;

    const pageTitle = figma.createText();
    pageTitle.fontName = { family: 'Inter', style: 'Bold' };
    pageTitle.fontSize = 24;
    pageTitle.characters = "Dashboard";
    pageTitle.fills = [{ type: 'SOLID', color: { r: 0.07, g: 0.11, b: 0.15 } }];
    pageHeader.appendChild(pageTitle);

    const pageSubtitle = figma.createText();
    pageSubtitle.fontName = { family: 'Inter', style: 'Regular' };
    pageSubtitle.fontSize = 14;
    pageSubtitle.characters = "Welcome back! Here's what's happening today.";
    pageSubtitle.fills = [{ type: 'SOLID', color: { r: 0.42, g: 0.45, b: 0.50 } }];
    pageHeader.appendChild(pageSubtitle);

    contentArea.appendChild(pageHeader);

    // Stats Cards
    const statsCards = createDashboardStatsCards();
    contentArea.appendChild(statsCards);

    // Order History Chart
    const orderChart = createDashboardChart("Order History (Last 30 Days)", false);
    contentArea.appendChild(orderChart);

    // Member Growth Chart
    const memberChart = createDashboardChart("Member Growth", true);
    contentArea.appendChild(memberChart);

    // Most Sold Products
    const topProducts = createMostSoldProducts();
    contentArea.appendChild(topProducts);

    mainArea.appendChild(contentArea);
    adminDashboard.appendChild(mainArea);

    console.log('Admin Dashboard frame created successfully');
    return adminDashboard;
  } catch (error) {
    console.error('Error in createAdminDashboardFrame:', error);
    throw new Error('Failed to create Admin Dashboard: ' + error.message);
  }
}

// Create Admin Sidebar
function createAdminSidebar() {
  const sidebar = figma.createFrame();
  sidebar.name = "Sidebar";
  sidebar.resize(264, 1200);
  sidebar.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
  sidebar.strokeWeight = 1;
  sidebar.strokes = [{ type: 'SOLID', color: { r: 0.90, g: 0.91, b: 0.92 } }];
  sidebar.layoutMode = 'VERTICAL';

  // Sidebar Header
  const sidebarHeader = figma.createFrame();
  sidebarHeader.name = "Sidebar Header";
  sidebarHeader.resize(264, 64);
  sidebarHeader.fills = [];
  sidebarHeader.layoutMode = 'HORIZONTAL';
  sidebarHeader.paddingLeft = 16;
  sidebarHeader.counterAxisAlignItems = 'CENTER';
  sidebarHeader.strokeBottomWeight = 1;
  sidebarHeader.strokes = [{ type: 'SOLID', color: { r: 0.90, g: 0.91, b: 0.92 } }];

  const menuLabel = figma.createText();
  menuLabel.fontName = { family: 'Inter', style: 'Bold' };
  menuLabel.fontSize = 11;
  menuLabel.characters = "MAIN MENU";
  menuLabel.fills = [{ type: 'SOLID', color: { r: 0.61, g: 0.64, b: 0.69 } }];
  menuLabel.letterSpacing = { value: 1, unit: 'PIXELS' };
  sidebarHeader.appendChild(menuLabel);

  sidebar.appendChild(sidebarHeader);

  // Navigation Items
  const navItems = [
    { label: "Dashboard", icon: "□", active: true },
    { label: "Orders", icon: "📦", active: false },
    { label: "Products", icon: "📋", active: false },
    { label: "Categories", icon: "📁", active: false },
    { label: "Users", icon: "👤", active: false }
  ];

  const navContainer = figma.createFrame();
  navContainer.name = "Navigation";
  navContainer.resize(264, 300);
  navContainer.fills = [];
  navContainer.layoutMode = 'VERTICAL';
  navContainer.paddingTop = 16;
  navContainer.itemSpacing = 4;

  navItems.forEach(item => {
    const navItem = figma.createFrame();
    navItem.name = item.label;
    navItem.resize(248, 44);
    navItem.fills = item.active
      ? [{ type: 'SOLID', color: { r: 0.94, g: 0.27, b: 0.27 } }]
      : [];
    navItem.cornerRadius = 8;
    navItem.layoutMode = 'HORIZONTAL';
    navItem.paddingLeft = 16;
    navItem.paddingRight = 16;
    navItem.counterAxisAlignItems = 'CENTER';
    navItem.itemSpacing = 12;

    const navIcon = figma.createText();
    navIcon.fontName = { family: 'Inter', style: 'Regular' };
    navIcon.fontSize = 16;
    navIcon.characters = item.icon;
    navIcon.fills = [{ type: 'SOLID', color: item.active ? { r: 1, g: 1, b: 1 } : { r: 0.42, g: 0.45, b: 0.50 } }];
    navItem.appendChild(navIcon);

    const navLabel = figma.createText();
    navLabel.fontName = { family: 'Inter', style: 'Medium' };
    navLabel.fontSize = 14;
    navLabel.characters = item.label;
    navLabel.fills = [{ type: 'SOLID', color: item.active ? { r: 1, g: 1, b: 1 } : { r: 0.22, g: 0.26, b: 0.31 } }];
    navItem.appendChild(navLabel);

    navContainer.appendChild(navItem);
  });

  sidebar.appendChild(navContainer);

  // Sidebar Footer
  const sidebarFooter = figma.createFrame();
  sidebarFooter.name = "Sidebar Footer";
  sidebarFooter.resize(264, 50);
  sidebarFooter.fills = [{ type: 'SOLID', color: { r: 0.97, g: 0.97, b: 0.98 } }];
  sidebarFooter.layoutMode = 'VERTICAL';
  sidebarFooter.primaryAxisAlignItems = 'CENTER';
  sidebarFooter.counterAxisAlignItems = 'CENTER';
  sidebarFooter.strokeTopWeight = 1;
  sidebarFooter.strokes = [{ type: 'SOLID', color: { r: 0.90, g: 0.91, b: 0.92 } }];

  const versionText = figma.createText();
  versionText.fontName = { family: 'Inter', style: 'Regular' };
  versionText.fontSize = 11;
  versionText.characters = "v1.0.0 © 2025 Nasional Elektronik";
  versionText.fills = [{ type: 'SOLID', color: { r: 0.61, g: 0.64, b: 0.69 } }];
  sidebarFooter.appendChild(versionText);

  sidebar.appendChild(sidebarFooter);

  return sidebar;
}

// Create Admin Top Bar
function createAdminTopBar() {
  const topBar = figma.createFrame();
  topBar.name = "Top Bar";
  topBar.resize(1176, 64);
  topBar.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
  topBar.strokeBottomWeight = 1;
  topBar.strokes = [{ type: 'SOLID', color: { r: 0.90, g: 0.91, b: 0.92 } }];
  topBar.layoutMode = 'HORIZONTAL';
  topBar.primaryAxisAlignItems = 'SPACE_BETWEEN';
  topBar.counterAxisAlignItems = 'CENTER';
  topBar.paddingLeft = 24;
  topBar.paddingRight = 24;

  // Left - Logo
  const logo = figma.createText();
  logo.fontName = { family: 'Inter', style: 'Bold' };
  logo.fontSize = 18;
  logo.characters = "Nasional Elektronik";
  logo.fills = [{ type: 'SOLID', color: { r: 0.94, g: 0.27, b: 0.27 } }];
  topBar.appendChild(logo);

  // Right - Search + User
  const rightSection = figma.createFrame();
  rightSection.name = "Right Section";
  rightSection.resize(300, 40);
  rightSection.fills = [];
  rightSection.layoutMode = 'HORIZONTAL';
  rightSection.itemSpacing = 16;
  rightSection.counterAxisAlignItems = 'CENTER';

  // Search Bar
  const searchBar = figma.createFrame();
  searchBar.name = "Search Bar";
  searchBar.resize(200, 40);
  searchBar.fills = [{ type: 'SOLID', color: { r: 0.97, g: 0.97, b: 0.98 } }];
  searchBar.cornerRadius = 8;
  searchBar.layoutMode = 'HORIZONTAL';
  searchBar.paddingLeft = 12;
  searchBar.counterAxisAlignItems = 'CENTER';

  const searchText = figma.createText();
  searchText.fontName = { family: 'Inter', style: 'Regular' };
  searchText.fontSize = 14;
  searchText.characters = "Search...";
  searchText.fills = [{ type: 'SOLID', color: { r: 0.61, g: 0.64, b: 0.69 } }];
  searchBar.appendChild(searchText);

  rightSection.appendChild(searchBar);

  // User Avatar
  const userAvatar = figma.createFrame();
  userAvatar.name = "User Avatar";
  userAvatar.resize(40, 40);
  userAvatar.fills = [{ type: 'SOLID', color: { r: 0.94, g: 0.27, b: 0.27 } }];
  userAvatar.cornerRadius = 20;
  userAvatar.layoutMode = 'VERTICAL';
  userAvatar.primaryAxisAlignItems = 'CENTER';
  userAvatar.counterAxisAlignItems = 'CENTER';

  const avatarText = figma.createText();
  avatarText.fontName = { family: 'Inter', style: 'Bold' };
  avatarText.fontSize = 14;
  avatarText.characters = "A";
  avatarText.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
  userAvatar.appendChild(avatarText);

  rightSection.appendChild(userAvatar);
  topBar.appendChild(rightSection);

  return topBar;
}

// Create Dashboard Stats Cards
function createDashboardStatsCards() {
  const statsRow = figma.createFrame();
  statsRow.name = "Stats Cards";
  statsRow.resize(1128, 120);
  statsRow.fills = [];
  statsRow.layoutMode = 'HORIZONTAL';
  statsRow.itemSpacing = 24;

  const stats = [
    { label: "Total Orders", value: "1,234" },
    { label: "Total Revenue", value: "Rp 125.680.000" },
    { label: "Total Members", value: "856" }
  ];

  stats.forEach(stat => {
    const card = figma.createFrame();
    card.name = stat.label;
    card.resize(360, 120);
    card.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
    card.cornerRadius = 12;
    card.strokeWeight = 1;
    card.strokes = [{ type: 'SOLID', color: { r: 0.90, g: 0.91, b: 0.92 } }];
    card.layoutMode = 'VERTICAL';
    card.paddingTop = 24;
    card.paddingBottom = 24;
    card.paddingLeft = 24;
    card.paddingRight = 24;
    card.itemSpacing = 8;
    card.effects = [{
      type: 'DROP_SHADOW',
      color: { r: 0, g: 0, b: 0, a: 0.05 },
      offset: { x: 0, y: 2 },
      radius: 8,
      visible: true,
      blendMode: 'NORMAL'
    }];

    const cardLabel = figma.createText();
    cardLabel.fontName = { family: 'Inter', style: 'Medium' };
    cardLabel.fontSize = 14;
    cardLabel.characters = stat.label;
    cardLabel.fills = [{ type: 'SOLID', color: { r: 0.42, g: 0.45, b: 0.50 } }];
    card.appendChild(cardLabel);

    const cardValue = figma.createText();
    cardValue.fontName = { family: 'Inter', style: 'Bold' };
    cardValue.fontSize = 28;
    cardValue.characters = stat.value;
    cardValue.fills = [{ type: 'SOLID', color: { r: 0.07, g: 0.11, b: 0.15 } }];
    card.appendChild(cardValue);

    statsRow.appendChild(card);
  });

  return statsRow;
}

// Create Dashboard Chart
function createDashboardChart(title, isGradient) {
  const chartCard = figma.createFrame();
  chartCard.name = title;
  chartCard.resize(1128, 280);

  if (isGradient) {
    // Gradient background (red color scheme)
    chartCard.fills = [{
      type: 'GRADIENT_LINEAR',
      gradientTransform: [[1, 0, 0], [0, 1, 0]],
      gradientStops: [
        { color: { r: 0.94, g: 0.27, b: 0.27, a: 1 }, position: 0 },
        { color: { r: 0.8, g: 0.2, b: 0.2, a: 1 }, position: 1 }
      ]
    }];
  } else {
    chartCard.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
    chartCard.strokeWeight = 1;
    chartCard.strokes = [{ type: 'SOLID', color: { r: 0.90, g: 0.91, b: 0.92 } }];
  }

  chartCard.cornerRadius = 12;
  chartCard.layoutMode = 'VERTICAL';
  chartCard.paddingTop = 24;
  chartCard.paddingBottom = 24;
  chartCard.paddingLeft = 24;
  chartCard.paddingRight = 24;
  chartCard.itemSpacing = 16;
  chartCard.effects = [{
    type: 'DROP_SHADOW',
    color: { r: 0, g: 0, b: 0, a: 0.08 },
    offset: { x: 0, y: 4 },
    radius: 12,
    visible: true,
    blendMode: 'NORMAL'
  }];

  const chartTitle = figma.createText();
  chartTitle.fontName = { family: 'Inter', style: 'Bold' };
  chartTitle.fontSize = 18;
  chartTitle.characters = title;
  chartTitle.fills = [{ type: 'SOLID', color: isGradient ? { r: 1, g: 1, b: 1 } : { r: 0.07, g: 0.11, b: 0.15 } }];
  chartCard.appendChild(chartTitle);

  // Chart Placeholder
  const chartArea = figma.createFrame();
  chartArea.name = "Chart Area";
  chartArea.resize(1080, 180);
  chartArea.fills = isGradient
    ? [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 }, opacity: 0.1 }]
    : [{ type: 'SOLID', color: { r: 0.97, g: 0.97, b: 0.98 } }];
  chartArea.cornerRadius = 8;
  chartArea.layoutMode = 'VERTICAL';
  chartArea.primaryAxisAlignItems = 'CENTER';
  chartArea.counterAxisAlignItems = 'CENTER';

  const chartPlaceholder = figma.createText();
  chartPlaceholder.fontName = { family: 'Inter', style: 'Medium' };
  chartPlaceholder.fontSize = 14;
  chartPlaceholder.characters = "📊 Chart Visualization";
  chartPlaceholder.fills = [{ type: 'SOLID', color: isGradient ? { r: 1, g: 1, b: 1 } : { r: 0.61, g: 0.64, b: 0.69 } }];
  if (isGradient) {
    chartPlaceholder.opacity = 0.7;
  }
  chartArea.appendChild(chartPlaceholder);

  chartCard.appendChild(chartArea);

  return chartCard;
}

// Create Most Sold Products
function createMostSoldProducts() {
  const productsCard = figma.createFrame();
  productsCard.name = "Most Sold Products";
  productsCard.resize(1128, 350);
  productsCard.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
  productsCard.cornerRadius = 12;
  productsCard.strokeWeight = 1;
  productsCard.strokes = [{ type: 'SOLID', color: { r: 0.90, g: 0.91, b: 0.92 } }];
  productsCard.layoutMode = 'VERTICAL';
  productsCard.paddingTop = 24;
  productsCard.paddingBottom = 24;
  productsCard.paddingLeft = 24;
  productsCard.paddingRight = 24;
  productsCard.itemSpacing = 16;
  productsCard.effects = [{
    type: 'DROP_SHADOW',
    color: { r: 0, g: 0, b: 0, a: 0.05 },
    offset: { x: 0, y: 2 },
    radius: 8,
    visible: true,
    blendMode: 'NORMAL'
  }];

  const sectionTitle = figma.createText();
  sectionTitle.fontName = { family: 'Inter', style: 'Bold' };
  sectionTitle.fontSize = 18;
  sectionTitle.characters = "Most Sold Products";
  sectionTitle.fills = [{ type: 'SOLID', color: { r: 0.07, g: 0.11, b: 0.15 } }];
  productsCard.appendChild(sectionTitle);

  // Product Items
  const products = [
    { rank: 1, name: "Smart TV LED 55 inch", price: "Rp 5.999.000", sold: 156 },
    { rank: 2, name: "Wireless Bluetooth Speaker", price: "Rp 1.299.000", sold: 134 },
    { rank: 3, name: "Smart Watch Pro Max", price: "Rp 2.499.000", sold: 98 }
  ];

  products.forEach(product => {
    const productRow = figma.createFrame();
    productRow.name = product.name;
    productRow.resize(1080, 80);
    productRow.fills = [{ type: 'SOLID', color: { r: 0.97, g: 0.97, b: 0.98 } }];
    productRow.cornerRadius = 8;
    productRow.layoutMode = 'HORIZONTAL';
    productRow.paddingLeft = 16;
    productRow.paddingRight = 16;
    productRow.counterAxisAlignItems = 'CENTER';
    productRow.itemSpacing = 16;

    // Rank Badge
    const rankBadge = figma.createFrame();
    rankBadge.name = "Rank";
    rankBadge.resize(48, 48);
    rankBadge.fills = [{ type: 'SOLID', color: { r: 0.94, g: 0.27, b: 0.27 } }];
    rankBadge.cornerRadius = 24;
    rankBadge.layoutMode = 'VERTICAL';
    rankBadge.primaryAxisAlignItems = 'CENTER';
    rankBadge.counterAxisAlignItems = 'CENTER';

    const rankText = figma.createText();
    rankText.fontName = { family: 'Inter', style: 'Bold' };
    rankText.fontSize = 16;
    rankText.characters = `#${product.rank}`;
    rankText.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
    rankBadge.appendChild(rankText);

    productRow.appendChild(rankBadge);

    // Product Image Placeholder
    const productImage = figma.createFrame();
    productImage.name = "Image";
    productImage.resize(56, 56);
    productImage.fills = [{ type: 'SOLID', color: { r: 0.90, g: 0.91, b: 0.92 } }];
    productImage.cornerRadius = 8;
    productRow.appendChild(productImage);

    // Product Info
    const productInfo = figma.createFrame();
    productInfo.name = "Info";
    productInfo.resize(700, 50);
    productInfo.fills = [];
    productInfo.layoutMode = 'VERTICAL';
    productInfo.itemSpacing = 4;

    const productName = figma.createText();
    productName.fontName = { family: 'Inter', style: 'Bold' };
    productName.fontSize = 14;
    productName.characters = product.name;
    productName.fills = [{ type: 'SOLID', color: { r: 0.07, g: 0.11, b: 0.15 } }];
    productInfo.appendChild(productName);

    const productPrice = figma.createText();
    productPrice.fontName = { family: 'Inter', style: 'Regular' };
    productPrice.fontSize = 12;
    productPrice.characters = product.price;
    productPrice.fills = [{ type: 'SOLID', color: { r: 0.42, g: 0.45, b: 0.50 } }];
    productInfo.appendChild(productPrice);

    productRow.appendChild(productInfo);

    // Sold Count
    const soldSection = figma.createFrame();
    soldSection.name = "Sold";
    soldSection.resize(100, 50);
    soldSection.fills = [];
    soldSection.layoutMode = 'VERTICAL';
    soldSection.counterAxisAlignItems = 'MAX';
    soldSection.itemSpacing = 4;

    const soldValue = figma.createText();
    soldValue.fontName = { family: 'Inter', style: 'Bold' };
    soldValue.fontSize = 20;
    soldValue.characters = String(product.sold);
    soldValue.fills = [{ type: 'SOLID', color: { r: 0.94, g: 0.27, b: 0.27 } }];
    soldSection.appendChild(soldValue);

    const soldLabel = figma.createText();
    soldLabel.fontName = { family: 'Inter', style: 'Regular' };
    soldLabel.fontSize = 12;
    soldLabel.characters = "Units Sold";
    soldLabel.fills = [{ type: 'SOLID', color: { r: 0.42, g: 0.45, b: 0.50 } }];
    soldSection.appendChild(soldLabel);

    productRow.appendChild(soldSection);
    productsCard.appendChild(productRow);
  });

  return productsCard;
}

// ==========================================
// HELPER FUNCTIONS FOR ADMIN ORDERS PAGE
// ==========================================

// Create Admin Orders Frame
async function createAdminOrdersFrame() {
  try {
    const ordersPage = figma.createFrame();
    ordersPage.name = "Admin Orders - Desktop";
    ordersPage.resize(1440, 1000);
    ordersPage.fills = [{ type: 'SOLID', color: { r: 0.97, g: 0.97, b: 0.98 } }];
    ordersPage.layoutMode = 'HORIZONTAL';

    // Sidebar (Orders active)
    const sidebar = createAdminSidebarWithActive("Orders");
    ordersPage.appendChild(sidebar);

    // Main Area
    const mainArea = figma.createFrame();
    mainArea.name = "Main Area";
    mainArea.resize(1176, 1000);
    mainArea.fills = [{ type: 'SOLID', color: { r: 0.97, g: 0.97, b: 0.98 } }];
    mainArea.layoutMode = 'VERTICAL';

    // Top Bar
    const topBar = createAdminTopBar();
    mainArea.appendChild(topBar);

    // Content Area
    const contentArea = figma.createFrame();
    contentArea.name = "Content Area";
    contentArea.resize(1176, 936);
    contentArea.fills = [];
    contentArea.layoutMode = 'VERTICAL';
    contentArea.paddingTop = 24;
    contentArea.paddingBottom = 24;
    contentArea.paddingLeft = 24;
    contentArea.paddingRight = 24;
    contentArea.itemSpacing = 24;

    // Page Header
    const pageHeader = figma.createFrame();
    pageHeader.name = "Page Header";
    pageHeader.resize(1128, 60);
    pageHeader.fills = [];
    pageHeader.layoutMode = 'HORIZONTAL';
    pageHeader.primaryAxisAlignItems = 'SPACE_BETWEEN';
    pageHeader.counterAxisAlignItems = 'CENTER';

    const headerText = figma.createFrame();
    headerText.name = "Header Text";
    headerText.resize(400, 60);
    headerText.fills = [];
    headerText.layoutMode = 'VERTICAL';
    headerText.itemSpacing = 4;

    const pageTitle = figma.createText();
    pageTitle.fontName = { family: 'Inter', style: 'Bold' };
    pageTitle.fontSize = 24;
    pageTitle.characters = "Order Management";
    pageTitle.fills = [{ type: 'SOLID', color: { r: 0.07, g: 0.11, b: 0.15 } }];
    headerText.appendChild(pageTitle);

    const pageSubtitle = figma.createText();
    pageSubtitle.fontName = { family: 'Inter', style: 'Regular' };
    pageSubtitle.fontSize = 14;
    pageSubtitle.characters = "View and manage customer orders";
    pageSubtitle.fills = [{ type: 'SOLID', color: { r: 0.42, g: 0.45, b: 0.50 } }];
    headerText.appendChild(pageSubtitle);

    pageHeader.appendChild(headerText);

    // Print Button
    const printBtn = figma.createFrame();
    printBtn.name = "Print Button";
    printBtn.resize(160, 44);
    printBtn.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
    printBtn.strokeWeight = 1;
    printBtn.strokes = [{ type: 'SOLID', color: { r: 0.82, g: 0.84, b: 0.86 } }];
    printBtn.cornerRadius = 6;
    printBtn.layoutMode = 'HORIZONTAL';
    printBtn.primaryAxisAlignItems = 'CENTER';
    printBtn.counterAxisAlignItems = 'CENTER';
    printBtn.itemSpacing = 8;

    const printIcon = figma.createText();
    printIcon.fontName = { family: 'Inter', style: 'Regular' };
    printIcon.fontSize = 16;
    printIcon.characters = "🖨️";
    printBtn.appendChild(printIcon);

    const printText = figma.createText();
    printText.fontName = { family: 'Inter', style: 'Bold' };
    printText.fontSize = 14;
    printText.characters = "Print All Orders";
    printText.fills = [{ type: 'SOLID', color: { r: 0.94, g: 0.27, b: 0.27 } }];
    printBtn.appendChild(printText);

    pageHeader.appendChild(printBtn);
    contentArea.appendChild(pageHeader);

    // Orders Table Card
    const ordersCard = createOrdersTable();
    contentArea.appendChild(ordersCard);

    mainArea.appendChild(contentArea);
    ordersPage.appendChild(mainArea);

    console.log('Admin Orders frame created successfully');
    return ordersPage;
  } catch (error) {
    console.error('Error in createAdminOrdersFrame:', error);
    throw new Error('Failed to create Admin Orders: ' + error.message);
  }
}

// Create Admin Sidebar with Active Item
function createAdminSidebarWithActive(activeItem) {
  const sidebar = figma.createFrame();
  sidebar.name = "Sidebar";
  sidebar.resize(264, 1000);
  sidebar.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
  sidebar.strokeWeight = 1;
  sidebar.strokes = [{ type: 'SOLID', color: { r: 0.90, g: 0.91, b: 0.92 } }];
  sidebar.layoutMode = 'VERTICAL';

  // Sidebar Header
  const sidebarHeader = figma.createFrame();
  sidebarHeader.name = "Sidebar Header";
  sidebarHeader.resize(264, 64);
  sidebarHeader.fills = [];
  sidebarHeader.layoutMode = 'HORIZONTAL';
  sidebarHeader.paddingLeft = 16;
  sidebarHeader.counterAxisAlignItems = 'CENTER';
  sidebarHeader.strokeBottomWeight = 1;
  sidebarHeader.strokes = [{ type: 'SOLID', color: { r: 0.90, g: 0.91, b: 0.92 } }];

  const menuLabel = figma.createText();
  menuLabel.fontName = { family: 'Inter', style: 'Bold' };
  menuLabel.fontSize = 11;
  menuLabel.characters = "MAIN MENU";
  menuLabel.fills = [{ type: 'SOLID', color: { r: 0.61, g: 0.64, b: 0.69 } }];
  menuLabel.letterSpacing = { value: 1, unit: 'PIXELS' };
  sidebarHeader.appendChild(menuLabel);

  sidebar.appendChild(sidebarHeader);

  // Navigation Items
  const navItems = [
    { label: "Dashboard", icon: "□" },
    { label: "Orders", icon: "📦" },
    { label: "Products", icon: "📋" },
    { label: "Categories", icon: "📁" },
    { label: "Users", icon: "👤" }
  ];

  const navContainer = figma.createFrame();
  navContainer.name = "Navigation";
  navContainer.resize(264, 300);
  navContainer.fills = [];
  navContainer.layoutMode = 'VERTICAL';
  navContainer.paddingTop = 16;
  navContainer.itemSpacing = 4;

  navItems.forEach(item => {
    const isActive = item.label === activeItem;
    const navItem = figma.createFrame();
    navItem.name = item.label;
    navItem.resize(248, 44);
    navItem.fills = isActive
      ? [{ type: 'SOLID', color: { r: 0.94, g: 0.27, b: 0.27 } }]
      : [];
    navItem.cornerRadius = 8;
    navItem.layoutMode = 'HORIZONTAL';
    navItem.paddingLeft = 16;
    navItem.paddingRight = 16;
    navItem.counterAxisAlignItems = 'CENTER';
    navItem.itemSpacing = 12;

    const navIcon = figma.createText();
    navIcon.fontName = { family: 'Inter', style: 'Regular' };
    navIcon.fontSize = 16;
    navIcon.characters = item.icon;
    navIcon.fills = [{ type: 'SOLID', color: isActive ? { r: 1, g: 1, b: 1 } : { r: 0.42, g: 0.45, b: 0.50 } }];
    navItem.appendChild(navIcon);

    const navLabel = figma.createText();
    navLabel.fontName = { family: 'Inter', style: 'Medium' };
    navLabel.fontSize = 14;
    navLabel.characters = item.label;
    navLabel.fills = [{ type: 'SOLID', color: isActive ? { r: 1, g: 1, b: 1 } : { r: 0.22, g: 0.26, b: 0.31 } }];
    navItem.appendChild(navLabel);

    navContainer.appendChild(navItem);
  });

  sidebar.appendChild(navContainer);

  // Sidebar Footer
  const sidebarFooter = figma.createFrame();
  sidebarFooter.name = "Sidebar Footer";
  sidebarFooter.resize(264, 50);
  sidebarFooter.fills = [{ type: 'SOLID', color: { r: 0.97, g: 0.97, b: 0.98 } }];
  sidebarFooter.layoutMode = 'VERTICAL';
  sidebarFooter.primaryAxisAlignItems = 'CENTER';
  sidebarFooter.counterAxisAlignItems = 'CENTER';
  sidebarFooter.strokeTopWeight = 1;
  sidebarFooter.strokes = [{ type: 'SOLID', color: { r: 0.90, g: 0.91, b: 0.92 } }];

  const versionText = figma.createText();
  versionText.fontName = { family: 'Inter', style: 'Regular' };
  versionText.fontSize = 11;
  versionText.characters = "v1.0.0 © 2025 Nasional Elektronik";
  versionText.fills = [{ type: 'SOLID', color: { r: 0.61, g: 0.64, b: 0.69 } }];
  sidebarFooter.appendChild(versionText);

  sidebar.appendChild(sidebarFooter);

  return sidebar;
}

// Create Orders Table
function createOrdersTable() {
  const tableCard = figma.createFrame();
  tableCard.name = "Orders Table";
  tableCard.resize(1128, 600);
  tableCard.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
  tableCard.cornerRadius = 12;
  tableCard.strokeWeight = 1;
  tableCard.strokes = [{ type: 'SOLID', color: { r: 0.90, g: 0.91, b: 0.92 } }];
  tableCard.layoutMode = 'VERTICAL';
  tableCard.effects = [{
    type: 'DROP_SHADOW',
    color: { r: 0, g: 0, b: 0, a: 0.05 },
    offset: { x: 0, y: 2 },
    radius: 8,
    visible: true,
    blendMode: 'NORMAL'
  }];

  // Table Header
  const tableHeader = figma.createFrame();
  tableHeader.name = "Table Header";
  tableHeader.resize(1128, 48);
  tableHeader.fills = [{ type: 'SOLID', color: { r: 0.97, g: 0.97, b: 0.98 } }];
  tableHeader.layoutMode = 'HORIZONTAL';
  tableHeader.paddingLeft = 24;
  tableHeader.paddingRight = 24;
  tableHeader.counterAxisAlignItems = 'CENTER';

  const headers = [
    { label: "Order ID", width: 150 },
    { label: "Name", width: 200 },
    { label: "Status", width: 120 },
    { label: "Subtotal", width: 180 },
    { label: "Date", width: 180 },
    { label: "", width: 100 }
  ];

  headers.forEach(header => {
    const headerCell = figma.createFrame();
    headerCell.name = header.label || "Action";
    headerCell.resize(header.width, 48);
    headerCell.fills = [];
    headerCell.layoutMode = 'HORIZONTAL';
    headerCell.counterAxisAlignItems = 'CENTER';

    const headerText = figma.createText();
    headerText.fontName = { family: 'Inter', style: 'Bold' };
    headerText.fontSize = 12;
    headerText.characters = header.label;
    headerText.fills = [{ type: 'SOLID', color: { r: 0.42, g: 0.45, b: 0.50 } }];
    headerCell.appendChild(headerText);

    tableHeader.appendChild(headerCell);
  });

  tableCard.appendChild(tableHeader);

  // Sample Orders Data
  const orders = [
    { id: "ORD-001", name: "John Doe", status: "Paid", subtotal: "Rp 5.999.000", date: "Dec 15, 2024" },
    { id: "ORD-002", name: "Jane Smith", status: "Pending", subtotal: "Rp 2.499.000", date: "Dec 14, 2024" },
    { id: "ORD-003", name: "Bob Wilson", status: "Cancelled", subtotal: "Rp 1.299.000", date: "Dec 13, 2024" },
    { id: "ORD-004", name: "Alice Brown", status: "Paid", subtotal: "Rp 8.750.000", date: "Dec 12, 2024" },
    { id: "ORD-005", name: "Charlie Davis", status: "Pending", subtotal: "Rp 3.450.000", date: "Dec 11, 2024" }
  ];

  orders.forEach((order, index) => {
    const row = figma.createFrame();
    row.name = order.id;
    row.resize(1128, 56);
    row.fills = index % 2 === 0 ? [] : [{ type: 'SOLID', color: { r: 0.99, g: 0.99, b: 0.99 } }];
    row.layoutMode = 'HORIZONTAL';
    row.paddingLeft = 24;
    row.paddingRight = 24;
    row.counterAxisAlignItems = 'CENTER';
    row.strokeBottomWeight = 1;
    row.strokes = [{ type: 'SOLID', color: { r: 0.95, g: 0.95, b: 0.96 } }];

    // Order ID
    const idCell = figma.createFrame();
    idCell.resize(150, 56);
    idCell.fills = [];
    idCell.layoutMode = 'HORIZONTAL';
    idCell.counterAxisAlignItems = 'CENTER';

    const idText = figma.createText();
    idText.fontName = { family: 'Inter', style: 'Bold' };
    idText.fontSize = 14;
    idText.characters = `#${order.id}`;
    idText.fills = [{ type: 'SOLID', color: { r: 0.07, g: 0.11, b: 0.15 } }];
    idCell.appendChild(idText);
    row.appendChild(idCell);

    // Name
    const nameCell = figma.createFrame();
    nameCell.resize(200, 56);
    nameCell.fills = [];
    nameCell.layoutMode = 'HORIZONTAL';
    nameCell.counterAxisAlignItems = 'CENTER';

    const nameText = figma.createText();
    nameText.fontName = { family: 'Inter', style: 'Medium' };
    nameText.fontSize = 14;
    nameText.characters = order.name;
    nameText.fills = [{ type: 'SOLID', color: { r: 0.07, g: 0.11, b: 0.15 } }];
    nameCell.appendChild(nameText);
    row.appendChild(nameCell);

    // Status Badge
    const statusCell = figma.createFrame();
    statusCell.resize(120, 56);
    statusCell.fills = [];
    statusCell.layoutMode = 'HORIZONTAL';
    statusCell.counterAxisAlignItems = 'CENTER';

    const statusBadge = figma.createFrame();
    statusBadge.name = "Status Badge";
    statusBadge.resize(70, 24);

    // Status colors
    let statusColor;
    if (order.status === "Paid") {
      statusColor = { r: 0.06, g: 0.72, b: 0.51 }; // Green
    } else if (order.status === "Pending") {
      statusColor = { r: 0.96, g: 0.62, b: 0.04 }; // Yellow/Orange
    } else {
      statusColor = { r: 0.94, g: 0.27, b: 0.27 }; // Red
    }

    statusBadge.fills = [{ type: 'SOLID', color: statusColor }];
    statusBadge.cornerRadius = 12;
    statusBadge.layoutMode = 'HORIZONTAL';
    statusBadge.primaryAxisAlignItems = 'CENTER';
    statusBadge.counterAxisAlignItems = 'CENTER';

    const statusText = figma.createText();
    statusText.fontName = { family: 'Inter', style: 'Medium' };
    statusText.fontSize = 11;
    statusText.characters = order.status;
    statusText.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
    statusBadge.appendChild(statusText);

    statusCell.appendChild(statusBadge);
    row.appendChild(statusCell);

    // Subtotal
    const subtotalCell = figma.createFrame();
    subtotalCell.resize(180, 56);
    subtotalCell.fills = [];
    subtotalCell.layoutMode = 'HORIZONTAL';
    subtotalCell.counterAxisAlignItems = 'CENTER';

    const subtotalText = figma.createText();
    subtotalText.fontName = { family: 'Inter', style: 'Regular' };
    subtotalText.fontSize = 14;
    subtotalText.characters = order.subtotal;
    subtotalText.fills = [{ type: 'SOLID', color: { r: 0.07, g: 0.11, b: 0.15 } }];
    subtotalCell.appendChild(subtotalText);
    row.appendChild(subtotalCell);

    // Date
    const dateCell = figma.createFrame();
    dateCell.resize(180, 56);
    dateCell.fills = [];
    dateCell.layoutMode = 'HORIZONTAL';
    dateCell.counterAxisAlignItems = 'CENTER';

    const dateText = figma.createText();
    dateText.fontName = { family: 'Inter', style: 'Regular' };
    dateText.fontSize = 14;
    dateText.characters = order.date;
    dateText.fills = [{ type: 'SOLID', color: { r: 0.42, g: 0.45, b: 0.50 } }];
    dateCell.appendChild(dateText);
    row.appendChild(dateCell);

    // Details Button
    const actionCell = figma.createFrame();
    actionCell.resize(100, 56);
    actionCell.fills = [];
    actionCell.layoutMode = 'HORIZONTAL';
    actionCell.counterAxisAlignItems = 'CENTER';

    const detailsBtn = figma.createText();
    detailsBtn.fontName = { family: 'Inter', style: 'Medium' };
    detailsBtn.fontSize = 14;
    detailsBtn.characters = "Details";
    detailsBtn.fills = [{ type: 'SOLID', color: { r: 0.42, g: 0.45, b: 0.50 } }];
    actionCell.appendChild(detailsBtn);
    row.appendChild(actionCell);

    tableCard.appendChild(row);
  });

  return tableCard;
}

// ==========================================
// HELPER FUNCTIONS FOR ADMIN PRODUCTS PAGE
// ==========================================

// Create Admin Products Frame
async function createAdminProductsFrame() {
  try {
    const productsPage = figma.createFrame();
    productsPage.name = "Admin Products - Desktop";
    productsPage.resize(1440, 1000);
    productsPage.fills = [{ type: 'SOLID', color: { r: 0.97, g: 0.97, b: 0.98 } }];
    productsPage.layoutMode = 'HORIZONTAL';

    // Sidebar (Products active)
    const sidebar = createAdminSidebarWithActive("Products");
    productsPage.appendChild(sidebar);

    // Main Area
    const mainArea = figma.createFrame();
    mainArea.name = "Main Area";
    mainArea.resize(1176, 1000);
    mainArea.fills = [{ type: 'SOLID', color: { r: 0.97, g: 0.97, b: 0.98 } }];
    mainArea.layoutMode = 'VERTICAL';

    // Top Bar
    const topBar = createAdminTopBar();
    mainArea.appendChild(topBar);

    // Content Area
    const contentArea = figma.createFrame();
    contentArea.name = "Content Area";
    contentArea.resize(1176, 936);
    contentArea.fills = [];
    contentArea.layoutMode = 'VERTICAL';
    contentArea.paddingTop = 24;
    contentArea.paddingBottom = 24;
    contentArea.paddingLeft = 24;
    contentArea.paddingRight = 24;
    contentArea.itemSpacing = 24;

    // Page Header
    const pageHeader = figma.createFrame();
    pageHeader.name = "Page Header";
    pageHeader.resize(1128, 60);
    pageHeader.fills = [];
    pageHeader.layoutMode = 'HORIZONTAL';
    pageHeader.primaryAxisAlignItems = 'SPACE_BETWEEN';
    pageHeader.counterAxisAlignItems = 'CENTER';

    const headerText = figma.createFrame();
    headerText.name = "Header Text";
    headerText.resize(400, 60);
    headerText.fills = [];
    headerText.layoutMode = 'VERTICAL';
    headerText.itemSpacing = 4;

    const pageTitle = figma.createText();
    pageTitle.fontName = { family: 'Inter', style: 'Bold' };
    pageTitle.fontSize = 24;
    pageTitle.characters = "Product Management";
    pageTitle.fills = [{ type: 'SOLID', color: { r: 0.07, g: 0.11, b: 0.15 } }];
    headerText.appendChild(pageTitle);

    const pageSubtitle = figma.createText();
    pageSubtitle.fontName = { family: 'Inter', style: 'Regular' };
    pageSubtitle.fontSize = 14;
    pageSubtitle.characters = "Manage your product inventory";
    pageSubtitle.fills = [{ type: 'SOLID', color: { r: 0.42, g: 0.45, b: 0.50 } }];
    headerText.appendChild(pageSubtitle);

    pageHeader.appendChild(headerText);

    // Add New Product Button
    const addBtn = figma.createFrame();
    addBtn.name = "Add Product Button";
    addBtn.resize(160, 44);
    addBtn.fills = [{ type: 'SOLID', color: { r: 0.94, g: 0.27, b: 0.27 } }];
    addBtn.cornerRadius = 6;
    addBtn.layoutMode = 'HORIZONTAL';
    addBtn.primaryAxisAlignItems = 'CENTER';
    addBtn.counterAxisAlignItems = 'CENTER';
    addBtn.itemSpacing = 8;

    const addIcon = figma.createText();
    addIcon.fontName = { family: 'Inter', style: 'Bold' };
    addIcon.fontSize = 16;
    addIcon.characters = "+";
    addIcon.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
    addBtn.appendChild(addIcon);

    const addText = figma.createText();
    addText.fontName = { family: 'Inter', style: 'Bold' };
    addText.fontSize = 14;
    addText.characters = "Add new product";
    addText.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
    addBtn.appendChild(addText);

    pageHeader.appendChild(addBtn);
    contentArea.appendChild(pageHeader);

    // Products Table Card
    const productsCard = createProductsTable();
    contentArea.appendChild(productsCard);

    mainArea.appendChild(contentArea);
    productsPage.appendChild(mainArea);

    console.log('Admin Products frame created successfully');
    return productsPage;
  } catch (error) {
    console.error('Error in createAdminProductsFrame:', error);
    throw new Error('Failed to create Admin Products: ' + error.message);
  }
}

// Create Products Table
function createProductsTable() {
  const tableCard = figma.createFrame();
  tableCard.name = "Products Table";
  tableCard.resize(1128, 600);
  tableCard.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
  tableCard.cornerRadius = 12;
  tableCard.strokeWeight = 1;
  tableCard.strokes = [{ type: 'SOLID', color: { r: 0.90, g: 0.91, b: 0.92 } }];
  tableCard.layoutMode = 'VERTICAL';
  tableCard.effects = [{
    type: 'DROP_SHADOW',
    color: { r: 0, g: 0, b: 0, a: 0.05 },
    offset: { x: 0, y: 2 },
    radius: 8,
    visible: true,
    blendMode: 'NORMAL'
  }];

  // Table Header
  const tableHeader = figma.createFrame();
  tableHeader.name = "Table Header";
  tableHeader.resize(1128, 48);
  tableHeader.fills = [{ type: 'SOLID', color: { r: 0.97, g: 0.97, b: 0.98 } }];
  tableHeader.layoutMode = 'HORIZONTAL';
  tableHeader.paddingLeft = 24;
  tableHeader.paddingRight = 24;
  tableHeader.counterAxisAlignItems = 'CENTER';

  const headers = [
    { label: "Product", width: 400 },
    { label: "Ketersediaan Stock", width: 200 },
    { label: "Harga", width: 250 },
    { label: "", width: 100 }
  ];

  headers.forEach(header => {
    const headerCell = figma.createFrame();
    headerCell.name = header.label || "Action";
    headerCell.resize(header.width, 48);
    headerCell.fills = [];
    headerCell.layoutMode = 'HORIZONTAL';
    headerCell.counterAxisAlignItems = 'CENTER';

    const headerText = figma.createText();
    headerText.fontName = { family: 'Inter', style: 'Bold' };
    headerText.fontSize = 12;
    headerText.characters = header.label;
    headerText.fills = [{ type: 'SOLID', color: { r: 0.42, g: 0.45, b: 0.50 } }];
    headerCell.appendChild(headerText);

    tableHeader.appendChild(headerCell);
  });

  tableCard.appendChild(tableHeader);

  // Sample Products Data
  const products = [
    { title: "Smart TV LED 55 inch", manufacturer: "Samsung", inStock: true, price: "Rp 5.999.000" },
    { title: "Wireless Bluetooth Speaker", manufacturer: "JBL", inStock: true, price: "Rp 1.299.000" },
    { title: "Smart Watch Pro Max", manufacturer: "Apple", inStock: false, price: "Rp 2.499.000" },
    { title: "Laptop Gaming 15.6 inch", manufacturer: "ASUS", inStock: true, price: "Rp 15.999.000" },
    { title: "Wireless Earbuds Pro", manufacturer: "Sony", inStock: false, price: "Rp 899.000" }
  ];

  products.forEach((product, index) => {
    const row = figma.createFrame();
    row.name = product.title;
    row.resize(1128, 72);
    row.fills = index % 2 === 0 ? [] : [{ type: 'SOLID', color: { r: 0.99, g: 0.99, b: 0.99 } }];
    row.layoutMode = 'HORIZONTAL';
    row.paddingLeft = 24;
    row.paddingRight = 24;
    row.counterAxisAlignItems = 'CENTER';
    row.strokeBottomWeight = 1;
    row.strokes = [{ type: 'SOLID', color: { r: 0.95, g: 0.95, b: 0.96 } }];

    // Product Cell (Image + Title + Manufacturer)
    const productCell = figma.createFrame();
    productCell.name = "Product Cell";
    productCell.resize(400, 72);
    productCell.fills = [];
    productCell.layoutMode = 'HORIZONTAL';
    productCell.counterAxisAlignItems = 'CENTER';
    productCell.itemSpacing = 12;

    // Product Image Placeholder
    const productImage = figma.createFrame();
    productImage.name = "Image";
    productImage.resize(48, 48);
    productImage.fills = [{ type: 'SOLID', color: { r: 0.90, g: 0.91, b: 0.92 } }];
    productImage.cornerRadius = 8;
    productCell.appendChild(productImage);

    // Product Info
    const productInfo = figma.createFrame();
    productInfo.name = "Info";
    productInfo.resize(320, 48);
    productInfo.fills = [];
    productInfo.layoutMode = 'VERTICAL';
    productInfo.itemSpacing = 4;
    productInfo.primaryAxisAlignItems = 'CENTER';

    const productTitle = figma.createText();
    productTitle.fontName = { family: 'Inter', style: 'Bold' };
    productTitle.fontSize = 14;
    productTitle.characters = product.title;
    productTitle.fills = [{ type: 'SOLID', color: { r: 0.07, g: 0.11, b: 0.15 } }];
    productInfo.appendChild(productTitle);

    const productManufacturer = figma.createText();
    productManufacturer.fontName = { family: 'Inter', style: 'Regular' };
    productManufacturer.fontSize = 12;
    productManufacturer.characters = product.manufacturer;
    productManufacturer.fills = [{ type: 'SOLID', color: { r: 0.61, g: 0.64, b: 0.69 } }];
    productInfo.appendChild(productManufacturer);

    productCell.appendChild(productInfo);
    row.appendChild(productCell);

    // Stock Status Cell
    const stockCell = figma.createFrame();
    stockCell.name = "Stock Cell";
    stockCell.resize(200, 72);
    stockCell.fills = [];
    stockCell.layoutMode = 'HORIZONTAL';
    stockCell.counterAxisAlignItems = 'CENTER';

    const stockBadge = figma.createFrame();
    stockBadge.name = "Stock Badge";
    stockBadge.resize(100, 24);
    stockBadge.fills = [{
      type: 'SOLID',
      color: product.inStock
        ? { r: 0.06, g: 0.72, b: 0.51 } // Green
        : { r: 0.94, g: 0.27, b: 0.27 } // Red
    }];
    stockBadge.cornerRadius = 12;
    stockBadge.layoutMode = 'HORIZONTAL';
    stockBadge.primaryAxisAlignItems = 'CENTER';
    stockBadge.counterAxisAlignItems = 'CENTER';

    const stockText = figma.createText();
    stockText.fontName = { family: 'Inter', style: 'Medium' };
    stockText.fontSize = 11;
    stockText.characters = product.inStock ? "Stock tersedia" : "Stock habis";
    stockText.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
    stockBadge.appendChild(stockText);

    stockCell.appendChild(stockBadge);
    row.appendChild(stockCell);

    // Price Cell
    const priceCell = figma.createFrame();
    priceCell.name = "Price Cell";
    priceCell.resize(250, 72);
    priceCell.fills = [];
    priceCell.layoutMode = 'HORIZONTAL';
    priceCell.counterAxisAlignItems = 'CENTER';

    const priceText = figma.createText();
    priceText.fontName = { family: 'Inter', style: 'Medium' };
    priceText.fontSize = 14;
    priceText.characters = product.price;
    priceText.fills = [{ type: 'SOLID', color: { r: 0.07, g: 0.11, b: 0.15 } }];
    priceCell.appendChild(priceText);
    row.appendChild(priceCell);

    // Edit Button Cell
    const actionCell = figma.createFrame();
    actionCell.name = "Action Cell";
    actionCell.resize(100, 72);
    actionCell.fills = [];
    actionCell.layoutMode = 'HORIZONTAL';
    actionCell.counterAxisAlignItems = 'CENTER';

    const editBtn = figma.createText();
    editBtn.fontName = { family: 'Inter', style: 'Medium' };
    editBtn.fontSize = 14;
    editBtn.characters = "Edit";
    editBtn.fills = [{ type: 'SOLID', color: { r: 0.42, g: 0.45, b: 0.50 } }];
    actionCell.appendChild(editBtn);
    row.appendChild(actionCell);

    tableCard.appendChild(row);
  });

  return tableCard;
}

// ==========================================
// HELPER FUNCTIONS FOR ADMIN CATEGORIES PAGE
// ==========================================

// Create Admin Categories Frame
async function createAdminCategoriesFrame() {
  try {
    const categoriesPage = figma.createFrame();
    categoriesPage.name = "Admin Categories - Desktop";
    categoriesPage.resize(1440, 900);
    categoriesPage.fills = [{ type: 'SOLID', color: { r: 0.97, g: 0.97, b: 0.98 } }];
    categoriesPage.layoutMode = 'HORIZONTAL';

    // Sidebar (Categories active)
    const sidebar = createAdminSidebarWithActive("Categories");
    categoriesPage.appendChild(sidebar);

    // Main Area
    const mainArea = figma.createFrame();
    mainArea.name = "Main Area";
    mainArea.resize(1176, 900);
    mainArea.fills = [{ type: 'SOLID', color: { r: 0.97, g: 0.97, b: 0.98 } }];
    mainArea.layoutMode = 'VERTICAL';

    // Top Bar
    const topBar = createAdminTopBar();
    mainArea.appendChild(topBar);

    // Content Area
    const contentArea = figma.createFrame();
    contentArea.name = "Content Area";
    contentArea.resize(1176, 836);
    contentArea.fills = [];
    contentArea.layoutMode = 'VERTICAL';
    contentArea.paddingTop = 24;
    contentArea.paddingBottom = 24;
    contentArea.paddingLeft = 24;
    contentArea.paddingRight = 24;
    contentArea.itemSpacing = 24;

    // Page Header
    const pageHeader = figma.createFrame();
    pageHeader.name = "Page Header";
    pageHeader.resize(1128, 60);
    pageHeader.fills = [];
    pageHeader.layoutMode = 'VERTICAL';
    pageHeader.itemSpacing = 4;

    const pageTitle = figma.createText();
    pageTitle.fontName = { family: 'Inter', style: 'Bold' };
    pageTitle.fontSize = 24;
    pageTitle.characters = "Category Management";
    pageTitle.fills = [{ type: 'SOLID', color: { r: 0.07, g: 0.11, b: 0.15 } }];
    pageHeader.appendChild(pageTitle);

    const pageSubtitle = figma.createText();
    pageSubtitle.fontName = { family: 'Inter', style: 'Regular' };
    pageSubtitle.fontSize = 14;
    pageSubtitle.characters = "Manage product categories";
    pageSubtitle.fills = [{ type: 'SOLID', color: { r: 0.42, g: 0.45, b: 0.50 } }];
    pageHeader.appendChild(pageSubtitle);

    contentArea.appendChild(pageHeader);

    // Categories Table Card
    const categoriesCard = createCategoriesTable();
    contentArea.appendChild(categoriesCard);

    mainArea.appendChild(contentArea);
    categoriesPage.appendChild(mainArea);

    console.log('Admin Categories frame created successfully');
    return categoriesPage;
  } catch (error) {
    console.error('Error in createAdminCategoriesFrame:', error);
    throw new Error('Failed to create Admin Categories: ' + error.message);
  }
}

// Create Categories Table
function createCategoriesTable() {
  const tableCard = figma.createFrame();
  tableCard.name = "Categories Table";
  tableCard.resize(1128, 500);
  tableCard.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
  tableCard.cornerRadius = 12;
  tableCard.strokeWeight = 1;
  tableCard.strokes = [{ type: 'SOLID', color: { r: 0.90, g: 0.91, b: 0.92 } }];
  tableCard.layoutMode = 'VERTICAL';
  tableCard.effects = [{
    type: 'DROP_SHADOW',
    color: { r: 0, g: 0, b: 0, a: 0.05 },
    offset: { x: 0, y: 2 },
    radius: 8,
    visible: true,
    blendMode: 'NORMAL'
  }];

  // Add Button Row
  const buttonRow = figma.createFrame();
  buttonRow.name = "Button Row";
  buttonRow.resize(1128, 60);
  buttonRow.fills = [];
  buttonRow.layoutMode = 'HORIZONTAL';
  buttonRow.primaryAxisAlignItems = 'MAX';
  buttonRow.counterAxisAlignItems = 'CENTER';
  buttonRow.paddingRight = 24;
  buttonRow.paddingTop = 16;

  const addBtn = figma.createFrame();
  addBtn.name = "Add Category Button";
  addBtn.resize(170, 40);
  addBtn.fills = [{ type: 'SOLID', color: { r: 0.94, g: 0.27, b: 0.27 } }];
  addBtn.cornerRadius = 6;
  addBtn.layoutMode = 'HORIZONTAL';
  addBtn.primaryAxisAlignItems = 'CENTER';
  addBtn.counterAxisAlignItems = 'CENTER';
  addBtn.itemSpacing = 6;

  const addText = figma.createText();
  addText.fontName = { family: 'Inter', style: 'Bold' };
  addText.fontSize = 13;
  addText.characters = "+ Add New Category";
  addText.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
  addBtn.appendChild(addText);

  buttonRow.appendChild(addBtn);
  tableCard.appendChild(buttonRow);

  // Table Header
  const tableHeader = figma.createFrame();
  tableHeader.name = "Table Header";
  tableHeader.resize(1128, 48);
  tableHeader.fills = [{ type: 'SOLID', color: { r: 0.97, g: 0.97, b: 0.98 } }];
  tableHeader.layoutMode = 'HORIZONTAL';
  tableHeader.paddingLeft = 24;
  tableHeader.paddingRight = 24;
  tableHeader.counterAxisAlignItems = 'CENTER';

  const nameHeader = figma.createFrame();
  nameHeader.resize(900, 48);
  nameHeader.fills = [];
  nameHeader.layoutMode = 'HORIZONTAL';
  nameHeader.counterAxisAlignItems = 'CENTER';

  const nameHeaderText = figma.createText();
  nameHeaderText.fontName = { family: 'Inter', style: 'Bold' };
  nameHeaderText.fontSize = 12;
  nameHeaderText.characters = "Name";
  nameHeaderText.fills = [{ type: 'SOLID', color: { r: 0.42, g: 0.45, b: 0.50 } }];
  nameHeader.appendChild(nameHeaderText);
  tableHeader.appendChild(nameHeader);

  const actionHeader = figma.createFrame();
  actionHeader.resize(100, 48);
  actionHeader.fills = [];
  tableHeader.appendChild(actionHeader);

  tableCard.appendChild(tableHeader);

  // Sample Categories Data
  const categories = [
    "Televisions",
    "Audio & Speakers",
    "Smartphones",
    "Laptops & Computers",
    "Kitchen Appliances",
    "Air Conditioners",
    "Refrigerators",
    "Washing Machines"
  ];

  categories.forEach((category, index) => {
    const row = figma.createFrame();
    row.name = category;
    row.resize(1128, 52);
    row.fills = index % 2 === 0 ? [] : [{ type: 'SOLID', color: { r: 0.99, g: 0.99, b: 0.99 } }];
    row.layoutMode = 'HORIZONTAL';
    row.paddingLeft = 24;
    row.paddingRight = 24;
    row.counterAxisAlignItems = 'CENTER';
    row.strokeBottomWeight = 1;
    row.strokes = [{ type: 'SOLID', color: { r: 0.95, g: 0.95, b: 0.96 } }];

    // Category Name Cell
    const nameCell = figma.createFrame();
    nameCell.name = "Name Cell";
    nameCell.resize(900, 52);
    nameCell.fills = [];
    nameCell.layoutMode = 'HORIZONTAL';
    nameCell.counterAxisAlignItems = 'CENTER';

    const nameText = figma.createText();
    nameText.fontName = { family: 'Inter', style: 'Medium' };
    nameText.fontSize = 14;
    nameText.characters = category;
    nameText.fills = [{ type: 'SOLID', color: { r: 0.07, g: 0.11, b: 0.15 } }];
    nameCell.appendChild(nameText);
    row.appendChild(nameCell);

    // Edit Button Cell
    const actionCell = figma.createFrame();
    actionCell.name = "Action Cell";
    actionCell.resize(100, 52);
    actionCell.fills = [];
    actionCell.layoutMode = 'HORIZONTAL';
    actionCell.counterAxisAlignItems = 'CENTER';

    const editBtn = figma.createText();
    editBtn.fontName = { family: 'Inter', style: 'Medium' };
    editBtn.fontSize = 14;
    editBtn.characters = "Edit";
    editBtn.fills = [{ type: 'SOLID', color: { r: 0.42, g: 0.45, b: 0.50 } }];
    actionCell.appendChild(editBtn);
    row.appendChild(actionCell);

    tableCard.appendChild(row);
  });

  return tableCard;
}

// ==========================================
// HELPER FUNCTIONS FOR ADMIN USERS PAGE
// ==========================================

// Create Admin Users Frame
async function createAdminUsersFrame() {
  try {
    const usersPage = figma.createFrame();
    usersPage.name = "Admin Users - Desktop";
    usersPage.resize(1440, 900);
    usersPage.fills = [{ type: 'SOLID', color: { r: 0.97, g: 0.97, b: 0.98 } }];
    usersPage.layoutMode = 'HORIZONTAL';

    // Sidebar (Users active)
    const sidebar = createAdminSidebarWithActive("Users");
    usersPage.appendChild(sidebar);

    // Main Area
    const mainArea = figma.createFrame();
    mainArea.name = "Main Area";
    mainArea.resize(1176, 900);
    mainArea.fills = [{ type: 'SOLID', color: { r: 0.97, g: 0.97, b: 0.98 } }];
    mainArea.layoutMode = 'VERTICAL';

    // Top Bar
    const topBar = createAdminTopBar();
    mainArea.appendChild(topBar);

    // Content Area
    const contentArea = figma.createFrame();
    contentArea.name = "Content Area";
    contentArea.resize(1176, 836);
    contentArea.fills = [];
    contentArea.layoutMode = 'VERTICAL';
    contentArea.paddingTop = 24;
    contentArea.paddingBottom = 24;
    contentArea.paddingLeft = 24;
    contentArea.paddingRight = 24;
    contentArea.itemSpacing = 24;

    // Page Header
    const pageHeader = figma.createFrame();
    pageHeader.name = "Page Header";
    pageHeader.resize(1128, 60);
    pageHeader.fills = [];
    pageHeader.layoutMode = 'VERTICAL';
    pageHeader.itemSpacing = 4;

    const pageTitle = figma.createText();
    pageTitle.fontName = { family: 'Inter', style: 'Bold' };
    pageTitle.fontSize = 24;
    pageTitle.characters = "User Management";
    pageTitle.fills = [{ type: 'SOLID', color: { r: 0.07, g: 0.11, b: 0.15 } }];
    pageHeader.appendChild(pageTitle);

    const pageSubtitle = figma.createText();
    pageSubtitle.fontName = { family: 'Inter', style: 'Regular' };
    pageSubtitle.fontSize = 14;
    pageSubtitle.characters = "Manage all system users";
    pageSubtitle.fills = [{ type: 'SOLID', color: { r: 0.42, g: 0.45, b: 0.50 } }];
    pageHeader.appendChild(pageSubtitle);

    contentArea.appendChild(pageHeader);

    // Users Table Card
    const usersCard = createUsersTable();
    contentArea.appendChild(usersCard);

    mainArea.appendChild(contentArea);
    usersPage.appendChild(mainArea);

    console.log('Admin Users frame created successfully');
    return usersPage;
  } catch (error) {
    console.error('Error in createAdminUsersFrame:', error);
    throw new Error('Failed to create Admin Users: ' + error.message);
  }
}

// Create Users Table
function createUsersTable() {
  const tableCard = figma.createFrame();
  tableCard.name = "Users Table";
  tableCard.resize(1128, 500);
  tableCard.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
  tableCard.cornerRadius = 12;
  tableCard.strokeWeight = 1;
  tableCard.strokes = [{ type: 'SOLID', color: { r: 0.90, g: 0.91, b: 0.92 } }];
  tableCard.layoutMode = 'VERTICAL';
  tableCard.effects = [{
    type: 'DROP_SHADOW',
    color: { r: 0, g: 0, b: 0, a: 0.05 },
    offset: { x: 0, y: 2 },
    radius: 8,
    visible: true,
    blendMode: 'NORMAL'
  }];

  // Add Button Row
  const buttonRow = figma.createFrame();
  buttonRow.name = "Button Row";
  buttonRow.resize(1128, 60);
  buttonRow.fills = [];
  buttonRow.layoutMode = 'HORIZONTAL';
  buttonRow.primaryAxisAlignItems = 'MAX';
  buttonRow.counterAxisAlignItems = 'CENTER';
  buttonRow.paddingRight = 24;
  buttonRow.paddingTop = 16;

  const addBtn = figma.createFrame();
  addBtn.name = "Add User Button";
  addBtn.resize(140, 40);
  addBtn.fills = [{ type: 'SOLID', color: { r: 0.94, g: 0.27, b: 0.27 } }];
  addBtn.cornerRadius = 6;
  addBtn.layoutMode = 'HORIZONTAL';
  addBtn.primaryAxisAlignItems = 'CENTER';
  addBtn.counterAxisAlignItems = 'CENTER';
  addBtn.itemSpacing = 6;

  const addText = figma.createText();
  addText.fontName = { family: 'Inter', style: 'Bold' };
  addText.fontSize = 13;
  addText.characters = "+ Add New User";
  addText.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
  addBtn.appendChild(addText);

  buttonRow.appendChild(addBtn);
  tableCard.appendChild(buttonRow);

  // Table Header
  const tableHeader = figma.createFrame();
  tableHeader.name = "Table Header";
  tableHeader.resize(1128, 48);
  tableHeader.fills = [{ type: 'SOLID', color: { r: 0.97, g: 0.97, b: 0.98 } }];
  tableHeader.layoutMode = 'HORIZONTAL';
  tableHeader.paddingLeft = 24;
  tableHeader.paddingRight = 24;
  tableHeader.counterAxisAlignItems = 'CENTER';

  const headers = [
    { label: "Email", width: 500 },
    { label: "Role", width: 300 },
    { label: "", width: 100 }
  ];

  headers.forEach(header => {
    const headerCell = figma.createFrame();
    headerCell.name = header.label || "Action";
    headerCell.resize(header.width, 48);
    headerCell.fills = [];
    headerCell.layoutMode = 'HORIZONTAL';
    headerCell.counterAxisAlignItems = 'CENTER';

    const headerText = figma.createText();
    headerText.fontName = { family: 'Inter', style: 'Bold' };
    headerText.fontSize = 12;
    headerText.characters = header.label;
    headerText.fills = [{ type: 'SOLID', color: { r: 0.42, g: 0.45, b: 0.50 } }];
    headerCell.appendChild(headerText);

    tableHeader.appendChild(headerCell);
  });

  tableCard.appendChild(tableHeader);

  // Sample Users Data
  const users = [
    { email: "admin@nasionalelektronik.com", role: "Admin" },
    { email: "john.doe@email.com", role: "User" },
    { email: "jane.smith@email.com", role: "User" },
    { email: "superadmin@nasionalelektronik.com", role: "Admin" },
    { email: "bob.wilson@email.com", role: "User" },
    { email: "alice.brown@email.com", role: "User" }
  ];

  users.forEach((user, index) => {
    const row = figma.createFrame();
    row.name = user.email;
    row.resize(1128, 52);
    row.fills = index % 2 === 0 ? [] : [{ type: 'SOLID', color: { r: 0.99, g: 0.99, b: 0.99 } }];
    row.layoutMode = 'HORIZONTAL';
    row.paddingLeft = 24;
    row.paddingRight = 24;
    row.counterAxisAlignItems = 'CENTER';
    row.strokeBottomWeight = 1;
    row.strokes = [{ type: 'SOLID', color: { r: 0.95, g: 0.95, b: 0.96 } }];

    // Email Cell
    const emailCell = figma.createFrame();
    emailCell.name = "Email Cell";
    emailCell.resize(500, 52);
    emailCell.fills = [];
    emailCell.layoutMode = 'HORIZONTAL';
    emailCell.counterAxisAlignItems = 'CENTER';

    const emailText = figma.createText();
    emailText.fontName = { family: 'Inter', style: 'Regular' };
    emailText.fontSize = 14;
    emailText.characters = user.email;
    emailText.fills = [{ type: 'SOLID', color: { r: 0.07, g: 0.11, b: 0.15 } }];
    emailCell.appendChild(emailText);
    row.appendChild(emailCell);

    // Role Badge Cell
    const roleCell = figma.createFrame();
    roleCell.name = "Role Cell";
    roleCell.resize(300, 52);
    roleCell.fills = [];
    roleCell.layoutMode = 'HORIZONTAL';
    roleCell.counterAxisAlignItems = 'CENTER';

    const roleBadge = figma.createFrame();
    roleBadge.name = "Role Badge";
    roleBadge.resize(60, 26);

    // Role colors: Admin = red background, User = blue background
    const isAdmin = user.role === "Admin";
    roleBadge.fills = [{
      type: 'SOLID',
      color: isAdmin
        ? { r: 0.99, g: 0.89, b: 0.89 } // Light red for admin
        : { r: 0.88, g: 0.93, b: 0.99 } // Light blue for user
    }];
    roleBadge.cornerRadius = 13;
    roleBadge.layoutMode = 'HORIZONTAL';
    roleBadge.primaryAxisAlignItems = 'CENTER';
    roleBadge.counterAxisAlignItems = 'CENTER';

    const roleText = figma.createText();
    roleText.fontName = { family: 'Inter', style: 'Medium' };
    roleText.fontSize = 12;
    roleText.characters = user.role;
    roleText.fills = [{
      type: 'SOLID',
      color: isAdmin
        ? { r: 0.77, g: 0.16, b: 0.16 } // Dark red for admin
        : { r: 0.12, g: 0.39, b: 0.72 } // Dark blue for user
    }];
    roleBadge.appendChild(roleText);

    roleCell.appendChild(roleBadge);
    row.appendChild(roleCell);

    // Details Button Cell
    const actionCell = figma.createFrame();
    actionCell.name = "Action Cell";
    actionCell.resize(100, 52);
    actionCell.fills = [];
    actionCell.layoutMode = 'HORIZONTAL';
    actionCell.counterAxisAlignItems = 'CENTER';

    const detailsBtn = figma.createText();
    detailsBtn.fontName = { family: 'Inter', style: 'Medium' };
    detailsBtn.fontSize = 14;
    detailsBtn.characters = "Details";
    detailsBtn.fills = [{ type: 'SOLID', color: { r: 0.42, g: 0.45, b: 0.50 } }];
    actionCell.appendChild(detailsBtn);
    row.appendChild(actionCell);

    tableCard.appendChild(row);
  });

  return tableCard;
}
