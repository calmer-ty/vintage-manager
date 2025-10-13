import { useState } from "react";

import { useCurrency } from "@/contexts/currencyContext";
import { getDisplayPrice, getExchangeDisplayPrice } from "@/lib/price";

import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

import type { IPurchaseProduct } from "@/types";
interface ITableItemProps {
  products: IPurchaseProduct[];
}

export default function TableItem({ products }: ITableItemProps) {
  const { viewCurrency } = useCurrency();

  const [isOpen, setIsOpen] = useState(false);
  const [first, ...rest] = products;

  const costPriceSum = products.reduce((acc, val) => {
    return acc + val.costPrice;
  }, 0);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="flex w-full flex-col px-4 py-2 border border-gray-300 rounded-md bg-white">
      {rest.length !== 0 ? (
        // products가 n개일 경우
        <div className="">
          <div key={`${first.name}_${first.brand}`} className="flex justify-between gap-4 py-2 text-sm text-black">
            <span>
              {first.name} - {first.brand}
            </span>
            <span className="flex items-center gap-1">
              {getDisplayPrice(first.exchange.code, first.costPrice)}
              <em className="text-xs not-italic text-gray-500">({getExchangeDisplayPrice(viewCurrency, first.costPrice, first.exchange)})</em>
            </span>
          </div>

          {/* 리스트 문장 */}
          <CollapsibleContent className="flex flex-col">
            {rest.map((p, idx) => {
              return (
                <div key={`${p.name}_${p.brand}_${idx}`} className="flex justify-between gap-4 py-2 border-t border-gray-300 text-sm text-black">
                  <span>
                    {p.name} - {p.brand}
                  </span>
                  <span className="flex items-center gap-1">
                    {getDisplayPrice(p.exchange.code, p.costPrice)}
                    <em className="text-xs not-italic text-gray-500">({getExchangeDisplayPrice(viewCurrency, p.costPrice, p.exchange)})</em>
                  </span>
                </div>
              );
            })}
            <div className="px-4 pt-2 pb-1 border-t-1 border-gray-300 text-right text-black">
              <span className="mr-1 font-bold">총 매입가:</span>
              <span>{getDisplayPrice(products[0].exchange.code, costPriceSum)}</span>
            </div>
          </CollapsibleContent>

          <CollapsibleTrigger asChild>
            <Button variant="secondary" size="icon" className="w-auto mt-2 px-2">
              {isOpen ? <ChevronUp /> : <ChevronDown />}
              <span className="">{isOpen ? "닫기" : "더보기"}</span>
            </Button>
          </CollapsibleTrigger>
        </div>
      ) : (
        // products가 한개일 경우
        <div key={`${first.name}_${first.brand}`} className="flex justify-between gap-4 text-sm text-black">
          <span>
            {first.name} - {first.brand}
          </span>
          <span className="flex items-center gap-1">
            {getDisplayPrice(first.exchange.code, first.costPrice)}
            <em className="text-xs not-italic text-gray-500">({getExchangeDisplayPrice(viewCurrency, first.costPrice, first.exchange)})</em>
          </span>
        </div>
      )}
    </Collapsible>
  );
}
