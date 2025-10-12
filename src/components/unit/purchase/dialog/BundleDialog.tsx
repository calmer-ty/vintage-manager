import { toast } from "sonner";
import { Timestamp } from "firebase/firestore";

// 외부 요소
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Item, ItemContent, ItemTitle } from "@/components/ui/item";

import type z from "zod";
import type { Dispatch, SetStateAction } from "react";
import type { UseFormReturn } from "react-hook-form";
import type { PurchaseSchema } from "../schema";
import type { ICreatePurchaseBundleParams, IPurchaseSingle, IupdateSingleToBundledParams } from "@/types";
import type { RowSelectionState } from "@tanstack/react-table";
interface IBundleDialogProps {
  uid: string;
  form: UseFormReturn<z.infer<typeof PurchaseSchema>>;
  setRowSelection: Dispatch<SetStateAction<RowSelectionState>>;
  isBundleOpen: boolean;
  setIsBundleOpen: Dispatch<SetStateAction<boolean>>;
  bundleTargets: IPurchaseSingle[];
  updateSingleToBundled: ({ updateTargetIds }: IupdateSingleToBundledParams) => Promise<void>;
  createPurchaseBundle: ({ purchaseDoc }: ICreatePurchaseBundleParams) => Promise<void>;
}

export default function BundleDialog({ uid, form, setRowSelection, isBundleOpen, setIsBundleOpen, bundleTargets, updateSingleToBundled, createPurchaseBundle }: IBundleDialogProps) {
  const bundleTargetIds = bundleTargets.map((target) => target._id);

  const onClickCreate = async () => {
    try {
      const bundleItem = {
        _id: "",
        uid,
        products: bundleTargets,
        createdAt: Timestamp.fromDate(new Date()),
      };

      // 데이터 생성 및 리패치
      await updateSingleToBundled({ updateTargetIds: bundleTargetIds });
      await createPurchaseBundle({ purchaseDoc: bundleItem });

      // 등록 성공 후 폼 초기화 및 토스트 띄우기
      toast("✅ 상품이 성공적으로 통합되었습니다.");
      setIsBundleOpen(false);
      setRowSelection({});
      form.reset();
    } catch (error) {
      console.error("문서 추가 실패:", error);
    }
  };

  return (
    <>
      {/* 삭제 모달 */}
      <Dialog open={isBundleOpen} onOpenChange={setIsBundleOpen}>
        <DialogContent className="sm:max-w-100">
          <DialogHeader>
            <DialogTitle>상품을 통합하겠습니까?</DialogTitle>
            <DialogDescription>상품을 통합하면 복구할 수 없습니다.</DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-2">
            {bundleTargets.map((target) => (
              <Item variant="outline" key={target._id}>
                <ItemContent>
                  <ItemTitle>
                    {target.name} - {target.brand}
                  </ItemTitle>
                </ItemContent>
              </Item>
            ))}
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">취소</Button>
            </DialogClose>
            <Button variant="default" onClick={onClickCreate}>
              통합
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
