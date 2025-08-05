import { useMemo, useState } from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

import { getDateString } from "@/lib/date";

import type { IItemData } from "@/types";
import type { ChartConfig } from "@/components/ui/chart";
import { motion } from "framer-motion";

// export const description = "An interactive bar chart";
interface IDashBoardChartProps {
  items: IItemData[];
  totalDays: {
    date: string;
  }[];
  selectedYear: number;
  selectedMonth: number;
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

export default function DashBoardChart({ items, totalDays, selectedYear, selectedMonth }: IDashBoardChartProps) {
  const [activeChart, setActiveChart] = useState<keyof typeof chartConfig>("cost");

  const totalItemCost = items.map((item) => {
    const convertedDate = item.createdAt.toDate();
    return {
      date: getDateString(convertedDate),
    };
  });
  const totalItemSold = items
    .filter((item) => item.soldAt != null)
    .map((item) => {
      const convertedDate = item.soldAt!.toDate();
      return {
        date: getDateString(convertedDate),
      };
    });

  const countByDate = (items: { date: string }[]) =>
    items.reduce<Record<string, number>>((acc, cur) => {
      // acc: 누적값, cur: 현재값
      if (acc[cur.date]) {
        acc[cur.date] += 1;
      } else {
        acc[cur.date] = 1;
      }
      return acc;
    }, {});

  const costDays = countByDate(totalItemCost);
  const soldDays = countByDate(totalItemSold);

  //  모든 날짜에 카운트된 데이터 대입하여 덮기
  const mergedDateArray = totalDays.map((day) => ({
    ...day,
    cost: costDays[day.date] ?? 0,
    sold: soldDays[day.date] ?? 0,
  }));

  // prettier-ignore
  const total = useMemo(() => ({
      cost: mergedDateArray.reduce((acc, curr) => acc + curr.cost, 0),
      sold: mergedDateArray.reduce((acc, curr) => acc + curr.sold, 0),
    }),[mergedDateArray]
  );

  const MotionCard = motion(Card);

  return (
    <MotionCard
      className="w-full py-0"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.4 }}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
    >
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
            data={mergedDateArray}
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
    </MotionCard>
  );
}
