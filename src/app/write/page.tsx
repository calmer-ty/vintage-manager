"use client";

import { useAuth } from "@/commons/contexts/authContext";
import ItemWrite from "@/components/unit/write";

export default function WritePage() {
  const { user } = useAuth();

  return <> {user === null ? <>로딩중</> : <ItemWrite uid={user?.uid} />}</>;
}
