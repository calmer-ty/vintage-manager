import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import next from "next";

// Firebase Admin 초기화
admin.initializeApp();

const isDev = process.env.NODE_ENV !== "production";
const nextServer = next({
  dev: isDev,
  conf: {distDir: ".next"},
});

const handle = nextServer.getRequestHandler();

export const nextjsFunc = functions
  .region("asia-northeast1") // 리전 설정 (v1에서는 각 함수마다 리전 설정)
  .https.onRequest(async (req, res) => {
    try {
      // Next.js 준비
      await nextServer.prepare();

      return handle(req, res);
    } catch (error) {
      console.error("Error handling the request:", error);
      res.status(500).send("Internal Server Error");
    }
  });
