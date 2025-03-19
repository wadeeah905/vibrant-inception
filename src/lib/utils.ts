
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Function to truncate text with ellipsis
export function truncateText(text: string, maxLength: number) {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

// Function to get pluralized text based on count
export function pluralize(count: number, singular: string, plural: string) {
  return count === 1 ? singular : plural;
}

// Function to format price
export function formatPrice(price: number) {
  return new Intl.NumberFormat('fr-TN', {
    style: 'currency',
    currency: 'TND',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
}

// Custom product ordering function
export function customProductSort(products: any[]) {
  const productOrder: {[key: string]: number} = {
    'Coffret Dattes 1kg (Bleu)': 1,
    'Coffret Dattes 500g (Vert)': 2,
    'Paquet Dattes 1kg': 3,
    'Paquet Dattes 500g': 4,
    'Barquette Dattes Dénoyautées 500g': 5,
    'Barquette Dattes Dénoyautées 200g': 6,
    'Figues Séchées 200g': 7,
    'Figues Toujane 200g': 8,
    'Figues djebaa 200g': 9,
    'Sirop de Dattes 340ml': 10,
    'Poudre (Sucre) de Dattes 300g': 11,
    'Café de Noyaux de Dattes 200g': 12,
    'Figues Séchées en Vrac': 13,
    'Dattes Standard Dénoyautées 5kg/10kg': 14
  };
  
  return [...products].sort((a, b) => {
    const orderA = productOrder[a.title] || 999;
    const orderB = productOrder[b.title] || 999;
    return orderA - orderB;
  });
}
