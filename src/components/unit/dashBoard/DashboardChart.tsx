import { useMemo, useState } from "react";

import { useGradeDialogStore } from "@/store/useGradeDialogStore";
import { useUserDataStore } from "@/store/useUserDataStore";
import { getDateString, getDaysOfCurrentMonth } from "@/lib/date";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import type { ISalesProduct } from "@/types";
import type { ChartConfig } from "@/components/ui/chart";
import type { Timestamp } from "firebase/firestore";
interface IDashBoardChartProps {
  selectedYear: number;
  selectedMonth: number;
  products: ISalesProduct[];
}

const chartConfig = {
  // views: {
  //   label: "Page Views",
  // },
  cost: {
    label: "매입",
    color: "var(--chart-1)",
  },
  sold: {
    label: "매출",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

export default function DashBoardChart({ selectedYear, selectedMonth, products }: IDashBoardChartProps) {
  const [activeChart, setActiveChart] = useState<keyof typeof chartConfig>("cost");
  const daysOfCurrentMonth = getDaysOfCurrentMonth(selectedYear, selectedMonth);

  const { userData } = useUserDataStore();
  const { openDialog } = useGradeDialogStore();

  // 판매/판매완료 된 상품들의 날짜를 추출
  const costDays = products
    .filter((product) => product.soldAt === null)
    .map((product) => getDateString((product.createdAt as Timestamp).toDate()));

  const soldDays = products
    .filter((product) => product.soldAt !== null)
    .map((product) => getDateString((product.soldAt as Timestamp).toDate()));

  // 날짜를 키값으로 하여 그 날짜에 팔린/판매중인 상품이 몇 개가 해당되는지 카운트하는 함수
  const countByDate = (days: string[]) =>
    days.reduce<Record<string, number>>((acc, curr) => {
      // acc: 누적값, curr: 현재값
      if (acc[curr]) {
        acc[curr] += 1;
      } else {
        acc[curr] = 1;
      }
      return acc;
    }, {});

  const costDaysCount = countByDate(costDays);
  const soldDaysCount = countByDate(soldDays);

  //  모든 날짜에 카운트된 데이터 대입하여 덮기
  const dailyStats = daysOfCurrentMonth.map((day) => ({
    ...day,
    cost: costDaysCount[day.date] ?? 0,
    sold: soldDaysCount[day.date] ?? 0,
  }));

  // prettier-ignore
  const total = useMemo(() => ({
    cost: dailyStats.reduce((acc, curr) => acc + curr.cost, 0),
    sold: dailyStats.reduce((acc, curr) => acc + curr.sold, 0),
  }),[dailyStats]
);

  return (
    <div className="relative mt-6">
      {userData?.grade === "free" && (
        <Button className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-100" onClick={openDialog}>
          업그레이드 필요
        </Button>
      )}
      <Card className={`pt-0 ${userData?.grade === "free" && "blur-sm pointer-events-none"}`}>
        <CardHeader className="flex flex-col items-stretch border-b !p-0 sm:flex-row">
          <div className="flex flex-1 flex-col justify-center gap-1 px-6 pt-4 pb-3 sm:!py-0">
            <CardTitle>
              {selectedYear}년 {selectedMonth}월 거래 요약
            </CardTitle>
            <CardDescription>총 매입 및 매출 금액을 요약합니다.</CardDescription>
          </div>
          <div className="flex">
            {["cost", "sold"].map((key) => {
              const chart = key as keyof typeof chartConfig;
              return (
                <button
                  key={chart}
                  data-active={activeChart === chart}
                  className="data-[active=true]:bg-muted/50 relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l sm:border-t-0 sm:border-l sm:px-8 sm:py-6"
                  onClick={() => setActiveChart(chart)}
                >
                  <span className="text-muted-foreground text-xs">{chartConfig[chart].label}</span>
                  <span className="text-lg leading-none font-bold sm:text-3xl">{total[key as keyof typeof total].toLocaleString()}</span>
                </button>
              );
            })}
          </div>
        </CardHeader>
        <CardContent className="px-2 sm:p-6">
          <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
            <BarChart
              accessibilityLayer
              data={dailyStats}
              margin={{
                left: 12,
                right: 12,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  });
                }}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    className="w-[150px]"
                    nameKey="views"
                    labelFormatter={(value) => {
                      return new Date(value).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      });
                    }}
                  />
                }
              />
              <Bar dataKey={activeChart} fill={`var(--color-${activeChart})`} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
