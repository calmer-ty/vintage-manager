"use client";

import { useAuth } from "@/contexts/authContext";
import WriteUI from "@/components/unit/management";

export default function ManagementPage() {
  const { user } = useAuth();

  return <> {user === null ? <>로딩중</> : <WriteUI uid={user?.uid} />}</>;
}
