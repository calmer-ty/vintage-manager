import { FormControl, FormItem, FormLabel } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface IReceivingSelectProps {
  items: IItem[];
  onChange: (...event: unknown[]) => void;
  value?: string;
  disabled?: boolean;
}
interface IItem {
  label: string;
  value: string;
}

export default function ReceivingSelect({ items, onChange, value, disabled }: IReceivingSelectProps) {
  const selectedValue: string | undefined = value ? JSON.parse(value).value : undefined;

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
