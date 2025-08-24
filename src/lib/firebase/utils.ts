import { collection, orderBy, query, where } from "firebase/firestore";
import { Timestamp } from "firebase/firestore";
import { db } from "./firebaseApp";

export const getUserDateQuery = (uid: string, collectionName: string, year: number, month: number) => {
  // 선택한 년/월 값을 받아 현재 1일부터 다음 달 1일 값 불러옴
  const start = Timestamp.fromDate(new Date(year, month - 1, 1)); // JS는 월이 0-based
  const end = Timestamp.fromDate(new Date(year, month, 1)); // 다음 달 1일

  return query(
    collection(db, collectionName),
    // 특정 값 기준으로 필터링
    where("uid", "==", uid),
    where("createdAt", ">=", start),
    where("createdAt", "<", end),
    // 그 필터된 문서들을 createdAt(생성 시각) 기준으로 내림차순(최신순) 정렬
    orderBy("createdAt", "desc")
  );
};
