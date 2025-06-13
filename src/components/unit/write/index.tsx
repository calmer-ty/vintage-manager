import { IItemData } from "@/commons/types";
import { useCallback, useEffect, useState } from "react";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { db } from "@/commons/libraries/firebase/firebaseApp";

import ItemTable from "./itemTable";
import ItemInput from "./itemInput";
// import WriteChart from "./chart";

export default function ItemWrite({ userId }: { userId: string }) {
  const [itemDataArray, setItemDataArray] = useState<IItemData[]>([]);

  // 📄 조회 함수
  const readData = useCallback(async () => {
    const q = query(collection(db, "income"), where("userId", "==", userId), orderBy("createdAt", "desc"));

    const querySnapshot = await getDocs(q);
    const dataArray = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    setItemDataArray(dataArray as IItemData[]);
  }, [userId, setItemDataArray]);
  // 처음 로드 시 데이터를 한 번만 조회
  useEffect(() => {
    readData();
  }, [readData]);

  return (
    <article className="flex flex-col justify-center items-center gap-4 w-full h-full px-4 bg-gray-100">
      <ItemInput userId={userId} readData={readData} />
      <ItemTable data={itemDataArray} />
      {/* <WriteChart /> */}
    </article>
  );
}
