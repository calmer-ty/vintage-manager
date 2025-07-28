import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";

import type { Dispatch, SetStateAction } from "react";
interface IDashboardSelectProps {
  selectedYear: number;
  setSelectedYear: Dispatch<SetStateAction<number>>;
  selectedMonth: number;
  setSelectedMonth: Dispatch<SetStateAction<number>>;
}

const years = ["2025", "2024", "2023"];
const months = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, "0"));

export default function YearMonthSelect({ selectedYear, setSelectedYear, selectedMonth, setSelectedMonth }: IDashboardSelectProps) {
  return (
    <div className="flex justify-end w-full gap-2 border-b border-gray-300 pb-3">
      <Label className="text-gray-700 text-sm">조회 기간</Label>
      <div className="flex gap-2">
        <Select value={String(selectedYear)} onValueChange={(value) => setSelectedYear(Number(value))}>
          <SelectTrigger className="bg-white">
            <SelectValue placeholder="년" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>년</SelectLabel>
              {years.map((year) => (
                <SelectItem key={year} value={year}>
                  {year}년
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Select value={String(selectedMonth).padStart(2, "0")} onValueChange={(value) => setSelectedMonth(Number(value))}>
          <SelectTrigger className="bg-white">
            <SelectValue placeholder="월" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>월</SelectLabel>
              {months.map((month) => (
                <SelectItem key={month} value={month}>
                  {Number(month)}월
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
