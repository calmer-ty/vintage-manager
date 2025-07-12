import { FormControl } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface IBasicSelectProps {
  placeholder: string;
  items: IItem[];
  onChange: (...event: unknown[]) => void;
  value?: string;
  defaultValue?: string;
}
interface IItem {
  label: string;
  value: string;
}

export default function BasicSelect({ placeholder, items, onChange, defaultValue, value }: IBasicSelectProps) {
  return (
    <Select onValueChange={onChange} defaultValue={defaultValue} value={value}>
      <FormControl>
        <SelectTrigger className="bg-white">
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
  );
}
