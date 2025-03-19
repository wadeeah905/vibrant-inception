
/**
 * Utility functions for product title translations
 */

/**
 * Maps French product titles to translation keys
 */
export const getProductTranslationKey = (title: string): string => {
  const titleToKeyMap: Record<string, string> = {
    'Paquet Dattes 1kg': 'dates_package_1kg',
    'Paquet Dattes 500g': 'dates_package_500g',
    'Coffret Dattes 1kg': 'dates_gift_box_1kg',
    'Coffret Dattes 500g': 'dates_gift_box_500g',
    'Barquette Dattes Dénoyautées 500g': 'pitted_dates_tray_500g',
    'Barquette Dattes Dénoyautées 200g': 'pitted_dates_tray_200g',
    'Dattes Standard Dénoyautées 5kg/10kg': 'standard_pitted_dates',
    'Figues ZIDI 200g': 'dried_figs_200g',
    'Figues Séchées en Vrac': 'bulk_dried_figs',
    'Figues Toujane 200g': 'toujane_figs_200g',
    'Figues djebaa 200g': 'djebaa_figs_200g',
    'Café de Noyaux de Dattes 200g': 'date_kernel_coffee_200g',
    'Poudre (Sucre) de Dattes 300g': 'date_powder_sugar_300g',
    'Sirop de Dattes 340ml': 'date_syrup_340ml',
    // For backward compatibility with old titles
    'Coffret Dattes 1kg (Bleu)': 'dates_gift_box_1kg',
    'Coffret Dattes 500g (Vert)': 'dates_gift_box_500g',
    'Figues Séchées 200g': 'dried_figs_200g' // Keep this for backward compatibility
  };

  return titleToKeyMap[title] || '';
};

/**
 * Gets the full translation path for a product title
 * Returns the original title if no translation key is found
 */
export const getProductTranslationPath = (title: string): { key: string, fallback: string } => {
  // Handle old coffret titles (remove color indicators) and old fig names
  let adjustedTitle = title;
  if (title === 'Coffret Dattes 1kg (Bleu)') {
    adjustedTitle = 'Coffret Dattes 1kg';
  } else if (title === 'Coffret Dattes 500g (Vert)') {
    adjustedTitle = 'Coffret Dattes 500g';
  } else if (title === 'Figues Séchées 200g') {
    adjustedTitle = 'Figues ZIDI 200g';
  }
  
  const translationKey = getProductTranslationKey(adjustedTitle);
  return {
    key: translationKey ? `product_names.${translationKey}` : '',
    fallback: adjustedTitle
  };
};
