import { Lock } from "lucide-react";
import { FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";

import type { IUserData } from "@/types";
interface IPurchaseSelectProps {
  value: string;
  disabled?: boolean;
  label?: string;
  messageStyles?: string;
  onChange: (code: string) => void;
  userData: IUserData | null;
}

export default function PurchaseSelect({ value, label, messageStyles, onChange, disabled, userData }: IPurchaseSelectProps) {
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
            <SelectItem value="KRW" className="cursor-pointer">
              KRW (₩)
            </SelectItem>
            <SelectItem value="USD" className="cursor-pointer">
              {userData?.grade === "free" && <Lock className="!w-3 !h-3" />}
              USD ($)
            </SelectItem>
            <SelectItem value="JPY" className="cursor-pointer">
              {userData?.grade === "free" && <Lock className="!w-3 !h-3" />}
              JPY (¥)
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      <FormMessage className={messageStyles} />
    </FormItem>
  );
}
