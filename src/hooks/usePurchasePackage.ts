import { useState, useCallback, useEffect } from "react";
import { db } from "@/lib/firebase/firebaseApp";
import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from "firebase/firestore";

import { getUserDateQuery } from "@/lib/firebase/utils";

import type { ICreatePurchasePackageParams, IMergePurchasePackageParams, IPurchasePackage, ISalesPackageParams } from "@/types";
interface IUsePurchasePackageParams {
  uid: string;
  selectedYear: number;
  selectedMonth: number;
}

export const usePurchasePackage = ({ uid, selectedYear, selectedMonth }: IUsePurchasePackageParams) => {
  const [purchasePackages, setPurchasePackages] = useState<IPurchasePackage[]>([]);
  const [fetchLoading, setFetchLoading] = useState(false);

  // [등록]
  const createPurchasePackage = async ({ packageDoc }: ICreatePurchasePackageParams) => {
    if (!uid) return;

    try {
      const docRef = await addDoc(collection(db, "purchasePackage"), { ...packageDoc });

      // 문서 ID를 포함한 데이터로 업데이트
      await updateDoc(docRef, {
        _id: docRef.id,
      });
    } catch (err) {
      console.error(err);
    }
  };
  // [번들 등록]
  const mergePurchasePackage = async ({ deleteTargets, packageDoc }: IMergePurchasePackageParams) => {
    if (!uid) return;

    try {
      const docRef = await addDoc(collection(db, "purchasePackage"), { ...packageDoc });
      // 문서 ID를 포함한 데이터로 업데이트
      await updateDoc(docRef, {
        _id: docRef.id,
      });

      // 머지된 데이터는 삭제
      for (const id of deleteTargets) {
        try {
          await deleteDoc(doc(db, "purchasePackage", id));
        } catch (error) {
          console.error(`ID ${id} 삭제 실패`, error);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  // [번들 변경]
  // const updateSingleToBundled = async ({ updateTargetIds }: IupdateSingleToBundledParams) => {
  //   if (!uid) return;

  //   try {
  //     for (const id of updateTargetIds) {
  //       const docRef = doc(db, "purchasePackage", id);
  //       await updateDoc(docRef, { isBundled: true });
  //     }
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };
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
  const deletePurchasePackage = async (itemIds: string[]) => {
    if (!uid) return;

    for (const id of itemIds) {
      try {
        await deleteDoc(doc(db, "purchasePackage", id));
      } catch (error) {
        console.error(`ID ${id} 삭제 실패`, error);
      }
    }
    await fetchPurchasePackages();
  };

  // 조회 함수
  const fetchPurchasePackages = useCallback(async () => {
    if (!uid) return;
    setFetchLoading(true);

    try {
      // 년/월 데이터를 제한하여 한정적으로 데이터 쿼리
      const q = getUserDateQuery(uid, "purchasePackage", selectedYear, selectedMonth);

      const querySnapshot = await getDocs(q);
      const dataArray = querySnapshot.docs.map((doc) => ({
        _id: doc.id,
        ...doc.data(),
      }));

      setPurchasePackages(dataArray as IPurchasePackage[]);
    } catch (err) {
      console.error(err);
    } finally {
      setFetchLoading(false);
    }
  }, [uid, selectedYear, selectedMonth]);

  useEffect(() => {
    fetchPurchasePackages();
  }, [fetchPurchasePackages]);

  return {
    purchasePackages,
    createPurchasePackage,
    mergePurchasePackage,
    deletePurchasePackage,
    fetchPurchasePackages,
    salesPurchase,
    fetchLoading,
  };
};
