import { FormControl } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface IBasicSelectProps {
  title: string;
  items: IItem[];
  onChange: (...event: unknown[]) => void;
  value?: string;
  defaultValue?: string;
}
interface IItem {
  label: string;
  value: string;
}

export default function BasicSelect({ title, items, onChange, defaultValue, value }: IBasicSelectProps) {
  return (
    <Select onValueChange={onChange} defaultValue={defaultValue} value={value}>
      <FormControl>
        <SelectTrigger className="w-[180px] bg-white">
          <SelectValue placeholder={title} />
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
