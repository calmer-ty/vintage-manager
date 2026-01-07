import { getTodayMidnight } from "@/lib/date";

import { NextResponse } from "next/server";

let cachedRate: unknown = null;
let lastFetchedTime: number = 0;

export async function GET() {
  // const now = Date.now();
  const todayMidnight = getTodayMidnight();

  // 마지막 데이터를 불러온 시간과 현재 시간 자정과 함께 비교하여 날짜가 같으면 캐시된 데이터 사용
  if (cachedRate && lastFetchedTime === todayMidnight) {
    return NextResponse.json({
      data: cachedRate,
      cached: true, // 캐시 데이터임 표시
    });
  }

  try {
    const res = await fetch(`https://v6.exchangerate-api.com/v6/${process.env.EXCHANGERATE_API_KEY}/latest/USD`);
    const data = await res.json();

    cachedRate = data;
    lastFetchedTime = todayMidnight;
    // console.log("🔄 새로 호출된 환율 데이터: ", cachedRate); // 새로 호출된 데이터 확인

    return NextResponse.json({
      data: cachedRate,
      cached: false, // 새로 호출된 데이터 표시
    });
  } catch (error) {
    console.error("환율 API 오류:", error);
    return NextResponse.json({ error: "환율 정보를 불러올 수 없습니다." }, { status: 500 });
  }
}
