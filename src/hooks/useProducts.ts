import { useState, useCallback, useEffect } from "react";

import { db } from "@/lib/firebase/firebaseApp";
import { addDoc, collection, doc, getDocs, orderBy, query, Timestamp, updateDoc, where } from "firebase/firestore";

import type { IItemData, IUpdateItemParams } from "@/types";

interface IuseProductsProps {
  uid: string;
  selectedYear: number;
  selectedMonth: number;
}

// useAuth 훅을 만들어 Firebase 인증 상태를 관리
export const useProducts = ({ uid, selectedYear, selectedMonth }: IuseProductsProps) => {
  const [products, setProducts] = useState<IItemData[]>([]);
  const [loading, setLoading] = useState(false);

  // 등록 함수
  const createProduct = async (itemData: IItemData) => {
    if (!uid) return;

    try {
      const docRef = await addDoc(collection(db, "product"), { ...itemData });

      // 문서 ID를 포함한 데이터로 업데이트
      await updateDoc(docRef, {
        _id: docRef.id,
      });
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ [수정]
  const updateProduct = async ({ updateTargetId, itemData }: IUpdateItemParams) => {
    if (!uid) return;

    try {
      const docRef = doc(db, "product", updateTargetId);

      await updateDoc(docRef, { ...itemData });
    } catch (err) {
      console.error(err);
    }
  };

  // 조회 함수
  const fetchProducts = useCallback(async () => {
    if (!uid) return;
    setLoading(true);

    try {
      // 선택한 년/월 기준으로 필터링 데이터 정의
      const start = Timestamp.fromDate(new Date(selectedYear, selectedMonth - 1, 1)); // JS는 월이 0-based
      const end = Timestamp.fromDate(new Date(selectedYear, selectedMonth, 1)); // 다음 달 1일

      const q = query(
        collection(db, "product"),
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

      setProducts(dataArray as IItemData[]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [uid, selectedYear, selectedMonth]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return { products, loading, createProduct, updateProduct, fetchProducts };
};
