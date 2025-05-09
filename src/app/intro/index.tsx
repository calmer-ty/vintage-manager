import { Box, Button, Paper, Typography } from "@mui/material";

export default function IntroPage() {
  return (
    // <div className="flex justify-center items-center w-full h-full bg-blue-100">
    //   <div className="flex flex-col items-center gap-2 p-4 border-2 bg-white">
    //     <span>환영합니다!</span>
    //     <Button variant="contained">Google로 로그인</Button>
    //   </div>
    // </div>
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" bgcolor="#e3f2fd">
      <Paper elevation={3} sx={{ p: 4, display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
        <Typography variant="h6">환영합니다!</Typography>
        <Button
          variant="contained"
          // startIcon={<GoogleIcon />}
          onClick={() => {
            // 여기에 구글 로그인 로직 연결
            console.log("구글 로그인 시도");
          }}
        >
          Google로 로그인
        </Button>
      </Paper>
    </Box>
  );
}
