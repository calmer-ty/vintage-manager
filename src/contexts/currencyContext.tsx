"use client";

import { createContext, useState, useContext } from "react";

import type { ReactNode } from "react";
interface CurrencyContextType {
  viewCurrency: string;
  setViewCurrency: (c: string) => void;
}

const CurrencyContext = createContext<CurrencyContextType>({
  viewCurrency: "KRW",
  setViewCurrency: () => {},
});

export const CurrencyProvider = ({ children }: { children: ReactNode }) => {
  const [viewCurrency, setViewCurrency] = useState("KRW");

  return <CurrencyContext.Provider value={{ viewCurrency, setViewCurrency }}>{children}</CurrencyContext.Provider>;
};

export const useCurrency = () => useContext(CurrencyContext);
