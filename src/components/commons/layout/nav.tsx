"use client";

import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/authContext";

import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ChevronUp, User2 } from "lucide-react";

import Link from "next/link";

import { pages } from "@/lib/link";

export default function Nav() {
  const pathname = usePathname();
  const { user, handleLogout } = useAuth();

  return (
    <>
      {user ? (
        <Sidebar>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>상품 확인하기</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {pages.map((page) => {
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
                    <SidebarMenuButton>
                      <User2 /> {user?.displayName}
                      <ChevronUp className="ml-auto" />
                    </SidebarMenuButton>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent side="top" className="w-[--radix-popper-anchor-width]">
                    <DropdownMenuItem onClick={handleLogout}>로그아웃</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>
      ) : (
        <></>
      )}
    </>
  );
}
