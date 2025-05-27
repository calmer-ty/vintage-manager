"use client";

import IncomeTable from "@/components/unit/income/table";
import IntroPage from "./intro";

import { useAuth } from "@/commons/hooks/useAuth";

// import Income from "@/app/income";

export default function Home() {
  const { user } = useAuth();
  console.log("user: ", user?.uid);
  return <>{user === null ? <IntroPage /> : <IncomeTable userId={user?.uid} />}</>;
}
