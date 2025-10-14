import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import next from "next";

// Firebase Admin 초기화
admin.initializeApp();

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev, conf: { distDir: ".next" } });

const handle = app.getRequestHandler();

export const nextjsFunc = functions.https.onRequest({ region: "asia-northeast3" }, async (req, res) => {
  try {
    // Next.js 준비
    await app.prepare();

    return handle(req, res);
  } catch (error) {
    console.error("Error handling the request:", error);
    res.status(500).send("Internal Server Error");
  }
});
