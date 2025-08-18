import { useUserItems } from "@/hooks/useUserItems";
import { useDateSelector } from "@/contexts/dateSelectorContext";

import DashBoardChart from "./chart";
import DashBoardStatus from "./status";

import type { IUserID } from "@/types";

export default function DashBoardUI({ uid }: IUserID) {
  const { selectedYear, selectedMonth } = useDateSelector();
  const { items } = useUserItems({ uid, selectedYear, selectedMonth });

  return (
    <article className="w-full px-8 lg:px-18">
      <DashBoardStatus items={items} />
      <DashBoardChart items={items} selectedYear={selectedYear} selectedMonth={selectedMonth} />
    </article>
  );
}
