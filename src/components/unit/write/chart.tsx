import { LineChart } from "@mui/x-charts/LineChart";

export default function ItemChart() {
  return (
    <section className="flex flex-col gap-4 p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
      <LineChart
        xAxis={[{ data: [1, 2, 3, 5, 8, 10] }]}
        series={[
          {
            data: [2, 5.5, 2, 8.5, 1.5, 5],
          },
        ]}
        height={300}
        className="bg-white"
      />
    </section>
  );
}
