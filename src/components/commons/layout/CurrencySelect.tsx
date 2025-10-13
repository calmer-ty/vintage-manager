import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCurrency } from "@/contexts/currencyContext";

export default function CurrencySelect() {
  const { viewCurrency, setViewCurrency } = useCurrency();

  return (
    <Select
      value={viewCurrency}
      onValueChange={(value) => {
        setViewCurrency(value);
      }}
      defaultValue="KRW"
    >
      <SelectTrigger className="w-30">
        <SelectValue placeholder="기준 통화" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>통화 선택</SelectLabel>
          <SelectItem value="KRW">KRW (₩)</SelectItem>
          <SelectItem value="USD">USD ($)</SelectItem>
          <SelectItem value="JPY">JPY (¥)</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
