"use client";

import IntroPage from "./intro";

import { useAuth } from "@/commons/hooks/useAuth";
import IncomePage from "@/components/unit/income";

// import Income from "@/app/income";

export default function Home() {
  const { user } = useAuth();
  console.log("user: ", user?.uid);
  return <>{user === null ? <IntroPage /> : <IncomePage userId={user?.uid} />}</>;
}
