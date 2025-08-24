import { useState, useCallback, useEffect } from "react";
import { db } from "@/lib/firebase/firebaseApp";
import { addDoc, collection, doc, getDocs, updateDoc } from "firebase/firestore";

import { getUserDateQuery } from "@/lib/firebase/utils";

import type { ICreateProduct, IUpdateItemParams, IProduct2 } from "@/types";
interface IUseProductsProps {
  uid: string;
  selectedYear: number;
  selectedMonth: number;
}

// useAuth 훅을 만들어 Firebase 인증 상태를 관리
export const useProducts = ({ uid, selectedYear, selectedMonth }: IUseProductsProps) => {
  const [products, setProducts] = useState<IProduct2[]>([]);
  const [loading, setLoading] = useState(false);

  // 등록 함수
  const createProduct = async ({ currency, products, createdAt }: ICreateProduct) => {
    if (!uid) return;

    try {
      for (const product of products) {
        const docRef = await addDoc(collection(db, "products"), { uid, currency, ...product, createdAt });

        await updateDoc(docRef, {
          _id: docRef.id,
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ [수정]
  const updateProduct = async ({ updateTargetId, product }: IUpdateItemParams) => {
    if (!uid) return;

    try {
      const docRef = doc(db, "products", updateTargetId);

      await updateDoc(docRef, { ...product });
    } catch (err) {
      console.error(err);
    }
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

      setProducts(dataArray as IProduct2[]);
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
