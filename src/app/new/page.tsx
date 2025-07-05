"use client";

import { useAuth } from "@/commons/contexts/authContext";
import WriteUI from "@/components/unit/write";

export default function NewPage() {
  const { user } = useAuth();

  return <> {user === null ? <>로딩중</> : <WriteUI uid={user?.uid} />}</>;
}
