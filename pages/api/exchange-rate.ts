import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";

// 24시간 = 1000ms * 60초 * 60분 * 24시간
const CACHE_DURATION = 1000 * 60 * 60 * 24;

let cachedRate: unknown = null;
let lastFetchedTime: number = 0;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const now = Date.now();

  // 현재 시간과 마지막 호출 시간 비교해서 24시간 안 지났으면 캐시 반환
  if (cachedRate && now - lastFetchedTime < CACHE_DURATION) {
    console.log("⚡ 캐시에서 데이터 반환됨"); // 캐시에서 가져올 때 서버 로그
    console.log("현재 캐시된 데이터:", cachedRate); // 캐시 데이터 확인
    return res.status(200).json({
      data: cachedRate,
      cached: true, // 캐시에서 가져온 데이터임을 표시
    });
  }

  try {
    const response = await axios.get(`https://v6.exchangerate-api.com/v6/${process.env.NEXT_PUBLIC_EXCHANGERATE_API_KEY}/latest/USD`);

    cachedRate = response.data;
    lastFetchedTime = now;

    console.log("🔄 새로 호출된 환율 데이터: ", cachedRate); // 새로 호출된 데이터 확인

    return res.status(200).json({
      data: cachedRate,
      cached: false, // 새로 호출한 데이터임을 표시
    });
  } catch (error) {
    console.error("환율 API 오류:", error);
    return res.status(500).json({ error: "환율 정보를 불러올 수 없습니다." });
  }
}
