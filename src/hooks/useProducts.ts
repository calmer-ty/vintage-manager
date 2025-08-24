import { useState, useCallback, useEffect } from "react";
import { db } from "@/lib/firebase/firebaseApp";
import { addDoc, collection, doc, getDocs, orderBy, query, updateDoc, where } from "firebase/firestore";

import { getMonthRangeTimestamps } from "@/lib/date";

import type { IProduct, IUpdateItemParams } from "@/types";
interface IUseProductsProps {
  uid: string;
  selectedYear: number;
  selectedMonth: number;
}

// useAuth 훅을 만들어 Firebase 인증 상태를 관리
export const useProducts = ({ uid, selectedYear, selectedMonth }: IUseProductsProps) => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(false);

  // 등록 함수
  const createProduct = async (itemData: IProduct) => {
    if (!uid) return;

    try {
      const docRef = await addDoc(collection(db, "products"), { ...itemData });

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
      const docRef = doc(db, "products", updateTargetId);

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
      // 선택한 년/월 값을 받아 현재 1일부터 다음 달 1일 값 불러옴
      const { start, end } = getMonthRangeTimestamps(selectedYear, selectedMonth);

      const q = query(
        collection(db, "products"),
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

      setProducts(dataArray as IProduct[]);
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
