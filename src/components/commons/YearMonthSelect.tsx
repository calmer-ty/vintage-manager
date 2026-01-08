import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Calendar } from "lucide-react";

interface IDashboardSelectProps {
  selectedYear: number;
  selectedMonth: number;
  setSelectedYear: (year: number) => void;
  setSelectedMonth: (month: number) => void;
}

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 3 }, (_, i) => String(currentYear - i));
const months = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, "0"));

export default function YearMonthSelect({ selectedYear, selectedMonth, setSelectedYear, setSelectedMonth }: IDashboardSelectProps) {
  return (
    <div className="flex items-center gap-2">
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
          <SelectTrigger>
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
          <SelectTrigger>
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
