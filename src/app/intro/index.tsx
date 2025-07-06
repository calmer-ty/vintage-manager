"use client";

import { Button, Paper, Typography } from "@mui/material";
import { FcGoogle } from "react-icons/fc";
import { auth, googleProvider } from "@/lib/firebase/firebaseApp";
import { signInWithPopup } from "firebase/auth";

export default function IntroPage() {
  // Google 로그인 처리
  const handleGoogleLogin = async (): Promise<void> => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("로그인 실패:", error);
    }
  };

  return (
    <div className="flex justify-center items-center w-full h-full bg-blue-100">
      <Paper elevation={3} sx={{ p: 4, display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
        <Typography variant="h6">환영합니다!</Typography>
        <Button variant="outlined" startIcon={<FcGoogle />} onClick={handleGoogleLogin}>
          Google로 로그인
        </Button>
      </Paper>
    </div>
  );
}
