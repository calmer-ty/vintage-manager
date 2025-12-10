"use client";

import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";

import { useGradeDialogStore } from "@/store/useGradeDialogStore";
import { useUserDataStore } from "@/store/useUserDataStore";

import { Moon, Rocket, Sun } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

import ChildrenTooltip from "../ChildrenTooltip";

import { pages } from "@/lib/link";

export default function LayoutHeader() {
  const pathname = usePathname();
  const currentPage = [...pages.product].find((el) => pathname === el.url)?.title;

  const { theme, setTheme } = useTheme();

  const { userData } = useUserDataStore();
  const { openDialog } = useGradeDialogStore();

  return (
    <>
      <header className="sticky t-0 z-50 flex items-center gap-1 lg:gap-2 w-full h-16 border-b px-6">
        {pathname !== "/" ? (
          <>
            <SidebarTrigger className="-ml-1" />
            <h2 className="font-medium shrink-0">{currentPage}</h2>

            <div className="flex justify-end items-center gap-2 w-full">
              {userData?.grade === "free" && (
                <Button variant="default" onClick={openDialog}>
                  Pro로 업그레이드
                </Button>
              )}

              <ChildrenTooltip content={theme === "dark" ? "라이트 모드로 변경" : "다크 모드로 변경"}>
                {theme === "dark" ? (
                  <Button onClick={() => setTheme("light")}>
                    <Sun className="h-6 w-6" />
                  </Button>
                ) : (
                  <Button onClick={() => setTheme("dark")}>
                    <Moon className="h-6 w-6" />
                  </Button>
                )}
              </ChildrenTooltip>
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
