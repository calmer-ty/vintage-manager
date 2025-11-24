"use client";

import { createContext, useContext, useState } from "react";
import { getNowDate } from "@/lib/date";

import type { ReactNode } from "react";

interface DateSelectContextType {
  selectedYear: number;
  selectedMonth: number;
  setSelectedYear: React.Dispatch<React.SetStateAction<number>>;
  setSelectedMonth: React.Dispatch<React.SetStateAction<number>>;
}

const { year, month } = getNowDate();
const DateSelectorContext = createContext<DateSelectContextType>({
  selectedYear: year,
  selectedMonth: month,
  setSelectedYear: () => {
    throw new Error("setSelectedYear is not implemented");
  },
  setSelectedMonth: () => {
    throw new Error("setSelectedMonth is not implemented");
  },
});

export const DateSelectProvider = ({ children }: { children: ReactNode }) => {
  const [selectedYear, setSelectedYear] = useState(year);
  const [selectedMonth, setSelectedMonth] = useState(month);

  return (
    <DateSelectorContext.Provider value={{ selectedYear, setSelectedYear, selectedMonth, setSelectedMonth }}>
      {children}
    </DateSelectorContext.Provider>
  );
};

// 커스텀 훅으로 간편하게 사용 가능
export const useDateSelect = () => useContext(DateSelectorContext);
