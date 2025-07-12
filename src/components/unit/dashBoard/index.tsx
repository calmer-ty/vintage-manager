import { useUserItems } from "@/hooks/useUserItems";

import DashBoardChart from "./chart";
import DashBoardStatus from "./status";

import { IUserID } from "@/types";

export default function DashBoardUI({ uid }: IUserID) {
  const { items } = useUserItems({ uid });

  const soldItems = items.filter((item) => item.isSold === true);

  return (
    <article className="grid gap-6 w-full px-20">
      <DashBoardStatus soldItems={soldItems} />
      <DashBoardChart />
    </article>
  );
}
