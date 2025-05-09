import { Button, Paper, Typography } from "@mui/material";
import { FcGoogle } from "react-icons/fc";

export default function IntroPage() {
  return (
    <div className="flex justify-center items-center w-full h-full bg-blue-100">
      <Paper elevation={3} sx={{ p: 4, display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
        <Typography variant="h6">환영합니다!</Typography>
        <Button
          variant="outlined"
          startIcon={<FcGoogle />}
          onClick={() => {
            // 여기에 구글 로그인 로직 연결
            console.log("구글 로그인 시도");
          }}
        >
          Google로 로그인
        </Button>
      </Paper>
    </div>
  );
}
