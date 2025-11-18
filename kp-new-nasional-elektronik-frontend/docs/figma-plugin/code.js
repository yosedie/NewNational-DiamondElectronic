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
      figma.notify('🎉 All 5 pages generated successfully!');
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
// GENERATE ALL PAGES (HOMEPAGE + SHOP PAGE + PRODUCT DETAIL PAGE + LOGIN + REGISTER)
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
    page.name = "📄 Pages - Nasional Elektronik";
    figma.currentPage = page;

    // Generate Homepage
    figma.notify('Generating Homepage... (1/5)');
    const homepage = await createHomepageFrame();
    homepage.x = 0;
    homepage.y = 0;
    page.appendChild(homepage);
    console.log('Homepage created and appended');
    
    // Generate Shop Page
    figma.notify('Generating Shop Page... (2/5)');
    const shopPage = await createShopPageFrame();
    shopPage.x = 1600; // Position to the right of homepage
    shopPage.y = 0;
    page.appendChild(shopPage);
    console.log('Shop Page created and appended');

    // Generate Product Detail Page
    figma.notify('Generating Product Detail Page... (3/5)');
    const productDetailPage = await createProductDetailFrame();
    productDetailPage.x = 3200; // Position to the right of shop page
    productDetailPage.y = 0;
    page.appendChild(productDetailPage);
    console.log('Product Detail Page created and appended');

    // Generate Login Page
    figma.notify('Generating Login Page... (4/5)');
    const loginPage = await createLoginFrame();
    loginPage.x = 4800; // Position to the right of product detail page
    loginPage.y = 0;
    page.appendChild(loginPage);
    console.log('Login Page created and appended');

    // Generate Register Page
    figma.notify('Generating Register Page... (5/5)');
    const registerPage = await createRegisterFrame();
    registerPage.x = 6400; // Position to the right of login page
    registerPage.y = 0;
    page.appendChild(registerPage);
    console.log('Register Page created and appended');

    // Zoom to fit all pages
    figma.notify('Finalizing...');
    figma.viewport.scrollAndZoomIntoView([homepage, shopPage, productDetailPage, loginPage, registerPage]);
    
    console.log('All 5 pages generated successfully');
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
    { label: "Model", value: "DE-2024" },
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
