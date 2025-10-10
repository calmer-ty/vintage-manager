// 라이브러리
import { motion } from "framer-motion";

// 외부 요소
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Boxes, DollarSign, ShoppingCart, TrendingUp, BarChart, Truck } from "lucide-react";

import type { ICurrency, IProduct, IProductPackage } from "@/types";
interface IDashBoardStatusProps {
  products: IProduct[];
  productPackages: IProductPackage[];
}

export default function DashBoardStatus({ products, productPackages }: IDashBoardStatusProps) {
  // soldAt null이 아닌 item 데이터들
  const soldProducts = products.filter((product) => product.soldAt !== null);
  const saleProducts = products.filter((product) => product.soldAt === null);

  // 합산된 패키지 배송비 계산
  const totalShipping = productPackages.reduce((acc, val) => {
    const currency: ICurrency = val.shipping.currency !== "" && JSON.parse(val.shipping.currency);
    const shipping = val.shipping.currency !== "" ? currency.rate * Number(val.shipping.amount) : 0;
    return acc + shipping;
  }, 0);
  // 합산된 상품 매입가/판매가/예상이익 계산
  const totalCost = products.reduce((acc, val) => {
    const currency: ICurrency = JSON.parse(val.costPrice.currency);
    const costPrice = currency.rate * Number(val.costPrice.amount);
    return acc + costPrice;
  }, 0);

  const totalSalePrice = soldProducts.reduce((acc, val) => {
    const salePrice = val.salePrice !== undefined ? Number(val.salePrice) : 0;
    return acc + salePrice;
  }, 0);
  const totalProfit = soldProducts.reduce((acc, val) => {
    const profit = val.profit !== undefined ? val.profit : 0;
    return acc + profit;
  }, 0);

  // 상단의 상태 값들
  const infoStatus = [
    {
      title: "총 매입",
      value: `₩ ${Math.round(totalCost).toLocaleString()}`,
      icon: <ShoppingCart className="shrink-0 text-red-500" />,
    },
    {
      title: "배송비",
      value: `₩ ${Math.round(totalShipping).toLocaleString()}`,
      icon: <Truck className="shrink-0 text-red-500" />,
    },
    {
      title: "총 매출",
      value: `₩ ${Math.round(totalSalePrice).toLocaleString()}`,
      icon: <DollarSign className="shrink-0 text-green-500" />,
    },
    {
      title: "총 예상 이익",
      value: `₩ ${Math.round(totalProfit).toLocaleString()}`,
      icon: <TrendingUp className="shrink-0 text-blue-500" />,
    },
    {
      title: "총 판매량",
      value: `${soldProducts.length} 개`,
      icon: <BarChart className="shrink-0 text-green-500" />,
    },
    {
      title: "남은 재고",
      value: `${saleProducts.length} 개`,
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
