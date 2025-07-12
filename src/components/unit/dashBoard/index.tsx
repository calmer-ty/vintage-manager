import { useUserItems } from "@/hooks/useUserItems";

import DashBoardChart from "./chart";
import DashBoardStatus from "./status";

import { IUserID } from "@/types";

export default function DashBoardUI({ uid }: IUserID) {
  const { items } = useUserItems({ uid });

  // const soldItems = items.filter((item) => item.isSold === true);

  // console.log("items: ", items);

  return (
    <article className="grid gap-6 w-full px-20">
      <DashBoardStatus itemData={items} />
      <DashBoardChart itemData={items} />
    </article>
  );
}
