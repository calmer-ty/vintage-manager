// 라이브러리
import { motion } from "framer-motion";

// 외부 요소
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Boxes, DollarSign, ShoppingCart, TrendingUp } from "lucide-react";

import type { IProduct } from "@/types";

export default function DashBoardStatus({ products }: { products: IProduct[] }) {
  // soldAt null이 아닌 item 데이터들
  const soldItems = products.filter((product) => product.soldAt !== null);

  // items의 특정 키의 값들을 모두 더하여 합한 값을 계산하는 함수
  function sumField(items: IProduct[], field: keyof IProduct) {
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
  const totalCostPriceKRW = sumField(products, "costPriceKRW");
  const totalSalePrice = sumField(soldItems, "salePrice");
  const totalProfit = sumField(soldItems, "profit");

  // 상단의 상태 값들
  const infoStatus = [
    {
      title: "총 매입",
      value: `₩ ${totalCostPriceKRW.toLocaleString()}`,
      icon: <ShoppingCart className="shrink-0 text-red-500" />,
    },
    {
      title: "총 매출",
      value: `₩ ${totalSalePrice.toLocaleString()}`,
      icon: <DollarSign className="shrink-0 text-green-500" />,
    },
    {
      title: "총 예상 이익",
      value: `₩ ${totalProfit.toLocaleString()}`,
      icon: <TrendingUp className="shrink-0 text-blue-500" />,
    },
    {
      title: "총 판매량",
      value: `${soldItems.length} 개`,
      icon: <Boxes className="shrink-0 text-yellow-500" />,
    },
    {
      title: "준비중 1",
      value: `${soldItems.length} 개`,
      icon: <Boxes className="shrink-0 text-yellow-500" />,
    },
    {
      title: "준비중 2",
      value: `${soldItems.length} 개`,
      icon: <Boxes className="shrink-0 text-yellow-500" />,
    },
  ];

  const MotionCard = motion(Card);

  return (
    <div
      className="grid gap-5 w-full 
        grid-cols-2 2xl:grid-cols-3"
    >
      {infoStatus.map((el, idx) => (
        <MotionCard
          key={el.title}
          className="w-full group
            transition-shadow duration-300 ease-in-out hover:shadow-md 
            py-4 lg:py-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1, duration: 0.4 }}
        >
          <CardContent
            className="flex items-center gap-x-6 gap-y-2 
              flex-col lg:flex-row"
          >
            <div
              className="rounded-lg
                p-2 lg:p-3
                transition-bg duration-300 ease-in-out bg-gray-100 group-hover:bg-gray-200 shadow-md"
            >
              {el.icon}
            </div>
            <div className="grid gap-1 w-full text-center lg:text-left">
              <CardTitle className="text-xl lg:text-2xl">{el.value}</CardTitle>
              <CardDescription>{el.title}</CardDescription>
            </div>
          </CardContent>
        </MotionCard>
      ))}
    </div>
  );
}
