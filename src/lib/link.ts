import { Layout, Package, DollarSign, ArrowUp, Minus } from "lucide-react";

// Menu page
export const pages = {
  product: [
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
  ],
  user: [
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
  ],
};
