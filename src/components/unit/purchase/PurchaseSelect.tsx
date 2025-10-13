import { FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { IExchange } from "@/types";

interface IPurchaseSingleSelectProps {
  onChange: (code: string) => void;
  // onChange: (...event: unknown[]) => void;
  value: IExchange;
  disabled?: boolean;
}

export default function PurchaseSelect({ onChange, value, disabled }: IPurchaseSingleSelectProps) {
  console.log("value: ", value);
  return (
    <FormItem>
      <FormLabel className="">당신이 사용한 통화를 선택해주세요.</FormLabel>
      <Select onValueChange={onChange} value={value.code} disabled={disabled}>
        <FormControl>
          <SelectTrigger className="bg-white min-w-32">
            <SelectValue placeholder="당신의 통화" />
          </SelectTrigger>
        </FormControl>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>당신의 통화</SelectLabel>
            <SelectItem value="USD">USD ($)</SelectItem>
            <SelectItem value="KRW">KRW (₩)</SelectItem>
            <SelectItem value="JPY">JPY (¥)</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      <FormMessage />
    </FormItem>
  );
}
