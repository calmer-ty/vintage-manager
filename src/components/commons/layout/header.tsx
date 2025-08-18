"use client";

import { usePathname } from "next/navigation";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useDateSelector } from "@/contexts/dateSelectorContext";

import { Rocket } from "lucide-react";

import YearMonthSelect from "../select/yearMonth";

import { pages } from "@/lib/link";

export default function Header() {
  const pathname = usePathname();
  const currentPage = pages.find((el) => pathname === el.url)?.title;

  const { selectedYear, setSelectedYear, selectedMonth, setSelectedMonth } = useDateSelector();

  return (
    <header
      className="sticky top-0 z-50 flex items-center w-full h-16 border-b px-6 bg-white
        gap-1 lg:gap-2"
    >
      {pathname !== "/" ? (
        <>
          <SidebarTrigger className="-ml-1" />
          <h2
            className="font-medium shrink-0 
              hidden sm:block"
          >
            {currentPage}
          </h2>
          <YearMonthSelect selectedYear={selectedYear} setSelectedYear={setSelectedYear} selectedMonth={selectedMonth} setSelectedMonth={setSelectedMonth} />
        </>
      ) : (
        <>
          <Rocket className="mx-2 text-amber-500" />
          <h2 className="font-medium">시작하기</h2>
        </>
      )}
    </header>
  );
}
