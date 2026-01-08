"use client";

import { useAuthStore } from "@/store/useAuthStore";

import { Loader } from "lucide-react";
import PurchaseUI from "@/components/unit/purchase";

export default function PurchasePage() {
  const { user, loading } = useAuthStore();

  if (loading) {
    return (
      <Loader
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-6 w-6 animate-spin text-muted-foreground"
        aria-label="Loading"
      />
    );
  }

  if (!user) {
    // 로그인 안 된 상태 처리 (로그인 페이지 리다이렉트 또는 안내 UI)
    return <div>로그인이 필요합니다.</div>;
  }

  return <PurchaseUI />;
}
