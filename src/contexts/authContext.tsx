"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "@/lib/firebase/firebaseApp";

import { onAuthStateChanged } from "firebase/auth";

import type { User } from "firebase/auth";
import type { ReactNode } from "react";

interface AuthContextType {
  user: User | null;
  uid?: string;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return <AuthContext.Provider value={{ user, loading }}>{children}</AuthContext.Provider>;
};

// 커스텀 훅으로 간편하게 사용 가능
export const useAuth = () => useContext(AuthContext);
