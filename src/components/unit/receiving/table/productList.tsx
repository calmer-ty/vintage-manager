import { useState } from "react";

import { ChevronsUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import type { IReceivingProduct } from "@/types";

interface IProductListProps {
  products: IReceivingProduct[];
}

export function ProductList({ products }: IProductListProps) {
  const [isOpen, setIsOpen] = useState(false);

  const [first, ...rest] = products;

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="flex w-full flex-col gap-2">
      {/* <div className="flex items-center justify-between gap-4 px-4">
    
        <h4 className="text-sm font-semibold">{product.name}</h4>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="icon" className="size-8">
            <ChevronsUpDown />
            <span className="sr-only">Toggle</span>
          </Button>
        </CollapsibleTrigger>
      </div> */}
      {/* 리스트 첫 문장 */}
      <div className="rounded-md border px-4 py-2 text-sm">
        <span>
          {first.brand} - {first.name}
        </span>

        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="icon" className="size-8">
            <ChevronsUpDown />
            <span className="sr-only">Toggle</span>
          </Button>
        </CollapsibleTrigger>
      </div>
      {/* 리스트 2~n 문장 */}
      <CollapsibleContent className="flex flex-col gap-2">
        {rest.map((p) => (
          <div key={p._id} className="rounded-md border px-4 py-2 text-sm">
            {p.brand} - {p.name}
          </div>
        ))}
        {/* <div className="rounded-md border px-4 py-2 text-sm">@stitches/react</div> */}
      </CollapsibleContent>
    </Collapsible>
  );
}
