import { useState } from "react";
import { motion } from "framer-motion";

import { useCurrency } from "@/contexts/currencyContext";
import { getDisplayPrice, getExchangeDisplayPrice } from "@/lib/price";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp } from "lucide-react";

import type { IPurchaseProduct } from "@/types";
interface ITableItemProps {
  products: IPurchaseProduct[];
}

export default function TableItem({ products }: ITableItemProps) {
  const { viewCurrency } = useCurrency();

  const [isBasicOpen, setIsBasicOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState<"shipping" | "fee" | null>(null);
  const [first, ...rest] = products;

  const priceSum = products.reduce((acc, val) => {
    return acc + val.cost.price;
  }, 0);
  const shippingSum = products.reduce((acc, val) => {
    return acc + val.cost.shipping;
  }, 0);
  const feeSum = products.reduce((acc, val) => {
    return acc + val.cost.fee;
  }, 0);

  return (
    <Card key={`${first.name}_${first.brand}`} className="overflow-hidden p-0">
      <CardContent className="p-0">
        {/* 패키지 기본 정보 */}
        <Collapsible open={isBasicOpen} onOpenChange={setIsBasicOpen} className="flex flex-col px-4 py-2">
          <h3 className="pb-1 border-b border-dotted border-gray-300 font-bold text-left">상품 목록</h3>
          {rest.length !== 0 ? (
            // products가 n개일 경우
            <>
              <div key={`${first.name}_${first.brand}`} className="flex justify-between gap-4 py-2 text-sm text-black">
                <span>
                  {first.name} ({first.brand || "브랜드 없음"})
                </span>
                <span className="flex items-center gap-1">
                  {getDisplayPrice(first.cost.exchange.code, first.cost.price)}
                  <em className="text-xs not-italic text-gray-500">
                    ({getExchangeDisplayPrice(viewCurrency, first.cost.price, first.cost.exchange)})
                  </em>
                </span>
              </div>

              {/* 패키지 리스트 문장 */}
              <motion.div
                animate={{ height: isBasicOpen ? "auto" : 0, opacity: isBasicOpen ? 1 : 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <CollapsibleContent className="flex flex-col">
                  {rest.map((p, idx) => {
                    return (
                      <div
                        key={`${p.name}_${p.brand}_${idx}`}
                        className="flex justify-between gap-4 py-2 border-t border-dotted border-gray-300 text-sm text-black"
                      >
                        <span>
                          {p.name}({p.brand || "브랜드 없음"})
                        </span>
                        <span className="">
                          {getDisplayPrice(p.cost.exchange.code, p.cost.price)}
                          <em className="ml-1 text-xs not-italic text-gray-500">
                            ({getExchangeDisplayPrice(viewCurrency, p.cost.price, p.cost.exchange)})
                          </em>
                        </span>
                      </div>
                    );
                  })}
                  <div className="pt-2 pb-1 border-t-1 border-gray-300 text-right text-black">
                    <span className="mr-1 font-bold">총 매입가:</span>
                    <span>
                      {getDisplayPrice(products[0].cost.exchange.code, priceSum)}
                      <em className="ml-1 text-xs not-italic text-gray-500">
                        ({getExchangeDisplayPrice(viewCurrency, priceSum, products[0].cost.exchange)})
                      </em>
                    </span>
                  </div>
                </CollapsibleContent>
              </motion.div>

              <CollapsibleTrigger asChild>
                <Button variant="secondary" size="icon" className="self-center w-fit mt-2 px-2">
                  {isBasicOpen ? <ChevronUp /> : <ChevronDown />}
                  <span className="">{isBasicOpen ? "닫기" : "더보기"}</span>
                </Button>
              </CollapsibleTrigger>
            </>
          ) : (
            // products가 한개일 경우
            <div key={`${first.name}_${first.brand}`} className="flex justify-between gap-4 py-2 text-sm text-black">
              <span>
                {first.name}({first.brand || "브랜드 없음"})
              </span>
              <div className="flex flex-col gap-0.5 text-left">
                <span>
                  {getDisplayPrice(first.cost.exchange.code, first.cost.price)}
                  <em className="text-xs not-italic text-gray-500 ml-1">
                    ({getExchangeDisplayPrice(viewCurrency, first.cost.price, first.cost.exchange)})
                  </em>
                </span>
              </div>
            </div>
          )}
        </Collapsible>
        {/* 패키지 배송 정보 */}
        <Collapsible
          open={isDetailsOpen !== null}
          onOpenChange={(isOpen) => {
            if (!isOpen) setIsDetailsOpen(null); // 닫으면 타입 초기화
          }}
          className="flex w-full flex-col border-t"
        >
          <div className="flex gap-2 justify-end px-4 py-1 bg-gray-200">
            <Button
              variant={isDetailsOpen === "shipping" ? "secondary" : "ghost"}
              size="icon"
              className="w-auto px-1 "
              onClick={() => setIsDetailsOpen((prev) => (prev === "shipping" ? null : "shipping"))}
            >
              {isDetailsOpen === "shipping" ? <ChevronUp /> : <ChevronDown />}
              <span>배송료</span>
            </Button>

            <Button
              variant={isDetailsOpen === "fee" ? "secondary" : "ghost"}
              size="icon"
              className="w-auto px-1 "
              onClick={() => setIsDetailsOpen((prev) => (prev === "fee" ? null : "fee"))}
            >
              {isDetailsOpen === "fee" ? <ChevronUp /> : <ChevronDown />}
              <span>수수료</span>
            </Button>
          </div>

          <motion.div
            animate={{ height: isDetailsOpen ? "auto" : 0, opacity: isDetailsOpen ? 1 : 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <CollapsibleContent className="flex flex-col px-4 py-2">
              {products.map((p, idx) => {
                return (
                  <div
                    key={`${p.name}_${p.brand}_${idx}`}
                    className="flex justify-between gap-4 py-2 border-b border-dotted border-gray-300 text-sm text-black"
                  >
                    <span>
                      {p.name} - {p.brand}
                    </span>
                    <span className="flex items-center gap-1">
                      {isDetailsOpen === "shipping"
                        ? getDisplayPrice(p.cost.exchange.code, p.cost.shipping)
                        : isDetailsOpen === "fee"
                        ? getDisplayPrice(p.cost.exchange.code, p.cost.fee)
                        : "정보 없음"}
                      <em className="text-xs not-italic text-gray-500 ml-1">
                        (
                        {isDetailsOpen === "shipping"
                          ? getExchangeDisplayPrice(viewCurrency, p.cost.shipping, p.cost.exchange)
                          : isDetailsOpen === "fee"
                          ? getExchangeDisplayPrice(viewCurrency, p.cost.fee, p.cost.exchange)
                          : "정보 없음"}
                        )
                      </em>
                    </span>
                  </div>
                );
              })}
              <div className="pt-2 pb-1 text-right">
                <span className="mr-1 font-bold">
                  {isDetailsOpen === "shipping" ? "총 배송료" : isDetailsOpen === "fee" ? "총 수수료" : "정보 없음"}
                </span>
                <span>
                  {isDetailsOpen === "shipping"
                    ? getDisplayPrice(products[0].cost.exchange.code, shippingSum)
                    : isDetailsOpen === "fee"
                    ? getDisplayPrice(products[0].cost.exchange.code, feeSum)
                    : "정보 없음"}
                  <em className="text-xs not-italic text-gray-500 ml-1">
                    (
                    {isDetailsOpen === "shipping"
                      ? getExchangeDisplayPrice(viewCurrency, shippingSum, products[0].cost.exchange)
                      : isDetailsOpen === "fee"
                      ? getExchangeDisplayPrice(viewCurrency, feeSum, products[0].cost.exchange)
                      : "정보 없음"}
                    )
                  </em>
                </span>
              </div>
            </CollapsibleContent>
          </motion.div>
        </Collapsible>
      </CardContent>
    </Card>
  );
}
