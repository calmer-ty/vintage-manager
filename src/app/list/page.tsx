"use client";

import { useAuth } from "@/contexts/authContext";
import WriteUI from "@/components/unit/management";

export default function NewPage() {
  const { uid } = useAuth();

  return <> {!uid ? <>로딩중</> : <WriteUI uid={uid} />}</>;
}
