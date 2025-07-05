"use client";

import { memo } from "react";
import { motion } from "framer-motion";

import Link from "next/link";

interface IMenu {
  title: string;
  icon: string;
  href: string;
}
const mapsMenus: IMenu[] = [
  { title: "대시보드", icon: "icon_table", href: "/dashBoard" },
  { title: "상품등록", icon: "icon_plus", href: "/write" },
];

function SideNav() {
  return (
    <nav className="flex flex-col items-center shrink-0 gap-8 w-30 h-full py-6 bg-[#4A4E69]">
      {mapsMenus.map((menu) => (
        <MenuItem key={menu.title} menu={menu} />
      ))}
    </nav>
  );
}

function MenuItem({ menu }: { menu: IMenu }) {
  return (
    <Link href={menu.href}>
      <motion.div whileHover={{ backgroundColor: "#5B637E" }} transition={{ duration: 0.2 }} className="flex flex-col items-center gap-2 p-4 cursor-pointer rounded-lg">
        <i
          className="block w-8 h-8 bg-no-repeat bg-contain"
          style={{
            backgroundImage: `url(/images/${menu.icon}.svg)`,
          }}
        />
        <span className="text-white">{menu.title}</span>
      </motion.div>
    </Link>
  );
}

export default memo(SideNav);
