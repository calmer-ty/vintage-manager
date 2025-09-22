import axios from "axios";

import { getTodayMidnight } from "@/lib/date";

import type { NextApiRequest, NextApiResponse } from "next";

let cachedRate: unknown = null;
let lastFetchedTime: number = 0;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // const now = Date.now();
  const todayMidnight = getTodayMidnight();

  // 마지막 데이터를 불러온 시간과 현재 시간 자정과 함께 비교하여 날짜가 같으면 캐시된 데이터 사용
  if (cachedRate && lastFetchedTime === todayMidnight) {
    return res.status(200).json({
      data: cachedRate,
      cached: true, // 캐시에서 가져온 데이터임을 표시
    });
  }

  try {
    const response = await axios.get(`https://v6.exchangerate-api.com/v6/${process.env.NEXT_PUBLIC_EXCHANGERATE_API_KEY}/latest/USD`);

    cachedRate = response.data;
    lastFetchedTime = todayMidnight;

    // console.log("🔄 새로 호출된 환율 데이터: ", cachedRate); // 새로 호출된 데이터 확인

    return res.status(200).json({
      data: cachedRate,
      cached: false, // 새로 호출한 데이터임을 표시
    });
  } catch (error) {
    console.error("환율 API 오류:", error);
    return res.status(500).json({ error: "환율 정보를 불러올 수 없습니다." });
  }
}
