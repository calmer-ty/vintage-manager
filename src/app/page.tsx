"use client";

import IncomePage from "./income";
import IntroPage from "./intro";

import { useAuth } from "@/src/commons/hooks/useAuth";

// import Income from "@/app/income";

export default function Home() {
  const { user } = useAuth();
  return <>{user === null ? <IntroPage /> : <IncomePage />}</>;
}
