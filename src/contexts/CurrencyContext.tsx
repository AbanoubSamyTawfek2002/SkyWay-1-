import React, { createContext, useContext, useState, useEffect } from 'react';

export type CurrencyCode = 'USD' | 'EGP' | 'EUR' | 'AED';

interface CurrencyContextType {
  currency: CurrencyCode;
  setCurrency: (code: CurrencyCode) => void;
  formatPrice: (priceInUSD: number) => string;
  rates: Record<CurrencyCode, number>;
}

const rates: Record<CurrencyCode, number> = {
  USD: 1,
  EGP: 50,
  EUR: 0.92,
  AED: 3.67
};

const currencySymbols: Record<CurrencyCode, string> = {
  USD: '$',
  EGP: 'EGP ',
  EUR: '€',
  AED: 'AED '
};

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currency, setCurrencyState] = useState<CurrencyCode>(() => {
    const saved = localStorage.getItem('skyway_currency');
    return (saved as CurrencyCode) || 'USD';
  });

  const setCurrency = (code: CurrencyCode) => {
    setCurrencyState(code);
    localStorage.setItem('skyway_currency', code);
  };

  const formatPrice = (priceInUSD: number) => {
    const converted = priceInUSD * rates[currency];
    const symbol = currencySymbols[currency];
    
    // Formatting with commas
    const formattedValue = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(converted);

    return currency === 'EGP' || currency === 'AED' 
      ? `${symbol}${formattedValue}`
      : `${symbol}${formattedValue}`;
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatPrice, rates }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) throw new Error('useCurrency must be used within CurrencyProvider');
  return context;
};
