import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCurrency } from "@/contexts/currencyContext";

export default function CurrencySelect() {
  const { currency, setCurrency } = useCurrency();

  return (
    <Select
      value={currency}
      onValueChange={(value) => {
        setCurrency(value);
        console.log("선택된 통화:", value);
      }}
      defaultValue="KRW"
    >
      <SelectTrigger className="w-30">
        <SelectValue placeholder="당신의 통화" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>당신의 통화</SelectLabel>
          <SelectItem value="KRW">KRW (₩)</SelectItem>
          <SelectItem value="USD">USD ($)</SelectItem>
          <SelectItem value="JPY">JPY (¥)</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
