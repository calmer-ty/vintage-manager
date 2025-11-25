"use client";

import { usePathname } from "next/navigation";

import { useAuth } from "@/contexts/authContext";
import { useUserData } from "@/contexts/userDataContext";
import { useGradeDialog } from "@/contexts/gradeModalContext";

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
  const pathname = usePathname();
  const { user, handleLogout } = useAuth();
  const { userData } = useUserData();
  const { openGrade } = useGradeDialog();

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
                    <DropdownMenuItem onClick={openGrade} className="cursor-pointer">
                      요금제 변경
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
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
