import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function CurrencySelect() {
  return (
    <Select defaultValue="USD">
      <SelectTrigger className="w-30">
        <SelectValue placeholder="당신의 통화" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>당신의 통화</SelectLabel>
          <SelectItem value="USD">USD ($)</SelectItem>
          <SelectItem value="KRW">KRW (₩)</SelectItem>
          <SelectItem value="JPY">JPY (¥)</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
