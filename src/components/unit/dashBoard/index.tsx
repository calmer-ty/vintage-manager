import DashBoardChart from "./chart";
import DashBoardStatus from "./status";

export default function DashBoardUI() {
  return (
    <article className="grid gap-6 w-full px-20">
      <DashBoardStatus />
      <DashBoardChart />
    </article>
  );
}
