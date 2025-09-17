import { FormControl, FormItem, FormLabel } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface IBasicSelectProps {
  placeholder: string;
  items: IItem[];
  onChange: (...event: unknown[]) => void;
  value?: string;
  disabled?: boolean;
  // defaultValue?: string;
}
interface IItem {
  label: string;
  value: string;
}

export default function CurrencySelect({ placeholder, items, onChange, value, disabled }: IBasicSelectProps) {
  const selectedValue: string | undefined = value ? JSON.parse(value).value : undefined;
  // const selectedValue: string | undefined = value ? value : undefined;

  return (
    <FormItem>
      <FormLabel className="opacity-0">통화</FormLabel>
      <Select onValueChange={onChange} value={selectedValue} disabled={disabled}>
        <FormControl>
          <SelectTrigger className="bg-white min-w-32">
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
        </FormControl>
        <SelectContent>
          {items.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </FormItem>
  );
}
