import { useCurrency } from "@/contexts/currencyContext";

import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Coins } from "lucide-react";

export default function CurrencySelect() {
  const { viewCurrency, setViewCurrency } = useCurrency();

  return (
    <div className="flex items-center gap-2">
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="relative mr-2">
            <Coins className="w-5 h-5 text-blue-500" />
            <span className="absolute -top-2 -right-2 text-red-500 vertical-top">*</span>
          </div>
        </TooltipTrigger>
        <TooltipContent>조회하고 싶은 통화를 선택하세요.</TooltipContent>
      </Tooltip>
      <Select
        value={viewCurrency}
        onValueChange={(value) => {
          setViewCurrency(value);
        }}
        defaultValue="KRW"
      >
        <SelectTrigger className="w-20">
          <SelectValue placeholder="기준 통화" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>통화 선택</SelectLabel>
            <SelectItem value="KRW">
              KRW
              {/* (₩) */}
            </SelectItem>
            <SelectItem value="USD">
              USD
              {/* ($) */}
            </SelectItem>
            {/* <SelectItem value="JPY">JPY (¥)</SelectItem> */}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
