import IncomeTable from "./table";
import IncomeChart from "./chart";

export default function IncomePage({ userId }: { userId: string }) {
  return (
    <article className="w-screen h-screen flex justify-center items-center gap-4 bg-gray-100">
      <IncomeTable userId={userId} />
      <IncomeChart />
    </article>
  );
}
