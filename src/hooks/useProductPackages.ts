import { useState, useCallback, useEffect } from "react";
import { db } from "@/lib/firebase/firebaseApp";
import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from "firebase/firestore";

import { getUserDateQuery } from "@/lib/firebase/utils";

import type { ICreateProductPackageParams, IProductPackage, ISalesProductPackageParams, IUpdateProductPackageParams } from "@/types";
interface IUseProductPackagesParams {
  uid: string;
  selectedYear: number;
  selectedMonth: number;
}

export const useProductPackages = ({ uid, selectedYear, selectedMonth }: IUseProductPackagesParams) => {
  const [productPackages, setProductPackages] = useState<IProductPackage[]>([]);
  const [loading, setLoading] = useState(false);

  // [등록]
  const createProductPackage = async ({ productPackage }: ICreateProductPackageParams) => {
    if (!uid) return;

    try {
      const docRef = await addDoc(collection(db, "productPackages"), { ...productPackage });

      // 문서 ID를 포함한 데이터로 업데이트
      await updateDoc(docRef, {
        _id: docRef.id,
      });
    } catch (err) {
      console.error(err);
    }
  };

  // [수정] - 상품 데이터를 수정
  const updateProductPackage = async ({ updateTargetId, products }: IUpdateProductPackageParams) => {
    if (!uid) return;

    // console.log("productPackage", productPackage);

    try {
      const docRef = doc(db, "productPackages", updateTargetId);
      // ...object를 써서 업데이트할 경우
      // → Firestore는 그 객체를 “새로운 전체 상태”로 인식
      // → 기존 객체와 병합하지 않고, 그 필드 전체를 교체함
      await updateDoc(docRef, {
        ...products,
      });
    } catch (err) {
      console.error(err);
    }
  };

  // [수정] - 상품 패키지의 배송비&수수료 추가
  const salesProductPackage = async ({ updateTargetId, salesData }: ISalesProductPackageParams) => {
    if (!uid) return;

    // console.log("productPackage", productPackage);

    try {
      const docRef = doc(db, "productPackages", updateTargetId);
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
    salesProductPackage,
    deleteProductPackage,
    fetchProductPackages,
  };
};
