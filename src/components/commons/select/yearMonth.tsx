import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Calendar } from "lucide-react";

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
    <div className="flex justify-end items-center gap-2 w-full">
      {/* <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-4" /> */}
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="relative mr-2">
            <Calendar className="w-4 h-4 text-blue-500" />
            <span className="absolute -top-2 -right-2 text-red-500 vertical-top">*</span>
          </div>
        </TooltipTrigger>
        <TooltipContent>조회하고 싶은 년/월을 선택해주세요.</TooltipContent>
      </Tooltip>
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
