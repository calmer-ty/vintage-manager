import { FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";

import { Lock } from "lucide-react";

import type { IUserData } from "@/types";

interface IPurchaseSelectProps {
  userData: IUserData | undefined;
  onChange: (code: string) => void;
  value: string;
  disabled?: boolean;
  label?: string;
  messageStyles?: string;
}

export default function PurchaseSelect({ userData, onChange, value, label, messageStyles, disabled }: IPurchaseSelectProps) {
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
