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
  PKR: {
    code: 'PKR',
    name: 'Pakistani Rupee',
    symbol: '₨',
    exchange_rate: 0.0036,
  },
  TRY: {
    code: 'TRY',
    name: 'Turkish Lira',
    symbol: '₺',
    exchange_rate: 0.033,
  },
};

export const DEFAULT_CURRENCY = 'AFN';

export const formatCurrency = (amount: number, currency: string = DEFAULT_CURRENCY): string => {
  const currencyData = CURRENCIES[currency] || CURRENCIES[DEFAULT_CURRENCY];
  return `${currencyData.symbol}${amount.toLocaleString()}`;
};

export const convertCurrency = (amount: number, fromCurrency: string, toCurrency: string): number => {
  const from = CURRENCIES[fromCurrency] || CURRENCIES[DEFAULT_CURRENCY];
  const to = CURRENCIES[toCurrency] || CURRENCIES[DEFAULT_CURRENCY];
  return (amount * from.exchange_rate) / to.exchange_rate;
};
