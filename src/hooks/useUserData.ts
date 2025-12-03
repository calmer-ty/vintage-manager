import { useEffect } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase/firebaseApp";

import { useAuthStore } from "@/store/useAuthStore";
import { useUserDataStore } from "@/store/useUserDataStore";

import type { IUserData } from "@/types";

export const useUserData = () => {
  const { user } = useAuthStore();
  const { setUserData, setLoading } = useUserDataStore();

  // 조회 함수
  useEffect(() => {
    if (!user) return;

    const docRef = doc(db, "users", user.uid);

    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        setUserData(docSnap.data() as IUserData);
      }
      setLoading(false);
    });

    return () => unsubscribe(); // 메모리 누수 방지
  }, [user, setUserData, setLoading]);
};
