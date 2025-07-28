"use client";

import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useDateSelector } from "@/contexts/dateSelectorContext";

import YearMonthSelect from "../select/yearMonth";

export default function Header() {
  const { selectedYear, setSelectedYear, selectedMonth, setSelectedMonth } = useDateSelector();

  return (
    <header className="flex w-full border-b">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-4" />
        <h2 className="text-base font-medium">Documents</h2>
        <YearMonthSelect selectedYear={selectedYear} setSelectedYear={setSelectedYear} selectedMonth={selectedMonth} setSelectedMonth={setSelectedMonth} />
      </div>
    </header>
  );
}
