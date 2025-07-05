"use client";

import { useAuth } from "@/commons/contexts/authContext";

import IntroPage from "./intro";

export default function Home() {
  const { user } = useAuth();
  return <>{user === null ? <IntroPage /> : <div className="w-full h-full">임시 홈</div>}</>;
}
