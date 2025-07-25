import { useState } from "react";

import { useUserItems } from "@/hooks/useUserItems";

import DashboardSelect from "./select";
import DashBoardChart from "./chart";
import DashBoardStatus from "./status";

import { IUserID } from "@/types";

// 현재 '월'에 대한 모든 '일' 생성
const now = new Date();
const year = now.getFullYear();
const month = now.getMonth() + 1;

export default function DashBoardUI({ uid }: IUserID) {
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
