import { useState } from "react";

import { useUserItems } from "@/hooks/useUserItems";

import DashboardSelect from "./select";
import DashBoardChart from "./chart";
import DashBoardStatus from "./status";

import { IUserID } from "@/types";
import { getNowDate } from "@/lib/date";

export default function DashBoardUI({ uid }: IUserID) {
  const { year, month } = getNowDate();
  const [selectedYear, setSelectedYear] = useState(year);
  const [selectedMonth, setSelectedMonth] = useState(month);

  const { items } = useUserItems({ uid, selectedYear, selectedMonth });

  // 이번 달 마지막 날짜 구하기
  const lastDay = new Date(selectedYear, selectedMonth, 0).getDate();
  // 1일부터 마지막 날짜까지 배열 만들기
  const totalDays = Array.from({ length: lastDay }, (_, i) => {
    const day = i + 1;
    return { date: `${selectedYear}-${String(selectedMonth).padStart(2, "0")}-${String(day).padStart(2, "0")}` };
  });

  return (
    <article className="grid gap-6 w-full px-20">
      <DashboardSelect selectedYear={selectedYear} setSelectedYear={setSelectedYear} selectedMonth={selectedMonth} setSelectedMonth={setSelectedMonth} />
      <DashBoardStatus items={items} />
      <DashBoardChart items={items} totalDays={totalDays} selectedYear={selectedYear} selectedMonth={selectedMonth} />
    </article>
  );
}
