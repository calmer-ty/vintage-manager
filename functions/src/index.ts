import * as functions from "firebase-functions/v2";
import * as admin from "firebase-admin";
import next from "next";
import {setGlobalOptions} from "firebase-functions/v2";

// 글로벌 리전 설정
setGlobalOptions({
  region: "asia-northeast1", // 한국 리전 설정
});

// Firebase Admin 초기화
admin.initializeApp();

const isDev = process.env.NODE_ENV !== "production";
const nextServer = next({
  dev: isDev,
  conf: {distDir: ".next"},
  // 환경 변수를 통해 Cloud Run의 8080 포트로 설정
  //   port: Number(process.env.PORT) || 8080,
});

const handle = nextServer.getRequestHandler();

export const vintageManagerFunc = functions.https.onRequest(async (req, res) => {
  try {
    // 서버 준비 상태 로그
    console.log("Next.js server is preparing...");

    // Next.js 준비
    await nextServer.prepare();

    // 준비가 완료되면 로그 출력
    console.log("Next.js server is prepared.");

    return handle(req, res);
  } catch (error) {
    console.error("Error handling the request:", error);
    res.status(500).send("Internal Server Error");
  }
});
