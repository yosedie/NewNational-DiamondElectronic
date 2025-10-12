/**
 * Formats a number with Indonesian locale formatting (thousand separators)
 * @param value - The number to format
 * @returns Formatted string with thousand separators
 */
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('id-ID').format(value);
};

/**
 * Formats any number with thousand separators using Indonesian locale
 * @param value - The number to format
 * @returns Formatted string with thousand separators
 */
export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('id-ID').format(value);
};