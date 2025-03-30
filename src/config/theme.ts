import { type Theme } from '../contexts/ThemeContext';

export const themeConfig = {
  dark: {
    background: 'bg-slate-900',
    backgroundSecondary: 'bg-slate-800',
    backgroundTertiary: 'bg-slate-700',
    backgroundHover: 'hover:bg-slate-700',
    text: 'text-slate-100',
    textSecondary: 'text-slate-300',
    textTertiary: 'text-slate-400',
    border: 'border-slate-700',
    borderSecondary: 'border-slate-600',
    hover: 'hover:bg-slate-700',
    input: 'bg-slate-800 border-slate-600 text-slate-100 placeholder:text-slate-500 focus:border-primary-500 focus:ring-1 focus:ring-primary-500/20 rounded-lg border',
    button: {
      primary: 'bg-primary-600 hover:bg-primary-700 text-white shadow-lg shadow-primary-500/20',
      secondary: 'bg-slate-700 hover:bg-slate-600 text-slate-200 shadow-lg shadow-slate-800/20',
      danger: 'bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-500/20',
      success: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/20',
    },
    card: 'bg-slate-800 border-slate-700 shadow-xl shadow-slate-900/50',
    cardHover: 'hover:bg-slate-700/50',
    stats: {
      background: 'bg-slate-800/50',
      border: 'border-slate-700',
      icon: 'text-primary-400 bg-primary-400/10',
    },
    table: {
      header: 'bg-slate-800 text-slate-300',
      row: 'border-slate-700 hover:bg-slate-700/50',
      cell: 'text-slate-300',
    },
    dropdown: {
      background: 'bg-slate-800',
      hover: 'hover:bg-slate-700',
      border: 'border-slate-700',
      shadow: 'shadow-xl shadow-slate-900/50',
    },
    scrollbar: 'scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800',
  },
  light: {
    background: 'bg-slate-50',
    backgroundSecondary: 'bg-white',
    backgroundTertiary: 'bg-slate-100',
    backgroundHover: 'hover:bg-slate-100',
    text: 'text-slate-900',
    textSecondary: 'text-slate-600',
    textTertiary: 'text-slate-500',
    border: 'border-slate-200',
    borderSecondary: 'border-slate-100',
    hover: 'hover:bg-slate-100',
    input: 'bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-primary-500 focus:ring-1 focus:ring-primary-500/20 rounded-lg border',
    button: {
      primary: 'bg-primary-600 hover:bg-primary-700 text-white shadow-lg shadow-primary-500/20',
      secondary: 'bg-slate-100 hover:bg-slate-200 text-slate-700 shadow-lg shadow-slate-200/20',
      danger: 'bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-500/20',
      success: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/20',
    },
    card: 'bg-white border-slate-200 shadow-lg shadow-slate-200/50',
    cardHover: 'hover:bg-slate-50',
    stats: {
      background: 'bg-white',
      border: 'border-slate-200',
      icon: 'text-primary-600 bg-primary-50',
    },
    table: {
      header: 'bg-slate-50 text-slate-600',
      row: 'border-slate-200 hover:bg-slate-50',
      cell: 'text-slate-600',
    },
    dropdown: {
      background: 'bg-white',
      hover: 'hover:bg-slate-50',
      border: 'border-slate-200',
      shadow: 'shadow-lg shadow-slate-200/50',
    },
    scrollbar: 'scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100',
  }
};

export function getThemeClasses(theme: Theme, component: keyof typeof themeConfig.dark) {
  return themeConfig[theme][component];
}

export function getButtonClasses(theme: Theme, variant: keyof typeof themeConfig.dark.button) {
  return themeConfig[theme].button[variant];
}

export function getStatsClasses(theme: Theme, property: keyof typeof themeConfig.dark.stats) {
  return themeConfig[theme].stats[property];
}

export function getTableClasses(theme: Theme, element: keyof typeof themeConfig.dark.table) {
  return themeConfig[theme].table[element];
}

export function getDropdownClasses(theme: Theme, property: keyof typeof themeConfig.dark.dropdown) {
  return themeConfig[theme].dropdown[property];
}