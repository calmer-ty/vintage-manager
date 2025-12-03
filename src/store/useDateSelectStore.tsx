import { create } from "zustand";

import { getNowDate } from "@/lib/date";

interface IDateSelectState {
  selectedYear: number;
  selectedMonth: number;
  setSelectedYear: (year: number) => void;
  setSelectedMonth: (month: number) => void;
}

const { year, month } = getNowDate();

export const useDateSelectStore = create<IDateSelectState>((set) => ({
  selectedYear: year,
  selectedMonth: month,
  setSelectedYear: (selectedYear) => set({ selectedYear }),
  setSelectedMonth: (selectedMonth) => set({ selectedMonth }),
}));
