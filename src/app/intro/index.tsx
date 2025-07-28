"use client";

import { useAuth } from "@/hooks/useAuth";

import { Button } from "@mui/material";
import { FcGoogle } from "react-icons/fc";
import { Card, CardContent } from "@/components/ui/card";

export default function IntroPage() {
  const { handleLogin } = useAuth();

  return (
    <div className="flex justify-center items-center w-full h-full bg-blue-100">
      <Card className="w-full max-w-sm mx-auto p-6 text-center shadow-md">
        <CardContent className="space-y-6">
          <h2 className="text-2xl font-semibold">로그인</h2>
          <Button variant="outlined" className="w-full flex items-center justify-center gap-2" onClick={handleLogin}>
            <FcGoogle size={20} />
            Google 계정으로 로그인
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
