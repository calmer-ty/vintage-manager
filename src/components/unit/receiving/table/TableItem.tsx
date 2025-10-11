import { useState } from "react";

import { useCurrency } from "@/contexts/currencyContext";
import { getDisplayPrice, getPriceInKRW } from "@/lib/price";

import { ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

import type { IPackageProduct } from "@/types";
interface ITableItemProps {
  products: IPackageProduct[];
}

export default function TableItem({ products }: ITableItemProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { currency } = useCurrency();

  const [first, ...rest] = products;

  const costSum = products.reduce((acc, val) => {
    return acc + getPriceInKRW(val.costPrice.amount, val.costPrice.currency.krw);
  }, 0);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="flex w-full flex-col px-4 py-2 border border-gray-300 rounded-md bg-white">
      {rest.length !== 0 ? (
        // products가 n개일 경우
        <div className="flex items-center justify-between gap-4">
          <h4 className="text-sm font-semibold">
            {first.name} - {first.brand} 외 {rest.length} 개
          </h4>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="icon" className="size-8">
              <ChevronsUpDown />
              <span className="sr-only">Toggle</span>
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
            {first.costPrice.amount.toLocaleString()} {first.costPrice.currency.label}
            <em className="text-xs not-italic text-gray-500">({getDisplayPrice(currency, first.costPrice)})</em>
          </span>
        </div>
      )}

      {/* 리스트 문장 */}
      <CollapsibleContent className="flex flex-col">
        {products.map((p, idx) => {
          return (
            <div key={`${p.name}_${p.brand}_${idx}`} className="flex justify-between gap-4 px-4 py-2 border-t border-gray-300 text-sm text-black">
              <span>
                {p.name} - {p.brand}
              </span>
              <span className="flex items-center gap-1">
                {p.costPrice.amount.toLocaleString()} {p.costPrice.currency.label}
                <em className="text-xs not-italic text-gray-500">({getPriceInKRW(p.costPrice.amount, p.costPrice.currency.krw).toLocaleString()} ₩)</em>
              </span>
            </div>
          );
        })}
        <div className="px-4 pt-2 pb-1 border-t-1 border-gray-300 text-right text-black">
          <span className="font-bold">총 매입가:</span> {costSum.toLocaleString()} ₩
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
