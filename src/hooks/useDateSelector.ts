import { useState } from "react";

import { getNowDate } from "@/lib/date";

export const useDateSelector = () => {
  const { year, month } = getNowDate();
  const [selectedYear, setSelectedYear] = useState(year);
  const [selectedMonth, setSelectedMonth] = useState(month);

  return { selectedYear, setSelectedYear, selectedMonth, setSelectedMonth };
};
