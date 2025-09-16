// 라이브러리
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/firebaseApp";

// 외부 요소
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";

import type { IProduct } from "@/types";
interface IManagementSelectProps {
  item: IProduct;
  refetch: () => Promise<void>;
}

export default function ItemState({ item, refetch }: IManagementSelectProps) {
  // 판매상태 함수
  const onUpdate = async (id: string, value: boolean) => {
    try {
      const docRef = doc(db, "items", id);

      // 문서 ID를 포함한 데이터로 업데이트
      await updateDoc(docRef, {
        soldAt: value ? new Date() : null,
      });
      refetch();
    } catch (error) {
      console.error("문서 추가 실패:", error);
    }
  };

  return (
    <Select
      value={item.soldAt ? "true" : "false"}
      onValueChange={(value) => {
        // 선택된 값이 'false'면 판매완료니까 업데이트 실행
        if (value === "true") {
          onUpdate(item._id, true);
        } else {
          onUpdate(item._id, false);
        }
      }}
    >
      <SelectTrigger className="w-26">
        <SelectValue placeholder="상태 선택" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>상태</SelectLabel>
          <SelectItem value="false">판매중</SelectItem>
          <SelectItem value="true">판매완료</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
