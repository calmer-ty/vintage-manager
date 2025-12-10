"use client";

import { useEffect, useState } from "react";
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

  // 마운트 후 동작 컨트롤
  const [mount, setMount] = useState(false);
  useEffect(() => setMount(true), []);

  const { userData } = useUserDataStore();
  const { openDialog } = useGradeDialogStore();

  if (!mount) return null;

  return (
    <>
      <header className="sticky t-0 z-50 flex items-center gap-1 lg:gap-2 w-full h-16 border-b px-6">
        {pathname !== "/" ? (
          <>
            <SidebarTrigger className="-ml-1" />
            <h2 className="font-medium shrink-0">{currentPage}</h2>

            {mount && userData && (
              <div className="flex justify-end items-center gap-2 w-full">
                {userData?.grade === "free" && (
                  <Button variant="default" onClick={openDialog}>
                    Pro로 업그레이드
                  </Button>
                )}

                <ChildrenTooltip content={theme === "dark" ? "라이트 모드로 변경" : "다크 모드로 변경"}>
                  <Button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>{theme === "dark" ? <Sun /> : <Moon />}</Button>
                </ChildrenTooltip>
              </div>
            )}
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
