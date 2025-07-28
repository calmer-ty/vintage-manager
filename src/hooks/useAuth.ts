import { useState, useEffect } from "react";
import { onAuthStateChanged, signInWithPopup } from "firebase/auth";

import { auth, googleProvider } from "@/lib/firebase/firebaseApp";

import type { User } from "firebase/auth";

// useAuth 훅을 만들어 Firebase 인증 상태를 관리
export const useAuth = (): {
  user: User | null;
  uid?: string;
  handleLogin: () => Promise<void>;
  handleLogout: () => Promise<void>;
} => {
  const [user, setUser] = useState<User | null>(null);
  const uid = user?.uid;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser !== null) {
        setUser(firebaseUser);
      } else {
        setUser(null);
      }
    });

    // 컴포넌트가 unmount될 때 리스너를 정리
    return () => {
      unsubscribe();
    };
  }, []);

  // Google 로그인 처리
  const handleLogin = async (): Promise<void> => {
    try {
      await signInWithPopup(auth, googleProvider);
      console.log(auth);
    } catch (error) {
      console.error("로그인 실패:", error);
    }
  };

  // 로그아웃 처리
  const handleLogout = async (): Promise<void> => {
    try {
      await auth.signOut();
      // setAlertOpen(true);
      // setRouting("/");
    } catch (error) {
      console.error("로그아웃 실패:", error);
    }
  };

  return { user, uid, handleLogin, handleLogout };
};
