import { useCallback, useEffect, useState } from "react";

import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase/firebaseApp";

import DataTable from "@/components/commons/table/data";

import { IItemData } from "@/types";

const columnConfig = [
  { key: "category", label: "상품 종류" },
  { key: "brandName", label: "브랜드명" },
  { key: "name", label: "상품명" },
  { key: "price", label: "가격(단위)" },
  { key: "priceKRW", label: "가격(원)" },
];

export default function ManagementUI({ uid }: { uid: string }) {
  const [itemDataArray, setItemDataArray] = useState<IItemData[]>([]);

  // 📄 조회 함수
  const refetch = useCallback(async () => {
    const q = query(
      // 	Firestore에서 "products"이라는 이름의 컬렉션을 선택
      collection(db, "products"),
      // uid 필드가 uid 변수(로그인한 사용자 등)와 같은 문서만 필터
      where("uid", "==", uid),
      // 그 필터된 문서들을 createdAt(생성 시각) 기준으로 내림차순(최신순) 정렬
      orderBy("createdAt", "desc")
    );

    const querySnapshot = await getDocs(q);
    const dataArray = querySnapshot.docs.map((doc) => ({
      _id: doc.id,
      ...doc.data(),
    }));

    setItemDataArray(dataArray as IItemData[]);
  }, [uid, setItemDataArray]);
  // 처음 로드 시 데이터를 한 번만 조회
  useEffect(() => {
    refetch();
  }, [refetch]);

  return (
    <article className="flex flex-col justify-center items-center gap-4 w-full h-full px-20">
      <DataTable data={itemDataArray} uid={uid} refetch={refetch} columnConfig={columnConfig} />
    </article>
  );
}
