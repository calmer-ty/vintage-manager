import { toast } from "sonner";
import { Timestamp } from "firebase/firestore";

// 외부 요소
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Item, ItemContent } from "@/components/ui/item";

import type z from "zod";
import type { Dispatch, SetStateAction } from "react";
import type { UseFormReturn } from "react-hook-form";
import type { PurchaseSchema } from "../schema";
import type { IMergePurchasePackageParams, IPurchasePackage } from "@/types";
import type { RowSelectionState } from "@tanstack/react-table";
interface IMergeDialogProps {
  uid: string;
  form: UseFormReturn<z.infer<typeof PurchaseSchema>>;
  setRowSelection: Dispatch<SetStateAction<RowSelectionState>>;
  isMergeOpen: boolean;
  setIsMergeOpen: Dispatch<SetStateAction<boolean>>;
  mergeTargets: IPurchasePackage[];
  mergePurchasePackage: ({ packageDoc }: IMergePurchasePackageParams) => Promise<void>;
}

export default function MergeDialog({ uid, form, setRowSelection, isMergeOpen, setIsMergeOpen, mergeTargets, mergePurchasePackage }: IMergeDialogProps) {
  const mergeTargetIds = mergeTargets.map((target) => target._id);
  const mergeTargetProducts = mergeTargets.flatMap((target) => target.products);
  // console.log("mergeTargets: ", mergeTargets);
  // console.log("mergeTargetProducts: ", mergeTargetProducts);

  const onClickMerge = async () => {
    try {
      const packageDoc = {
        _id: "",
        uid,
        products: mergeTargetProducts,
        createdAt: Timestamp.fromDate(new Date()),
      };

      // 데이터 생성 및 리패치
      await mergePurchasePackage({ deleteTargets: mergeTargetIds, packageDoc });
      // await createPurchaseBundle({ purchaseDoc: bundleItem });

      // 등록 성공 후 폼 초기화 및 토스트 띄우기
      toast("✅ 상품이 성공적으로 통합되었습니다.");
      setIsMergeOpen(false);
      setRowSelection({});
      form.reset();
    } catch (error) {
      console.error("문서 추가 실패:", error);
    }
  };

  return (
    <>
      {/* 삭제 모달 */}
      <Dialog open={isMergeOpen} onOpenChange={setIsMergeOpen}>
        <DialogContent className="sm:max-w-100">
          <DialogHeader>
            <DialogTitle>패키지를 통합하겠습니까?</DialogTitle>
            <DialogDescription>패키지를 통합하면 복구할 수 없습니다.</DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-2">
            {mergeTargets.map((target) => (
              <Item variant="outline" key={target._id} className="flex-col justify-start">
                {target.products.map((p) => {
                  console.log("p:", p);
                  return (
                    <ItemContent key={p._id} className="w-full">
                      {p.name} - {p.brand} / {p.costPrice.amount} {p.costPrice.exchange.label}
                    </ItemContent>
                  );
                })}
              </Item>
            ))}
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">취소</Button>
            </DialogClose>
            <Button variant="default" onClick={onClickMerge}>
              통합
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
