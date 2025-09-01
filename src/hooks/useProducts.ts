import { useState, useCallback, useEffect } from "react";
import { db } from "@/lib/firebase/firebaseApp";
import { addDoc, collection, deleteDoc, doc, getDocs, query, updateDoc, where } from "firebase/firestore";

import { getUserDateQuery } from "@/lib/firebase/utils";

import type { ICreateProductParams, IUpdateProductParams, IProduct } from "@/types";
interface IUseProductsParams {
  uid: string;
  selectedYear: number;
  selectedMonth: number;
}

// 패키지 상태에 따라 종속적으로 데이터 처리
export const useProducts = ({ uid, selectedYear, selectedMonth }: IUseProductsParams) => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(false);

  // 등록 함수
  const createProduct = async ({ packageId, uid, currency, products, createdAt }: ICreateProductParams) => {
    if (!uid) return;

    try {
      for (const product of products) {
        const docRef = await addDoc(collection(db, "products"), { packageId, uid, currency, ...product, createdAt });

        await updateDoc(docRef, {
          _id: docRef.id,
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  // [수정]
  const updateProduct = async ({ targetId, product }: IUpdateProductParams) => {
    if (!uid) return;

    console.log("targetId: ", targetId);

    try {
      const docRef = doc(db, "products", targetId);

      await updateDoc(docRef, { ...product });
    } catch (err) {
      console.error(err);
    }
  };

  // [삭제]
  const deleteProduct = async (packageIds: string[]) => {
    for (const packageId of packageIds) {
      const q = query(collection(db, "products"), where("packageId", "==", packageId));
      const querySnapshot = await getDocs(q);

      for (const productDoc of querySnapshot.docs) {
        try {
          await deleteDoc(doc(db, "products", productDoc.id));
          console.log(`Product ID ${productDoc.id} 삭제 성공`);
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

  return { products, loading, createProduct, updateProduct, deleteProduct, fetchProducts };
};
