import { useState, useCallback, useEffect } from "react";

import { db } from "@/lib/firebase/firebaseApp";
import { addDoc, collection, getDocs, orderBy, query, Timestamp, updateDoc, where } from "firebase/firestore";

import type { IProductPackage } from "@/types";
interface IUseProductPackagesParams {
  uid: string;
  selectedYear: number;
  selectedMonth: number;
}

// useAuth 훅을 만들어 Firebase 인증 상태를 관리
export const useProductPackages = ({ uid, selectedYear, selectedMonth }: IUseProductPackagesParams) => {
  const [productPackages, setProductPackages] = useState<IProductPackage[]>([]);
  const [loading, setLoading] = useState(false);

  // 등록 함수
  const createProductPackage = async (productsPackage: IProductPackage) => {
    if (!uid) return;

    try {
      const docRef = await addDoc(collection(db, "productPackages"), { ...productsPackage });

      // 문서 ID를 포함한 데이터로 업데이트
      await updateDoc(docRef, {
        _id: docRef.id,
      });
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ [수정]
  // const updateProductPackage = async ({ updateTargetId, itemData }) => {
  //   if (!uid) return;

  //   try {
  //     const docRef = doc(db, "productP, updateTargetId);

  //     await updateDoc(docRef, { ...itemData });
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };

  // 조회 함수
  const fetchProductPackages = useCallback(async () => {
    if (!uid) return;
    setLoading(true);

    try {
      // 선택한 년/월 기준으로 필터링 데이터 정의
      const start = Timestamp.fromDate(new Date(selectedYear, selectedMonth - 1, 1)); // JS는 월이 0-based
      const end = Timestamp.fromDate(new Date(selectedYear, selectedMonth, 1)); // 다음 달 1일

      const q = query(
        collection(db, "productPackages"),
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

      setProductPackages(dataArray as IProductPackage[]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [uid, selectedYear, selectedMonth]);

  useEffect(() => {
    fetchProductPackages();
  }, [fetchProductPackages]);

  return {
    productPackages,
    loading,
    createProductPackage,
    // updateProductPackage,
    fetchProductPackages,
  };
};
