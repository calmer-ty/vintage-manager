import { Layout, Package, DollarSign, ArrowUp, Minus } from "lucide-react";

// Menu page
export const productPages = [
  {
    title: "대시보드",
    url: "/dashboard",
    icon: Layout,
  },
  {
    title: "매입관리",
    url: "/purchase",
    icon: Package,
  },
  {
    title: "판매관리",
    url: "/sales",
    icon: DollarSign,
  },
];

export const userPages = [
  {
    title: "Pro 업그레이드",
    url: "/pro",
    icon: ArrowUp,
  },
  {
    title: "구독 취소",
    url: "/",
    icon: Minus,
    isDisabled: true,
  },
];
