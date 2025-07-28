"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { auth, googleProvider } from "@/lib/firebase/firebaseApp";

import { onAuthStateChanged, signInWithPopup } from "firebase/auth";

import type { User } from "firebase/auth";
import type { ReactNode } from "react";

interface AuthContextType {
  user: User | null;
  uid: string | undefined;
  loading: boolean;
  handleLogin: () => Promise<void>;
  handleLogout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  uid: undefined,
  loading: true,
  handleLogin: async () => {
    throw new Error("handleLogin not implemented");
  },
  handleLogout: async () => {
    throw new Error("handleLogout not implemented");
  },
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const uid = user?.uid;

  useEffect(() => {
    console.log("AuthProvider mounted, setting up onAuthStateChanged listener");

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });

    return () => unsubscribe();
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

  return <AuthContext.Provider value={{ user, loading, uid, handleLogin, handleLogout }}>{children}</AuthContext.Provider>;
};

// 커스텀 훅으로 간편하게 사용 가능
export const useAuth = () => useContext(AuthContext);
