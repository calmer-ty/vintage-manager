import { create } from "zustand";
import { auth, db, googleProvider } from "@/lib/firebase/firebaseApp";
import { onAuthStateChanged, signInWithPopup } from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";

import type { User } from "firebase/auth";
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

interface IAuthState {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  handleLogin: (router: AppRouterInstance) => Promise<void>;
  handleLogout: (router: AppRouterInstance) => Promise<void>;
}

export const useAuthStore = create<IAuthState>((set) => {
  // 여기 안의 코드는 "스토어가 생성되는 순간" 한 번 실행

  // onAuthStateChanged 구독
  onAuthStateChanged(auth, (firebaseUser) => {
    set({ user: firebaseUser, loading: false });
  });

  // 유저 데이터 등록 함수
  const createUser = async (user: User) => {
    if (!user) return;

    const docRef = doc(db, "users", user.uid);
    try {
      await setDoc(
        docRef,
        {
          _id: user.uid,
          name: user.displayName,
          email: user.email,
          grade: "free",
          createdAt: serverTimestamp(),
        },
        { merge: true }
      );
    } catch (err) {
      console.error("Error creating user:", err);
    }
  };
  return {
    user: null,
    loading: true,
    setUser: (user) => set({ user }),
    // Google 로그인 처리
    handleLogin: async (router: AppRouterInstance): Promise<void> => {
      try {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;

        await createUser(user);
        router.push("/dashboard"); // 로그인 시 첫 진입 페이지
      } catch (error) {
        console.error("로그인 실패:", error);
      }
    },
    handleLogout: async (router: AppRouterInstance): Promise<void> => {
      try {
        await auth.signOut();
        router.push("/"); // 로그아웃 시 진입 페이지
      } catch (error) {
        console.error("로그아웃 실패:", error);
      }
    },
  };
});
