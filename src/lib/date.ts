// Date 값을 문자열로 년-월-일로 리턴
export const getDateString = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // 0부터 시작하므로 +1
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

// 현재 '월'에 대한 모든 '일' 생성
export const getNowDate = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;

  return {
    year,
    month,
  };
};

// 오늘 00:00 (자정) 타임스탬프
export const getTodayMidnight = () => {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return now.getTime();
};

// 파라미터(현재 달)에 대한 모든 날짜 리턴
export const getDaysOfCurrentMonth = (year: number, month: number) => {
  // 이번 달 마지막 날짜 구하기
  const lastDay = new Date(year, month, 0).getDate();
  // 1일부터 마지막 날짜까지 배열 만들기
  return Array.from({ length: lastDay }, (_, i) => {
    const pad = (n: number) => String(n).padStart(2, "0");
    return { date: `${year}-${pad(month)}-${pad(i + 1)}` };
  });
};
