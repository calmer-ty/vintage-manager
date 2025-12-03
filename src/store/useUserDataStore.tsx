import { create } from "zustand";

import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/firebaseApp";

import type { IUserData } from "@/types";
import type { User } from "firebase/auth";
interface IUserDataState {
  userData: IUserData | null;
  loading: boolean;
  setUserData: (data: IUserData) => void;
  setLoading: (loading: boolean) => void;
  setGrade: (user: User, grade: "free" | "pro") => Promise<void>;
}

export const useUserDataStore = create<IUserDataState>((set) => ({
  userData: null,
  loading: true,
  setUserData: (data: IUserData) => set({ userData: data }),
  setLoading: (loading: boolean) => set({ loading }),
  setGrade: async (user: User, grade: "free" | "pro") => {
    try {
      const docRef = doc(db, "users", user.uid);
      await updateDoc(docRef, { grade });
    } catch (err) {
      console.error(err);
    }
  },
}));
