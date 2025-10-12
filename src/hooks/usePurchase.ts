import { useState, useCallback, useEffect } from "react";
import { db } from "@/lib/firebase/firebaseApp";
import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from "firebase/firestore";

import { getUserDateQuery } from "@/lib/firebase/utils";

import type { ICreateSingleParams, IPurchase, ISalesPackageParams } from "@/types";
interface IUsePurchaseParams {
  uid: string;
  selectedYear: number;
  selectedMonth: number;
}

export const usePurchase = ({ uid, selectedYear, selectedMonth }: IUsePurchaseParams) => {
  const [purchase, setPurchase] = useState<IPurchase[]>([]);
  const [fetchLoading, setFetchLoading] = useState(false);

  // [등록]
  const createSingle = async ({ purchaseDoc }: ICreateSingleParams) => {
    if (!uid) return;

    try {
      const docRef = await addDoc(collection(db, "purchaseSingle"), { ...purchaseDoc });

      // 문서 ID를 포함한 데이터로 업데이트
      await updateDoc(docRef, {
        _id: docRef.id,
      });
    } catch (err) {
      console.error(err);
    }
  };

  // [수정] - 상품 데이터를 수정
  // const updatePurchase = async ({ updateTargetId, products }: IUpdatePackageParams) => {
  //   if (!uid) return;

  //   try {
  //     const docRef = doc(db, "purchase", updateTargetId);
  //     await updateDoc(docRef, {
  //       ...products,
  //     });
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };

  // [수정] - 상품 패키지의 배송비&수수료 추가
  const salesPurchase = async ({ updateTargetId, salesData }: ISalesPackageParams) => {
    if (!uid) return;

    try {
      const docRef = doc(db, "purchase", updateTargetId);
      // ...object를 써서 업데이트할 경우
      // → Firestore는 그 객체를 “새로운 전체 상태”로 인식
      // → 기존 객체와 병합하지 않고, 그 필드 전체를 교체함
      await updateDoc(docRef, {
        shipping: salesData.shipping,
        fee: salesData.fee,
        addSaleAt: salesData.addSaleAt,
      });
    } catch (err) {
      console.error(err);
    }
  };

  // [삭제]
  const deleteSingle = async (itemIds: string[]) => {
    if (!uid) return;

    for (const id of itemIds) {
      try {
        await deleteDoc(doc(db, "purchase", id));
      } catch (error) {
        console.error(`ID ${id} 삭제 실패`, error);
      }
    }
    await fetchSingle();
  };

  // 조회 함수
  const fetchSingle = useCallback(async () => {
    if (!uid) return;
    setFetchLoading(true);

    try {
      // 년/월 데이터를 제한하여 한정적으로 데이터 쿼리
      const q = getUserDateQuery(uid, "purchaseSingle", selectedYear, selectedMonth);

      const querySnapshot = await getDocs(q);
      const dataArray = querySnapshot.docs.map((doc) => ({
        _id: doc.id,
        ...doc.data(),
      }));

      setPurchase(dataArray as IPurchase[]);
    } catch (err) {
      console.error(err);
    } finally {
      setFetchLoading(false);
    }
  }, [uid, selectedYear, selectedMonth]);

  useEffect(() => {
    fetchSingle();
  }, [fetchSingle]);

  return {
    purchase,
    createSingle,
    salesPurchase,
    deleteSingle,
    fetchSingle,
    fetchLoading,
  };
};
