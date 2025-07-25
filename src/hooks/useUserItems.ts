import { useState, useEffect, useCallback } from "react";

import { db } from "@/lib/firebase/firebaseApp";
import { collection, getDocs, orderBy, query, Timestamp, where } from "firebase/firestore";

import { IItemData } from "@/types";

interface IUseUserItemsProps {
  uid: string;
  selectedYear: number;
  selectedMonth: number;
}

// useAuth 훅을 만들어 Firebase 인증 상태를 관리
export const useUserItems = ({ uid, selectedYear, selectedMonth }: IUseUserItemsProps) => {
  const [items, setItems] = useState<IItemData[]>([]);
  const [loading, setLoading] = useState(false);

  // 📄 조회 함수
  const fetchItems = useCallback(async () => {
    if (!uid) return;
    setLoading(true);

    try {
      // 선택한 년/월 기준으로 필터링 데이터 정의
      const start = Timestamp.fromDate(new Date(selectedYear, selectedMonth - 1, 1)); // JS는 월이 0-based
      const end = Timestamp.fromDate(new Date(selectedYear, selectedMonth, 1)); // 다음 달 1일

      const q = query(
        collection(db, "items"),
        // 특정 값 기준으로 필터링
        where("uid", "==", uid),
        where("createdAt", ">=", start),
        where("createdAt", "<", end),
        // 그 필터된 문서들을 createdAt(생성 시각) 기준으로 내림차순(최신순) 정렬
        orderBy("createdAt", "desc")
      );

      const querySnapshot = await getDocs(q);
      const dataArray = querySnapshot.docs.map((doc) => ({
        _id: doc.id,
        ...doc.data(),
      }));

      setItems(dataArray as IItemData[]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [uid, selectedYear, selectedMonth]);

  // 처음 로드 시 데이터를 한 번만 조회
  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  return { items, loading, fetchItems };
};
