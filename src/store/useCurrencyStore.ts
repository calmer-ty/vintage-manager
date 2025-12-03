import { create } from "zustand";

interface ICurrencyState {
  viewCurrency: string;
  setViewCurrency: (currency: string) => void;
}
export const useCurrencyStore = create<ICurrencyState>((set) => ({
  viewCurrency: "KRW",
  setViewCurrency: (currency) => set({ viewCurrency: currency }),
}));
