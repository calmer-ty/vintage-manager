import { FormControl, FormItem, FormLabel } from "@/components/ui/form";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ICurrencySelectProps {
  onChange: (...event: unknown[]) => void;
  value?: string;
  disabled?: boolean;
}

export default function CurrencySelect({ onChange, value, disabled }: ICurrencySelectProps) {
  const selectedValue: string | undefined = value ? JSON.parse(value).value : undefined;
  console.log("value:", value);

  return (
    <FormItem>
      <FormLabel className="opacity-0">통화</FormLabel>
      <Select onValueChange={onChange} value={selectedValue} disabled={disabled}>
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
    </FormItem>
  );
}
