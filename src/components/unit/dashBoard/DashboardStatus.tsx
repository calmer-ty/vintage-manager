// 라이브러리
import { motion } from "framer-motion";

import { getDisplayPrice } from "@/lib/price";

// 외부 요소
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Boxes, DollarSign, ShoppingCart, TrendingUp, BarChart, Truck, Receipt } from "lucide-react";

import type { ISalesProduct, IPackage } from "@/types";
interface IDashBoardStatusProps {
  packages: IPackage[];
  products: ISalesProduct[];
}

export default function DashBoardStatus({ packages, products }: IDashBoardStatusProps) {
  // soldAt null이 아닌 item 데이터들
  const soldProducts = products.filter((product) => product.soldAt !== null);
  const salesProducts = products.filter((product) => product.soldAt === null);
  const allPackages = packages.flatMap((pkg) => pkg.products);

  // 합산된 상품 매입가/판매가/예상이익 계산
  const totalCost = products.reduce((acc, val) => {
    return acc + val.cost.exchange.krw * val.cost.price;
  }, 0);
  const totalSoldPrice = soldProducts.reduce((acc, val) => {
    return acc + val.sales.price;
  }, 0);

  // 매입시 상품 각각 배송료
  const totalPurchaseShipping = allPackages.reduce((acc, val) => {
    return acc + val.cost.exchange.krw * val.cost.shipping;
  }, 0);
  // 매입시 국제 배송료
  const totalIntlShipping = packages.reduce((acc, val) => {
    return acc + (val.shipping?.exchange.krw ?? 0) * (val.shipping?.amount ?? 0);
  }, 0);
  // 판매시 배송료
  const totalSalesShipping = products.reduce((acc, val) => {
    return acc + val.sales.shipping;
  }, 0);

  // 매입시 수수료
  const totalPurchaseFee = allPackages.reduce((acc, val) => {
    return acc + val.cost.exchange.krw * val.cost.fee;
  }, 0);
  // 판매시 수수료
  const totalSalesFee = products.reduce((acc, val) => {
    return acc + val.sales.fee;
  }, 0);

  // 총 예상 이익
  const totalProfit = soldProducts.reduce((acc, val) => {
    return acc + val.sales.profit;
  }, 0);
  const totalProfitWithIntl = totalProfit - totalIntlShipping;

  console.log("총 예상 이익: ", getDisplayPrice("KRW", totalProfit));
  // console.log("총 국제 배송비: ", getDisplayPrice("KRW", totalIntlShipping));
  // console.log("총 예상 이익 (국제배송비 포함): ", getDisplayPrice("KRW", totalProfitWithIntl));

  // 상단의 상태 값들
  const infoStatus = [
    {
      title: "총 매입금액",
      value: getDisplayPrice("KRW", totalCost),
      icon: <ShoppingCart className="shrink-0 text-red-500" />,
    },
    {
      title: "총 배송료",
      value: getDisplayPrice("KRW", totalPurchaseShipping + totalIntlShipping + totalSalesShipping),
      icon: <Truck className="shrink-0 text-red-500" />,
    },
    {
      title: "총 수수료",
      value: getDisplayPrice("KRW", totalPurchaseFee + totalSalesFee),
      icon: <Receipt className="shrink-0 text-red-500" />,
    },
    {
      title: "총 매출",
      value: getDisplayPrice("KRW", totalSoldPrice),
      icon: <DollarSign className="shrink-0 text-green-500" />,
    },
    {
      title: "총 예상 이익",
      value: getDisplayPrice("KRW", totalProfitWithIntl),
      icon: <TrendingUp className="shrink-0 text-blue-500" />,
    },
    {
      title: "입고 수량",
      value: `${allPackages.length} 개`,
      icon: <ShoppingCart className="shrink-0 text-red-500" />,
    },
    {
      title: "판매 완료 수량",
      value: `${soldProducts.length} 개`,
      icon: <BarChart className="shrink-0 text-green-500" />,
    },
    {
      title: "보유 수량",
      value: `${salesProducts.length} 개`,
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
