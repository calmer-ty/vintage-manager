import { useState, useEffect, useCallback } from "react";

import { db } from "@/lib/firebase/firebaseApp";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";

import { IItemData, IUserID } from "@/types";

// useAuth 훅을 만들어 Firebase 인증 상태를 관리
export const useUserItems = ({ uid }: IUserID) => {
  const [items, setItems] = useState<IItemData[]>([]);
  const [loading, setLoading] = useState(false);

  // 📄 조회 함수
  const fetchItems = useCallback(async () => {
    if (!uid) return;
    setLoading(true);

    try {
      const q = query(
        // 	Firestore에서 "items"이라는 이름의 컬렉션을 선택
        collection(db, "items"),
        // uid 필드가 uid 변수(로그인한 사용자 등)와 같은 문서만 필터
        where("uid", "==", uid),
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
  }, [uid]);

  // 처음 로드 시 데이터를 한 번만 조회
  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  return { items, loading, fetchItems };
};
