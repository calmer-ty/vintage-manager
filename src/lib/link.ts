import { Layout, Package, DollarSign } from "lucide-react";

// Menu page
export const pages = [
  {
    title: "대시보드",
    url: "/dashboard",
    icon: Layout,
  },
  {
    title: "입고관리",
    url: "/receiving",
    icon: Package,
  },
  {
    title: "판매관리",
    url: "/sales",
    icon: DollarSign,
  },
];
