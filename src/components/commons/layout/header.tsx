"use client";

import { usePathname } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useDateSelector } from "@/contexts/dateSelectorContext";

import YearMonthSelect from "../select/yearMonth";

import { pages } from "@/lib/link";

export default function Header() {
  const pathname = usePathname();
  const currentPage = pages.find((el) => pathname === el.url)?.title;

  const { selectedYear, setSelectedYear, selectedMonth, setSelectedMonth } = useDateSelector();

  return (
    <header className="flex w-full h-20 border-b">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-4" />
        <h2 className="font-medium shrink-0">{currentPage}</h2>
        <YearMonthSelect selectedYear={selectedYear} setSelectedYear={setSelectedYear} selectedMonth={selectedMonth} setSelectedMonth={setSelectedMonth} />
      </div>
    </header>
  );
}
