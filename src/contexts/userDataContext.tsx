"use client";

import { useState, useEffect, createContext, useContext } from "react";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/firebaseApp";
import { useAuth } from "./authContext";

import type { ReactNode } from "react";
import type { IUserData } from "@/types";

interface IUserDataContextType {
  userData?: IUserData;
  loading: boolean;
  setGrade: (grade: "free" | "pro") => Promise<void>;
}
const UserDataContext = createContext<IUserDataContextType>({
  userData: undefined,
  loading: true,
  setGrade: async () => {
    throw new Error("setGrade not implemented");
  },
});

export const UserDataProvider = ({ children }: { children: ReactNode }) => {
  const { uid } = useAuth();

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

  const setGrade = async (grade: "free" | "pro") => {
    if (!uid || !userData) return;

    try {
      const docRef = doc(db, "users", uid);
      await updateDoc(docRef, { grade });
    } catch (err) {
      console.error(err);
    }
  };

  return <UserDataContext.Provider value={{ userData, loading, setGrade }}>{children}</UserDataContext.Provider>;
};

export const useUserData = () => useContext(UserDataContext);
