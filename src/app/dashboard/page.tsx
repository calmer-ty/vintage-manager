"use client";

import { useAuth } from "@/contexts/authContext";

import DashBoardUI from "@/components/unit/dashBoard";

export default function Home() {
  const { user } = useAuth();
  return <>{user && <DashBoardUI uid={user.uid} />}</>;
}
