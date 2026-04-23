// src/lib/constants/currencies.ts
export interface Currency {
  code: string;
  name: string;
  symbol: string;
  exchange_rate: number; // to USD
}

export const CURRENCIES: Record<string, Currency> = {
  AFN: {
    code: 'AFN',
    name: 'Afghan Afghani',
    symbol: '؋',
    exchange_rate: 0.012,
  },
  USD: {
    code: 'USD',
    name: 'US Dollar',
    symbol: '$',
    exchange_rate: 1,
  },
  
};

export const DEFAULT_CURRENCY = 'AFN';

export const formatCurrency = (amount: number, currency: string = DEFAULT_CURRENCY): string => {
  const currencyData = CURRENCIES[currency] || CURRENCIES[DEFAULT_CURRENCY];
  
  // Use basic number formatting to avoid hydration errors
  // Always use Western Arabic numerals (0-9) for consistency between server and client
  const formattedAmount = amount.toLocaleString('en-US');
  
  return `${currencyData.symbol}${formattedAmount}`;
};

export const convertCurrency = (amount: number, fromCurrency: string, toCurrency: string): number => {
  const from = CURRENCIES[fromCurrency] || CURRENCIES[DEFAULT_CURRENCY];
  const to = CURRENCIES[toCurrency] || CURRENCIES[DEFAULT_CURRENCY];
  return (amount * from.exchange_rate) / to.exchange_rate;
};
