"use client";

import { useAuth } from "@/contexts/authContext";
import WriteUI from "@/components/unit/management";

export default function NewPage() {
  const { user } = useAuth();

  return <> {user === null ? <>로딩중</> : <WriteUI uid={user.uid} />}</>;
}
