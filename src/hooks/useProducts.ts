import { useState, useCallback, useEffect } from "react";

import { db } from "@/lib/firebase/firebaseApp";
import { addDoc, collection, deleteDoc, doc, getDocs, query, Timestamp, updateDoc, where } from "firebase/firestore";

import { getUserDateQuery } from "@/lib/firebase/utils";

import type { ICreateProductParams, ISalesProduct, ISalesProductParams } from "@/types";
interface IUseProductsParams {
  uid: string;
  selectedYear: number;
  selectedMonth: number;
}

// 패키지 상태에 따라 종속적으로 데이터 처리
export const useProducts = ({ uid, selectedYear, selectedMonth }: IUseProductsParams) => {
  const [products, setProducts] = useState<ISalesProduct[]>([]);
  const [loading, setLoading] = useState(false);

  // 등록 함수
  const createProduct = async ({ productDocs }: ICreateProductParams) => {
    if (!uid) return;

    try {
      for (const product of productDocs) {
        const docRef = await addDoc(collection(db, "products"), { ...product, sales: 0, profit: 0, createdAt: Timestamp.fromDate(new Date()), soldAt: null });

        await updateDoc(docRef, {
          _id: docRef.id,
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  // [수정]
  const salesProduct = async ({ salesTarget, productDoc }: ISalesProductParams) => {
    if (!uid) return;

    try {
      const docRef = doc(db, "products", salesTarget);

      await updateDoc(docRef, { ...productDoc });
    } catch (err) {
      console.error(err);
    }
  };

  // [삭제]
  const deleteProduct = async (packageIds: string[]) => {
    if (!uid) return;

    for (const packageId of packageIds) {
      const q = query(collection(db, "products"), where("packageId", "==", packageId));
      const querySnapshot = await getDocs(q);

      for (const productDoc of querySnapshot.docs) {
        try {
          await deleteDoc(doc(db, "products", productDoc.id));
        } catch (error) {
          console.error(`Product ID ${productDoc.id} 삭제 실패`, error);
        }
      }
    }
    await fetchProducts();
  };

  // 조회 함수
  const fetchProducts = useCallback(async () => {
    if (!uid) return;
    setLoading(true);

    try {
      // 년/월 데이터를 제한하여 한정적으로 데이터 쿼리
      const q = getUserDateQuery(uid, "products", selectedYear, selectedMonth);

      const querySnapshot = await getDocs(q);
      const dataArray = querySnapshot.docs.map((doc) => ({
        _id: doc.id,
        ...doc.data(),
      }));

      setProducts(dataArray as ISalesProduct[]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [uid, selectedYear, selectedMonth]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return { products, loading, createProduct, salesProduct, deleteProduct, fetchProducts };
};
