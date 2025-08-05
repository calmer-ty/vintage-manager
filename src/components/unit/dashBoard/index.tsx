import { useUserItems } from "@/hooks/useUserItems";
import { useDateSelector } from "@/contexts/dateSelectorContext";

import DashBoardChart from "./chart";
import DashBoardStatus from "./status";

import type { IUserID } from "@/types";

export default function DashBoardUI({ uid }: IUserID) {
  const { selectedYear, selectedMonth } = useDateSelector();
  const { items } = useUserItems({ uid, selectedYear, selectedMonth });

  // 이번 달 마지막 날짜 구하기
  const lastDay = new Date(selectedYear, selectedMonth, 0).getDate();
  // 1일부터 마지막 날짜까지 배열 만들기
  const totalDays = Array.from({ length: lastDay }, (_, i) => {
    const day = i + 1;
    return { date: `${selectedYear}-${String(selectedMonth).padStart(2, "0")}-${String(day).padStart(2, "0")}` };
  });

  return (
    <article className="grid px-8 lg:px-18">
      <DashBoardStatus items={items} />
      <DashBoardChart items={items} totalDays={totalDays} selectedYear={selectedYear} selectedMonth={selectedMonth} />
    </article>
  );
}
