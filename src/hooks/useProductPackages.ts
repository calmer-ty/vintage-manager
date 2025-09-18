import { useState, useCallback, useEffect } from "react";
import { db } from "@/lib/firebase/firebaseApp";
import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from "firebase/firestore";

// import { useProducts } from "./useProducts";
import { getUserDateQuery } from "@/lib/firebase/utils";

import type { IProductPackage, IUpdateProductPackageParams } from "@/types";
interface IUseProductPackagesParams {
  uid: string;
  selectedYear: number;
  selectedMonth: number;
}

export const useProductPackages = ({ uid, selectedYear, selectedMonth }: IUseProductPackagesParams) => {
  const [productPackages, setProductPackages] = useState<IProductPackage[]>([]);
  const [loading, setLoading] = useState(false);

  // [등록]
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

  // [수정]
  const updateProductPackage = async ({ updateTargetId, productPackage }: IUpdateProductPackageParams) => {
    if (!uid) return;

    try {
      const docRef = doc(db, "productPackages", updateTargetId);

      await updateDoc(docRef, { ...productPackage });
    } catch (err) {
      console.error(err);
    }
  };

  // [삭제]
  const deleteProductPackage = async (packageIds: string[]) => {
    if (!uid) return;

    for (const id of packageIds) {
      try {
        await deleteDoc(doc(db, "productPackages", id));
      } catch (error) {
        console.error(`ID ${id} 삭제 실패`, error);
      }
    }
    await fetchProductPackages();
  };

  // 조회 함수
  const fetchProductPackages = useCallback(async () => {
    if (!uid) return;
    setLoading(true);

    try {
      // 년/월 데이터를 제한하여 한정적으로 데이터 쿼리
      const q = getUserDateQuery(uid, "productPackages", selectedYear, selectedMonth);

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
    updateProductPackage,
    deleteProductPackage,
    fetchProductPackages,
  };
};
