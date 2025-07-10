import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/firebaseApp";

import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";

import { IItemData } from "@/types";

export default function ManagementSelect({ itemData, refetch }: { itemData: IItemData; refetch: () => Promise<void> }) {
  // 판매상태 함수
  const onUpdate = async (id: string, value: boolean) => {
    try {
      const docRef = doc(db, "items", id);

      // 문서 ID를 포함한 데이터로 업데이트
      await updateDoc(docRef, {
        isSold: value,
      });
      refetch();
      console.log(`isSold 값을 ${value}로 업데이트했습니다`);
    } catch (error) {
      console.error("문서 추가 실패:", error);
    }
  };

  return (
    <Select
      defaultValue={itemData.isSold ? "true" : "false"}
      onValueChange={(value) => {
        // 선택된 값이 'false'면 판매완료니까 업데이트 실행
        if (value === "true") {
          onUpdate(itemData._id, true);
        } else {
          onUpdate(itemData._id, false);
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
