export const categoryMenuList = [
  {
    id: 1,
    title: "Mesin Cuci",
    src: "/mesin cuci.png",
    href: "/shop/mesin-cuci",
    categoryId: "3117a1b0-6369-491e-8b8b-9fdd5ad9912e"
  },
  {
    id: 2,
    title: "Air Conditioner",
    src: "/air conditioner.png",
    href: "/shop/air-conditioner",
    categoryId: "ada699e5-e764-4da0-8d3e-18a8c8c5ed24"
  },
  {
    id: 3,
    title: "Kulkas",
    src: "/kulkas.png",
    href: "/shop/kulkas",
    categoryId: "da6413b4-22fd-4fbb-9741-d77580dfdcd5"
  },
  {
    id: 4,
    title: "Kompor",
    src: "/kompor.png",
    href: "/shop/kompor",
    categoryId: "659a91b9-3ff6-47d5-9830-5e7ac905b961"
  },
  {
    id: 5,
    title: "Rice Cooker",
    src: "/rice cooker.png",
    href: "/shop/rice-cooker",
    categoryId: "a6896b67-197c-4b2a-b5e2-93954474d8b4"
  },
  {
    id: 6,
    title: "Televisi",
    src: "/televisi.png",
    href: "/shop/televisi",
    categoryId: "782e7829-806b-489f-8c3a-2689548d7153"
  },
  {
    id: 7,
    title: "Anthena",
    src: "/anthena.png",
    href: "/shop/anthena",
    categoryId: "ss6412b4-22fd-4fbb-9741-d77580dfdcd2"
  },
  {
    id: 8,
    title: "Freezer Box",
    src: "/freezer box.png",
    href: "/shop/freezer-box",
    categoryId: "fs6412b4-22fd-4fbb-9741-d77512dfdfa3"
  }
];

// Helper function to get category ID from slug
export const getCategoryIdBySlug = (slug: string): string | null => {
  const category = categoryMenuList.find(cat => cat.href === `/shop/${slug}`);
  return category ? category.categoryId : null;
};

export const incentives = [
  {
    name: "Pengiriman Gratis",
    description:
      "Pengiriman kami sepenuhnya gratis dan itu sangat baik untuk pelanggan kami.",
    imageSrc: "/shipping icon.png",
  },
  {
    name: "24/7 Customer Support",
    description:
      "Dukungan kami bekerja sepanjang hari dan malam untuk menjawab pertanyaan apa pun yang Anda miliki.",
    imageSrc: "/support icon.png",
  },
  {
    name: "Keranjang Belanja Cepat",
    description:
      "Kami memiliki pengalaman berbelanja yang sangat cepat dan Anda akan menikmatinya.",
    imageSrc: "/fast shopping icon.png",
  },
];

export const navigation = {
  sale: [
    { name: "Diskon", href: "#" },
    { name: "Berita", href: "#" },
    { name: "Daftarkan Diskon", href: "#" },
  ],
  about: [
    { name: "Tentang Diamond Electronic", href: "#" },
    { name: "Kerja Dengan Kami", href: "#" },
    { name: "Profil Perusahaan", href: "#" },
  ],
  buy: [
    { name: "Ketentuan Penggunaan", href: "#" },
    { name: "Kebijakan Privasi", href: "#" },
    { name: "Keluhan", href: "#" },
    { name: "Partner", href: "#" },
  ],
  help: [
    { name: "Kontak", href: "#" },
    { name: "Bagaimana Cara Beli di Diamond Electronic", href: "#" },
    { name: "FAQ", href: "#" },
  ],
};

export const isValidNameOrLastname = (input: string) => {
  // Simple name or lastname regex format check
  const regex = /^[a-zA-Z\s]+$/;
  return regex.test(input);
};

export const isValidEmailAddressFormat = (input: string) => {
  // simple email address format check
  const regex = /^\S+@\S+\.\S+$/;
  return regex.test(input);
};

export const isValidCardNumber = (input: string) => {
  // Remove all non-digit characters
  const cleanedInput = input.replace(/[^0-9]/g, "");
  
  // Check if the cleaned input has valid length (13-19 digits)
  if (!/^\d{13,19}$/.test(cleanedInput)) {
    return false;
  }
  
  // Implement Luhn algorithm for credit card validation
  return luhnCheck(cleanedInput);
};

/**
 * Luhn algorithm implementation for credit card validation
 * @param cardNumber - The credit card number as a string
 * @returns boolean - true if the card number is valid according to Luhn algorithm
 */
const luhnCheck = (cardNumber: string): boolean => {
  let sum = 0;
  let isEven = false;
  
  // Process digits from right to left
  for (let i = cardNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(cardNumber[i], 10);
    
    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    
    sum += digit;
    isEven = !isEven;
  }
  
  return sum % 10 === 0;
};

/**
 * Enhanced credit card validation with card type detection
 * @param input - The credit card number as a string
 * @returns object with validation result and card type
 */
export const validateCreditCard = (input: string) => {
  const cleanedInput = input.replace(/[^0-9]/g, "");
  
  // Basic length and format check
  if (!/^\d{13,19}$/.test(cleanedInput)) {
    return {
      isValid: false,
      cardType: 'unknown',
      error: 'Invalid card number format'
    };
  }
  
  // Luhn algorithm check
  if (!luhnCheck(cleanedInput)) {
    return {
      isValid: false,
      cardType: 'unknown',
      error: 'Invalid card number (Luhn check failed)'
    };
  }
  
  // Detect card type based on BIN (Bank Identification Number)
  const cardType = detectCardType(cleanedInput);
  
  return {
    isValid: true,
    cardType,
    error: null
  };
};

/**
 * Detect credit card type based on BIN patterns
 * @param cardNumber - The credit card number as a string
 * @returns string - The detected card type
 */
const detectCardType = (cardNumber: string): string => {
  const firstDigit = cardNumber[0];
  const firstTwoDigits = cardNumber.substring(0, 2);
  const firstFourDigits = cardNumber.substring(0, 4);
  const firstThreeDigits = cardNumber.substring(0, 3);
  
  // Visa: starts with 4
  if (firstDigit === '4') {
    return 'visa';
  }
  
  // Mastercard: starts with 5 or 2
  if (firstDigit === '5' || (firstTwoDigits >= '22' && firstTwoDigits <= '27')) {
    return 'mastercard';
  }
  
  // American Express: starts with 34 or 37
  if (firstTwoDigits === '34' || firstTwoDigits === '37') {
    return 'amex';
  }
  
  // Discover: starts with 6011, 65, or 644-649
  if (firstFourDigits === '6011' || firstTwoDigits === '65' || 
      (firstThreeDigits >= '644' && firstThreeDigits <= '649')) {
    return 'discover';
  }
  
  // Diners Club: starts with 300-305, 36, or 38
  if ((firstThreeDigits >= '300' && firstThreeDigits <= '305') || 
      firstTwoDigits === '36' || firstTwoDigits === '38') {
    return 'diners';
  }
  
  // JCB: starts with 35
  if (firstTwoDigits === '35') {
    return 'jcb';
  }
  
  return 'unknown';
};

export const isValidCreditCardExpirationDate = (input: string) => {
  // simple expiration date format check
  const regex = /^(0[1-9]|1[0-2])\/?([0-9]{4}|[0-9]{2})$/;
  return regex.test(input);
};

export const isValidCreditCardCVVOrCVC = (input: string) => {
  // simple CVV or CVC format check
  const regex = /^[0-9]{3,4}$/;
  return regex.test(input);
};
