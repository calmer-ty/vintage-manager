"use client";

import { motion } from "framer-motion";
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
      {pathname !== "/" ? (
        <header className="sticky t-0 z-20 flex items-center gap-1 lg:gap-2 w-full h-16 border-b px-6">
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
        </header>
      ) : (
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="fixed z-20 flex justify-between items-center w-full h-16 px-8 bg-white dark:bg-black shadow-lg"
        >
          <div className="flex items-center gap-2 shrink-0">
            <Rocket className="text-amber-500" />
            <h2 className="font-medium">시작하기</h2>
          </div>
          <div className="flex justify-end items-center gap-2 w-full">
            <ChildrenTooltip content={theme === "dark" ? "라이트 모드로 변경" : "다크 모드로 변경"}>
              <Button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>{theme === "dark" ? <Sun /> : <Moon />}</Button>
            </ChildrenTooltip>
          </div>
        </motion.header>
      )}
    </>
  );
}
