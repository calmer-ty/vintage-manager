import { useState, useEffect } from "react";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/firebaseApp";

import type { IUserData } from "@/types";

export const useUserData = (uid: string | undefined) => {
  const [userData, setUserData] = useState<IUserData>();
  const [loading, setLoading] = useState(true);

  // 조회 함수
  useEffect(() => {
    if (!uid) return;

    const docRef = doc(db, "users", uid);
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        setUserData(docSnap.data() as IUserData);
      }
      setLoading(false);
    });

    return () => unsubscribe(); // 메모리 누수 방지
  }, [uid]);

  const upgradeGrade = async () => {
    if (!uid) return;

    try {
      const docRef = doc(db, "users", uid);
      await updateDoc(docRef, {
        ...userData,
        grade: "pro",
      });
    } catch (err) {
      console.error(err);
    }
  };

  const downgradeGrade = async () => {
    if (!uid) return;

    try {
      const docRef = doc(db, "users", uid);
      await updateDoc(docRef, {
        ...userData,
        grade: "free",
      });
    } catch (err) {
      console.error(err);
    }
  };

  return { userData, loading, upgradeGrade, downgradeGrade };
};
