import { memo } from "react";

// import Link from "next/link";

import { motion } from "framer-motion";
import Image from "next/image";

// import * as S from "./styles";

const mapsMenus = [
  { type: "apartment", title: "대시보드", icon: "icon_table" },
  { type: "officetel", title: "상품등록", icon: "icon_plus" },
];

function MapSelector() {
  return (
    <div className="flex flex-col gap-8 w-30 h-screen bg-[#344955] pt-8">
      {mapsMenus.map((menu, index) => (
        <motion.div key={index} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex flex-col justify-center items-center gap-2 text-white cursor-pointer">
          {/* <Link key={index} href={`/${menu.type}`} className={menu.type === buildingType ? "active" : ""}> */}
          {/* <>{menu.icon}</> */}
          <Image alt={menu.icon} width={32} height={32} src={`/images/${menu.icon}.svg`} />
          <span>{menu.title}</span>
          {/* </Link> */}
        </motion.div>
      ))}
    </div>
  );
}

export default memo(MapSelector);
