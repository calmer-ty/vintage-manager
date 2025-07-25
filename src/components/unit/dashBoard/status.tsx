import { motion } from "framer-motion";

import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { DollarSign, TrendingUp } from "lucide-react";
import { IItemData } from "@/types";

export default function DashBoardStatus({ items }: { items: IItemData[] }) {
  // soldAt null이 아닌 item 데이터들
  const soldItems = items.filter((item) => item.soldAt !== null);
  // items의 특정 키의 값들을 모두 더하여 합한 값을 계산하는 함수
  function sumField(items: IItemData[], field: keyof IItemData) {
    let sum = 0;

    for (const item of items) {
      const value = item[field];

      // undefined나 null일 경우 0으로 처리
      if (value != null) {
        sum += Number(value);
      }
    }

    return sum;
  }
  const totalCostPriceKRW = sumField(items, "costPriceKRW");
  const totalSalePrice = sumField(soldItems, "salePrice");
  const totalProfit = sumField(soldItems, "profit");

  // 상단의 상태 값들
  const infoStatus = [
    {
      title: "총 매입",
      value: `₩ ${totalCostPriceKRW.toLocaleString()}`,
      icon: <DollarSign className="shrink-0 text-green-600" />,
    },
    {
      title: "총 매출",
      value: `₩ ${totalSalePrice.toLocaleString()}`,
      icon: <DollarSign className="shrink-0 text-green-600" />,
    },
    {
      title: "총 예상 이익",
      value: `₩ ${totalProfit.toLocaleString()}`,
      icon: <DollarSign className="shrink-0 text-green-600" />,
    },
    {
      title: "총 판매량",
      value: `${soldItems.length} 개`,
      icon: <TrendingUp className="shrink-0 text-purple-600" />,
    },
  ];

  const MotionCard = motion(Card);

  return (
    <div className="flex gap-6">
      {infoStatus.map((el, index) => (
        <MotionCard
          key={el.title}
          className="w-full hover:shadow-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.4 }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          layout
        >
          {/* <CardHeader className="flex items-center gap-3"></CardHeader> */}
          <CardContent>
            <div className="flex items-center gap-6">
              <div className="p-3 bg-gray-100 rounded-lg">{el.icon}</div>
              <CardTitle className="grid gap-1">
                <p className="text-2xl text-right font-bold">{el.value}</p>
                <span className="text-muted-foreground text-sm">{el.title}</span>
              </CardTitle>
            </div>
          </CardContent>
        </MotionCard>
      ))}
    </div>
  );
}
