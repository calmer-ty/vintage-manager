import { FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";

interface IPurchaseSelectProps {
  onChange: (code: string) => void;
  value: string;
  disabled?: boolean;
  label?: string;
  messageStyles?: string;
}

export default function PurchaseSelect({ onChange, value, label, messageStyles, disabled }: IPurchaseSelectProps) {
  return (
    <FormItem>
      <FormLabel>{label}</FormLabel>
      <Select onValueChange={onChange} value={value} disabled={disabled}>
        <FormControl>
          <SelectTrigger className="bg-white min-w-32">
            <SelectValue placeholder="사용한 통화" />
          </SelectTrigger>
        </FormControl>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>통화 선택</SelectLabel>
            <SelectItem value="KRW">KRW (₩)</SelectItem>
            <SelectItem value="USD">USD ($)</SelectItem>
            <SelectItem value="JPY">JPY (¥)</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      <FormMessage className={messageStyles} />
    </FormItem>
  );
}
