import { useState, useEffect } from "react";
import { doc, FieldValue, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase/firebaseApp";

interface IUserData {
  name: string;
  email: string;
  grade: string;
  createdAt: FieldValue;
}

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

  return { userData, loading };
};
