"use client";

import { usePathname } from "next/navigation";
import { useGradeDialog } from "@/contexts/gradeModalContext";

import { Rocket } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

import { pages } from "@/lib/link";

export default function LayoutHeader() {
  const pathname = usePathname();
  const { openGrade } = useGradeDialog();

  const currentPage = [...pages.product].find((el) => pathname === el.url)?.title;

  return (
    <>
      <header
        className="sticky t-0 z-50 flex items-center gap-1 w-full h-16 border-b px-6 bg-white
        lg:gap-2"
      >
        {pathname !== "/" ? (
          <>
            <SidebarTrigger className="-ml-1" />
            <h2 className="font-medium shrink-0">{currentPage}</h2>

            <div className="flex justify-end items-center w-full">
              <Separator orientation="vertical" className="mx-4 data-[orientation=vertical]:h-4" />
              <Button variant="default" onClick={openGrade}>
                Pro 업그레이드
              </Button>
            </div>
          </>
        ) : (
          <>
            <Rocket className="mx-2 text-amber-500" />
            <h2 className="font-medium">시작하기</h2>
          </>
        )}
      </header>
    </>
  );
}
