"use client";

import { useAuth } from "@/contexts/authContext";

import IntroPage from "./intro";
import DashBoardUI from "@/components/unit/dashBoard";

export default function Home() {
  const { user } = useAuth();
  return <>{user === null ? <IntroPage /> : <DashBoardUI />}</>;
}
