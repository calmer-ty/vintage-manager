import { useState, useCallback, useEffect } from "react";
import { db } from "@/lib/firebase/firebaseApp";
import { addDoc, collection, deleteDoc, doc, getDocs, serverTimestamp, updateDoc } from "firebase/firestore";

import { useAuthStore } from "@/store/useAuthStore";
import { getUserDateQuery } from "@/lib/firebase/utils";

import type { IMergePackageParams, IPackage, IProduct, ISalesPackageParams } from "@/types";
interface IUsePackagesParams {
  selectedYear: number;
  selectedMonth: number;
}

export const usePackages = ({ selectedYear, selectedMonth }: IUsePackagesParams) => {
  const { user } = useAuthStore();

  const [packages, setPackages] = useState<IPackage[]>([]);
  const [fetchLoading, setFetchLoading] = useState(false);

  // [등록]
  const createPackage = async (packageDoc: IProduct[]) => {
    if (!user) return;

    try {
      const docRef = await addDoc(collection(db, "packages"), {
        uid: user.uid,
        _id: "",
        products: packageDoc,
        createdAt: serverTimestamp(),
        shipping: null,
        addSaleAt: null,
      });

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
    if (!user) return;

    try {
      const docRef = await addDoc(collection(db, "packages"), { products: packageDoc, uid: user.uid, createdAt: serverTimestamp() });
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

  // [수정] - 상품 패키지의 판매등록, 국제 배송료 추가 입력이 됨
  const salesPackage = async ({ salesTarget, salesDoc }: ISalesPackageParams) => {
    if (!user) return;

    try {
      const docRef = doc(db, "packages", salesTarget);

      await updateDoc(docRef, { shipping: salesDoc, addSaleAt: serverTimestamp() });
    } catch (err) {
      console.error(err);
    }
  };

  // [삭제]
  const deletePackage = async (deleteTargets: string[]) => {
    if (!user) return;

    for (const id of deleteTargets) {
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
    if (!user) return;

    const uid = user.uid;
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
  }, [user, selectedYear, selectedMonth]);

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
