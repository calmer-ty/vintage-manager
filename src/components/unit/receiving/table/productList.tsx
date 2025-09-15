import { useState } from "react";

import { ChevronsUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

import type { ICurrency, IReceivingProduct } from "@/types";
interface IProductListProps {
  products: IReceivingProduct[];
}

export function ProductList({ products }: IProductListProps) {
  const [isOpen, setIsOpen] = useState(false);

  const [first, ...rest] = products;
  const firstCurrency: ICurrency = JSON.parse(first.costPrice.currency);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="flex w-full flex-col gap-2">
      {rest.length !== 0 ? (
        // products가 n개일 경우
        <div className="flex items-center justify-between gap-4 px-4">
          <h4 className="text-sm font-semibold">
            {first.brand} - {first.name} 외 {rest.length} 개
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
        <div key={first._id} className="flex justify-between px-4 py-2 border border-gray-300 rounded-md bg-white text-sm">
          <span>
            {first.brand} - {first.name}
          </span>
          <span className="flex items-center gap-1">
            {Number(first.costPrice.amount).toLocaleString()} {firstCurrency.label}
            <em className="text-xs not-italic text-gray-500">({Math.round(Number(first.costPrice.amount) * firstCurrency.rate).toLocaleString()} ₩)</em>
          </span>
        </div>
      )}

      {/* 리스트 문장 */}
      <CollapsibleContent className="flex flex-col gap-2">
        {products.map((p, idx) => {
          const productCurrency: ICurrency = JSON.parse(p.costPrice.currency);
          return (
            <div key={`${p._id}_${idx}`} className="flex justify-between px-4 py-2 border border-gray-300 rounded-md bg-white text-sm">
              <span>
                {p.brand} - {p.name}
              </span>
              <span className="flex items-center gap-1">
                {Number(p.costPrice.amount).toLocaleString()} {productCurrency.label}
                <em className="text-xs not-italic text-gray-500">({Math.round(Number(p.costPrice.amount) * productCurrency.rate).toLocaleString()} ₩)</em>
              </span>
            </div>
          );
        })}
      </CollapsibleContent>
    </Collapsible>
  );
}
