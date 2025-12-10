import { getDisplayPrice } from "@/lib/price";

import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Boxes, DollarSign, ShoppingCart, TrendingUp, BarChart, Truck, Receipt } from "lucide-react";
import ChildrenTooltip from "@/components/commons/ChildrenTooltip";

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

  // 1. 총 매입 관련
  const totalPurchaseCost = products.reduce((acc, val) => acc + val.cost.exchange.krw * val.cost.price, 0);
  const totalPurchaseShipping = allPackages.reduce((acc, val) => acc + val.cost.exchange.krw * val.cost.shipping, 0);
  const totalPurchaseFee = allPackages.reduce((acc, val) => acc + val.cost.exchange.krw * val.cost.fee, 0);
  const totalIntlShipping = packages.reduce((acc, val) => acc + (val.shipping?.exchange.krw ?? 0) * (val.shipping?.amount ?? 0), 0);

  // 2. 총 판매 완료 관련
  const totalSoldFee = soldProducts.reduce((acc, val) => acc + val.sales.fee, 0);
  const totalSoldShipping = soldProducts.reduce((acc, val) => acc + val.sales.shipping, 0);
  const totalSoldRevenue = soldProducts.reduce((acc, val) => acc + val.sales.price, 0);
  const soldProfit = soldProducts.reduce((acc, val) => acc + val.sales.profit, 0);

  // 3. 총 이익 - 판매된 제품 이익(profit은 판매 관련 비용만 뺌) - 매입 제품 비용 - 매입 제품 배송료 - 매입 제품 수수료 - 매입 국제 수수료
  const totalProfit = soldProfit - totalPurchaseCost - totalPurchaseShipping - totalPurchaseFee - totalIntlShipping;

  // 상단의 상태 값들
  const infoStatus = [
    {
      title: "총 매입 금액",
      value: getDisplayPrice("KRW", totalPurchaseCost),
      icon: <ShoppingCart className="shrink-0 text-red-500" />,
    },
    {
      title: "총 배송료",
      value: getDisplayPrice("KRW", totalPurchaseShipping + totalIntlShipping + totalSoldShipping),
      icon: <Truck className="shrink-0 text-red-500" />,
      tooltip: `
        매입 배송료: ${getDisplayPrice("KRW", totalPurchaseShipping)} +
        국제 배송료: ${getDisplayPrice("KRW", totalIntlShipping)} +
        판매 배송료: ${getDisplayPrice("KRW", totalSoldShipping)}`,
    },
    {
      title: "총 수수료",
      value: getDisplayPrice("KRW", totalPurchaseFee + totalSoldFee),
      icon: <Receipt className="shrink-0 text-red-500" />,
      tooltip: `
        매입 수수료: ${getDisplayPrice("KRW", totalPurchaseFee)} +
        판매 수수료: ${getDisplayPrice("KRW", totalSoldFee)}`,
    },
    {
      title: "총 매출",
      value: getDisplayPrice("KRW", totalSoldRevenue),
      icon: <DollarSign className="shrink-0 text-green-500" />,
    },
    {
      title: "총 이익",
      value: getDisplayPrice("KRW", totalProfit),
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

  return (
    <div className="grid grid-cols-2 2xl:grid-cols-4 gap-5 w-full">
      {infoStatus.map((el) => (
        <Card
          key={el.title}
          className="w-full group py-4 lg:py-6
          transition-shadow duration-300 ease-in-out hover:shadow-md"
        >
          <ChildrenTooltip content={el.tooltip}>
            <CardContent className="flex flex-col lg:flex-row items-center gap-x-6 gap-y-2">
              <div
                className="p-2 lg:p-3 rounded-lg bg-gray-100 dark:bg-gray-700 shadow-md
                transition-bg duration-300 ease-in-out"
              >
                {el.icon}
              </div>
              <div className="grid gap-1 w-full text-center lg:text-left">
                <CardTitle className="text-xl lg:text-2xl">{el.value}</CardTitle>
                <CardDescription>{el.title}</CardDescription>
              </div>
            </CardContent>
          </ChildrenTooltip>
        </Card>
      ))}
    </div>
  );
}
