import { memo } from "react";

import { motion } from "framer-motion";

interface IMenu {
  title: string;
  icon: string;
}
const mapsMenus: IMenu[] = [
  { title: "대시보드", icon: "icon_table" },
  { title: "상품등록", icon: "icon_plus" },
];

function MapSelector() {
  return (
    <div className="flex flex-col items-center gap-8 w-30 h-screen bg-[#4A4E69] pt-8">
      {mapsMenus.map((menu) => (
        <MenuItem key={menu.title} menu={menu} />
      ))}
    </div>
  );
}

function MenuItem({ menu }: { menu: IMenu }) {
  return (
    <motion.div whileHover={{ backgroundColor: "#5B637E" }} transition={{ duration: 0.2 }} className="flex flex-col items-center gap-2 p-4 cursor-pointer rounded-lg">
      <i
        className="block w-8 h-8 bg-no-repeat bg-contain"
        style={{
          backgroundImage: `url(/images/${menu.icon}.svg)`,
        }}
      />
      <span className="text-white">{menu.title}</span>
    </motion.div>
  );
}

export default memo(MapSelector);
