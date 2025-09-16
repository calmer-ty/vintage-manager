// 라이브러리
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/firebaseApp";
import { toast } from "sonner";

// 외부 요소
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";

import type { IProduct } from "@/types";
interface IItemStateProps {
  product: IProduct;
  refetch: () => Promise<void>;
}

export default function ItemState({ product, refetch }: IItemStateProps) {
  const onUpdate = async (id: string, value: boolean) => {
    // 판매가 지정해야함
    if (!product.salePrice) {
      toast(<p className="font-bold">⛔ 판매가를 지정해주세요.</p>, {
        action: {
          label: "닫기",
          onClick: () => {},
        },
        position: "top-center",
        descriptionClassName: "ml-5",
      });
      return;
    }
    try {
      const docRef = doc(db, "products", id);

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
      value={product.soldAt ? "sold" : "available"}
      onValueChange={(value) => {
        // 선택된 값이 'false'면 판매완료니까 업데이트 실행
        if (value === "sold") {
          onUpdate(product._id, true);
        } else {
          onUpdate(product._id, false);
        }
      }}
    >
      <SelectTrigger className="w-26">
        <SelectValue placeholder="상태 선택" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>상태</SelectLabel>
          <SelectItem value="available">판매중</SelectItem>
          <SelectItem value="sold">판매완료</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
