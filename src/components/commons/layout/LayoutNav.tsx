"use client";

import { usePathname, useRouter } from "next/navigation";

import { useAuthStore } from "@/store/useAuthStore";
import { useGradeDialogStore } from "@/store/useGradeDialogStore";
import { useUserDataStore } from "@/store/useUserDataStore";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ChevronUp, User2 } from "lucide-react";

import Link from "next/link";

import { pages } from "@/lib/link";

export default function Nav() {
  const router = useRouter();
  const pathname = usePathname();

  const { user, handleLogout } = useAuthStore();
  // ⚡️ handleLogin(router) 호출 시점 주의
  // 1. onClick={handleLogin(router)} → 렌더링 시 즉시 실행됨
  //    클릭 이벤트와 무관하게 바로 함수가 호출됨 → 원치 않는 동작 발생
  //
  // 2. onClick={() => handleLogin(router)} → 클릭 시 실행
  //    화살표 함수로 감싸서 이벤트 발생 시점까지 실행 지연
  //    router 인자를 안전하게 전달하면서 클릭 시 동작하도록 보장
  //
  // 요약:
  // - 괄호가 없으면 함수 참조만 전달 → 클릭 시 실행
  // - 괄호가 있으면 즉시 실행 → 클릭과 무관
  // - 인자가 필요하면 화살표 함수로 감싸서 클릭 시점까지 지연
  const { userData } = useUserDataStore();
  const { openDialog } = useGradeDialogStore();

  return (
    <>
      {user && pathname !== "/" && (
        <Sidebar>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>상품 관리</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {pages.product.map((page) => {
                    const isActive = pathname === page.url;
                    return (
                      <SidebarMenuItem key={page.title}>
                        <SidebarMenuButton asChild>
                          <Link href={page.url} className={isActive ? "!bg-blue-100" : ""}>
                            <page.icon className="text-blue-600" />
                            <span className={isActive ? "font-bold" : ""}>{page.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter>
            <SidebarMenu>
              <SidebarMenuItem>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuButton className="h-full">
                      <div className="flex items-center gap-2">
                        <i className="flex justify-center items-center w-8 h-8 bg-gray-200 rounded-full">
                          <User2 color="gray" />
                        </i>
                        <div>
                          <p>{userData?.name}</p>
                          <p className="capitalize">{userData?.grade}</p>
                        </div>
                      </div>
                      <ChevronUp className="ml-auto" />
                    </SidebarMenuButton>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent side="top" className="w-[--radix-popper-anchor-width]">
                    <DropdownMenuItem onClick={openDialog} className="cursor-pointer">
                      요금제 변경
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleLogout(router)} className="cursor-pointer">
                      로그아웃
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>
      )}
    </>
  );
}
