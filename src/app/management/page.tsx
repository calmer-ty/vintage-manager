"use client";

import { useAuth } from "@/contexts/authContext";
import ManagementUI from "@/components/unit/management";

export default function ManagementPage() {
  const { uid } = useAuth();

  return <> {!uid ? <>로딩중</> : <ManagementUI uid={uid} />}</>;
}
