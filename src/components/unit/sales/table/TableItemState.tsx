import { toast } from "sonner";

import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";

import type { ISalesProduct, ISoldProductParams } from "@/types";
interface ITableItemStateProps {
  product: ISalesProduct;
  soldProduct: ({ id, value }: ISoldProductParams) => Promise<void>;
  fetchProducts: () => Promise<void>;
}

export default function TableItemState({ product, soldProduct, fetchProducts }: ITableItemStateProps) {
  const onClickUpdate = async (id: string, value: boolean) => {
    // 판매가 지정해야함
    if (!product.sales.price) {
      toast("⛔ 판매가를 지정해주세요.");
      return;
    }
    try {
      await soldProduct({ id, value });
      await fetchProducts();
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
          onClickUpdate(product._id, true);
        } else {
          onClickUpdate(product._id, false);
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
