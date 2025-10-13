import { useState, useCallback, useEffect } from "react";
import { db } from "@/lib/firebase/firebaseApp";
import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from "firebase/firestore";

import { getUserDateQuery } from "@/lib/firebase/utils";

import type { ICreatePackageParams, IMergePackageParams, IPackage, ISalesPackageParams } from "@/types";
interface IUsePackageParams {
  uid: string;
  selectedYear: number;
  selectedMonth: number;
}

export const usePackage = ({ uid, selectedYear, selectedMonth }: IUsePackageParams) => {
  const [packages, setPackages] = useState<IPackage[]>([]);
  const [fetchLoading, setFetchLoading] = useState(false);

  // [등록]
  const createPackage = async ({ packageDoc }: ICreatePackageParams) => {
    if (!uid) return;

    try {
      const docRef = await addDoc(collection(db, "packages"), { ...packageDoc });

      // 문서 ID를 포함한 데이터로 업데이트
      await updateDoc(docRef, {
        _id: docRef.id,
      });
    } catch (err) {
      console.error(err);
    }
  };
  // [번들 등록]
  const mergePackage = async ({ deleteTargets, packageDoc }: IMergePackageParams) => {
    if (!uid) return;

    try {
      const docRef = await addDoc(collection(db, "packages"), { ...packageDoc });
      // 문서 ID를 포함한 데이터로 업데이트
      await updateDoc(docRef, {
        _id: docRef.id,
      });

      // 머지된 데이터는 삭제
      for (const id of deleteTargets) {
        try {
          await deleteDoc(doc(db, "packages", id));
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
  //       const docRef = doc(db, "packages", id);
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

  // [수정] - 상품 패키지의 배송비 추가
  const salesPackage = async ({ salesTarget, salesDoc }: ISalesPackageParams) => {
    if (!uid) return;

    try {
      const docRef = doc(db, "packages", salesTarget);

      await updateDoc(docRef, { ...salesDoc });
    } catch (err) {
      console.error(err);
    }
  };

  // [삭제]
  const deletePackage = async (itemIds: string[]) => {
    if (!uid) return;

    for (const id of itemIds) {
      try {
        await deleteDoc(doc(db, "packages", id));
      } catch (error) {
        console.error(`ID ${id} 삭제 실패`, error);
      }
    }
    await fetchPackages();
  };

  // 조회 함수
  const fetchPackages = useCallback(async () => {
    if (!uid) return;
    setFetchLoading(true);

    try {
      // 년/월 데이터를 제한하여 한정적으로 데이터 쿼리
      const q = getUserDateQuery(uid, "packages", selectedYear, selectedMonth);

      const querySnapshot = await getDocs(q);
      const dataArray = querySnapshot.docs.map((doc) => ({
        _id: doc.id,
        ...doc.data(),
      }));

      setPackages(dataArray as IPackage[]);
    } catch (err) {
      console.error(err);
    } finally {
      setFetchLoading(false);
    }
  }, [uid, selectedYear, selectedMonth]);

  useEffect(() => {
    fetchPackages();
  }, [fetchPackages]);

  return {
    packages,
    createPackage,
    mergePackage,
    salesPackage,
    deletePackage,
    fetchPackages,
    fetchLoading,
  };
};
