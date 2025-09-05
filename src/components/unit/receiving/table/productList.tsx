import { useState } from "react";

import { ChevronsUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import type { ICurrency, IReceivingProduct } from "@/types";

interface IProductListProps {
  products: IReceivingProduct[];
  currency: ICurrency;
}

export function ProductList({ products, currency }: IProductListProps) {
  const [isOpen, setIsOpen] = useState(false);

  const [first, ...rest] = products;

  console.log("rest: ", rest);

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
        <div key={first._id} className="flex justify-between rounded-md border px-4 py-2 text-sm">
          <span>
            {first.brand} - {first.name}
          </span>
          <span className="text-sm text-gray-500">
            {Number(first.costPrice).toLocaleString()} {currency.label}
          </span>
        </div>
      )}

      {/* 리스트 문장 */}
      <CollapsibleContent className="flex flex-col gap-2">
        {products.map((p) => (
          <div key={p._id} className="flex justify-between rounded-md border px-4 py-2 text-sm">
            <span>
              {p.brand} - {p.name}
            </span>
            <span className="text-sm text-gray-500">
              {Number(p.costPrice).toLocaleString()} {currency.label}
            </span>
          </div>
        ))}
        {/* <div className="rounded-md border px-4 py-2 text-sm">@stitches/react</div> */}
      </CollapsibleContent>
    </Collapsible>
  );
}
