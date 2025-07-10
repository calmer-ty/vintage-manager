import { motion } from "framer-motion";

import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { DollarSign, ShoppingCart, TrendingUp } from "lucide-react";
import { IItemData } from "@/types";

export default function DashBoardStatus({ soldItems }: { soldItems: IItemData[] }) {
  const soldItemPrices = soldItems.map((item) => Number(item.priceKRW.replace(/,/g, "")));
  const soldItemPriceSum = soldItemPrices.reduce((acc, cur) => acc + cur, 0);

  const infoStatus = [
    {
      title: "총 매출",
      value: `₩ ${soldItemPriceSum.toLocaleString()}`,
      icon: <DollarSign className="shrink-0 text-green-600" />,
    },
    {
      title: "총 판매량",
      value: "412개",
      icon: <TrendingUp className="shrink-0 text-purple-600" />,
    },
    {
      title: "가장 많이 팔린 품목",
      value: "상의",
      icon: <ShoppingCart className="shrink-0 text-blue-600" />,
    },
    {
      title: "가장 적게 팔린 품목",
      value: "하의",
      icon: <ShoppingCart className="shrink-0 text-blue-600" />,
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
