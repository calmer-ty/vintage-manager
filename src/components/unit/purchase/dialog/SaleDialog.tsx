import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { useExchangeRate } from "@/hooks/useExchangeRate";
import { getDisplayPrice } from "@/lib/price";

// 외부 요소
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormField } from "@/components/ui/form";
import { Item, ItemContent } from "@/components/ui/item";

import FormInputWrap from "@/components/commons/FormInputWrap";
import PurchaseSelect from "../PurchaseSelect";

import { SalesSchema } from "../schema";

import type { ICreateProductDoc, ICreateProductParams, IPackage, ISalesPackageDoc, ISalesPackageParams } from "@/types";
import type { Dispatch, SetStateAction } from "react";
import type { z } from "zod";
import type { RowSelectionState } from "@tanstack/react-table";
interface ISaleDialogProps {
  setRowSelection: Dispatch<SetStateAction<RowSelectionState>>;
  isSaleOpen: boolean;
  setIsSaleOpen: Dispatch<SetStateAction<boolean>>;
  salesTarget: IPackage | undefined;
  fetchPackages: () => Promise<void>;
  salesPackage: ({ salesTarget, salesDoc }: ISalesPackageParams) => Promise<void>;
  createProduct: ({ productDocs }: ICreateProductParams) => Promise<void>;
}

export default function SaleDialog({
  setRowSelection,
  isSaleOpen,
  setIsSaleOpen,
  salesTarget,
  salesPackage,
  fetchPackages,
  createProduct,
}: ISaleDialogProps) {
  // 환율 데이터
  const { exchangeOptions } = useExchangeRate();
  const krwExchange = exchangeOptions.find((opt) => opt.code === "KRW");

  // ✍️ 폼 설정
  const form = useForm<z.infer<typeof SalesSchema>>({
    resolver: zodResolver(SalesSchema),
    defaultValues: { cost: { shipping: 0, exchange: krwExchange } },
  });

  const onClickSales = async (data: z.infer<typeof SalesSchema>) => {
    if (!salesTarget) {
      toast("⛔ 판매 등록할 패키지를 찾을 수 없습니다.");
      return;
    }

    try {
      const salesDoc: ISalesPackageDoc = {
        shipping: {
          amount: data.cost.shipping ?? 0,
          exchange: data.cost.exchange,
        },
      };
      const productDocs: ICreateProductDoc[] = salesTarget.products.map((p) => ({
        ...p,
        cost: {
          price: p.cost.price,
          exchange: p.cost.exchange,
        },
      }));

      await salesPackage({ salesTarget: salesTarget._id, salesDoc });
      await createProduct({ productDocs });
      await fetchPackages();
      toast("✅ 선택한 패키지가 판매 등록되었습니다.");
      setIsSaleOpen(false);
      setRowSelection({});
      form.reset();
    } catch (error) {
      console.error("문서 추가 실패:", error);
    }
  };

  return (
    <>
      <Dialog
        open={isSaleOpen}
        onOpenChange={(open) => {
          if (!open) {
            setIsSaleOpen(false);
          } else {
            setIsSaleOpen(true);
          }
        }}
      >
        <DialogContent className="sm:max-w-120">
          <DialogHeader>
            <DialogTitle>패키지를 판매 등록하시겠습니까?</DialogTitle>
            <DialogDescription>선택한 패키지를 판매 등록하면 수정할 수 없습니다.</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-2">
            <Item variant="outline">
              <ItemContent className="w-full">
                {salesTarget?.products.map((p) => (
                  <div key={p._id} className="p-2 rounded-md bg-gray-100">
                    <div>
                      <span className="font-semibold">상품명:</span> {p.name}({p.brand || "브랜드 없음"})
                    </div>
                    <div>
                      <span className="font-semibold">매입가:</span> {getDisplayPrice(p.cost.exchange.code, p.cost.price)}
                    </div>
                  </div>
                ))}
              </ItemContent>
            </Item>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onClickSales)} className="flex flex-col gap-6">
              <fieldset className="flex flex-col gap-4">
                <FormField
                  control={form.control}
                  name="cost"
                  render={({ field }) => (
                    <div className="flex items-start gap-2">
                      <FormInputWrap title="국제 배송료" tooltip="국제 배송료 발생 시 입력하세요.">
                        <Input
                          type="number"
                          className="bg-white"
                          placeholder="사용한 통화 기준으로 작성"
                          value={field.value.shipping}
                          onChange={(e) => field.onChange({ ...field.value, shipping: Number(e.target.value) })}
                          onWheel={(e) => e.currentTarget.blur()}
                        />
                      </FormInputWrap>
                      <PurchaseSelect
                        onChange={(code) => {
                          const selected = exchangeOptions.find((opt) => opt.code === code);
                          if (selected) {
                            field.onChange({ ...field.value, exchange: selected });
                          }
                        }}
                        value={field.value?.exchange?.code}
                        label="통화"
                        messageStyles="opacity-0"
                      />
                    </div>
                  )}
                ></FormField>
              </fieldset>

              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">취소</Button>
                </DialogClose>
                <Button type="submit" variant="default">
                  등록
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
