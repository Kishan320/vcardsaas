import { computed } from 'vue';

export interface CurrencyOptions {
  showSymbol?: boolean;
  showCode?: boolean;
}

export function useCurrency() {
  // Get currency settings from global settings
  const currencySettings = computed(() => {
    if (typeof window !== 'undefined' && window.appSettings?.currencySettings) {
      return window.appSettings.currencySettings;
    }
    
    // Fallback defaults
    return {
      decimalFormat: '2',
      defaultCurrency: 'USD',
      decimalSeparator: '.',
      thousandsSeparator: ',',
      floatNumber: true,
      currencySymbolSpace: false,
      currencySymbolPosition: 'before',
      currencySymbol: '$',
      currencyCode: 'USD',
      currencyName: 'US Dollar'
    };
  });

  // Format currency using global settings
  const formatCurrency = (amount: number | string, options: CurrencyOptions = { showSymbol: true, showCode: false }) => {
    if (typeof window !== 'undefined' && window.appSettings?.formatCurrency) {
      return window.appSettings.formatCurrency(amount, options);
    }
    
    // Fallback formatting
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : Number(amount);
    if (isNaN(numAmount)) return '0';
    
    const formatted = numAmount.toFixed(2);
    return options.showSymbol ? `$${formatted}` : formatted;
  };

  // Get currency symbol
  const getCurrencySymbol = () => {
    return currencySettings.value.currencySymbol;
  };

  // Get currency code
  const getCurrencyCode = () => {
    return currencySettings.value.currencyCode;
  };

  // Get currency name
  const getCurrencyName = () => {
    return currencySettings.value.currencyName;
  };

  // Format price with currency (most common use case)
  const formatPrice = (price: number | string) => {
    return formatCurrency(price, { showSymbol: true, showCode: false });
  };

  // Format amount without symbol
  const formatAmount = (amount: number | string) => {
    return formatCurrency(amount, { showSymbol: false, showCode: false });
  };

  return {
    currencySettings,
    formatCurrency,
    formatPrice,
    formatAmount,
    getCurrencySymbol,
    getCurrencyCode,
    getCurrencyName
  };
}