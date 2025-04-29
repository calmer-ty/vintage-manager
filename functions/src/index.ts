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
});

const handle = nextServer.getRequestHandler();

export const nextjsFunc = functions.https.onRequest(async (req, res) => {
  try {
    // Next.js 준비
    await nextServer.prepare();

    return handle(req, res);
  } catch (error) {
    console.error("Error handling the request:", error);
    res.status(500).send("Internal Server Error");
  }
});
