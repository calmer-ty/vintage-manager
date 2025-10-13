import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Timestamp } from "firebase/firestore";

import { useExchangeRate } from "@/hooks/useExchangeRate";

// 외부 요소
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormField } from "@/components/ui/form";
import { Item } from "@/components/ui/item";

import FormInputWrap from "@/components/commons/FormInputWrap";
import PurchaseSelect from "../PurchaseSelect";

import { ShippingSchema } from "../schema";

import type { ICreateProductParams, IPurchasePackage, ISalesPackage, ISalesPackageParams } from "@/types";
import type { Dispatch, SetStateAction } from "react";
import type { z } from "zod";
interface ISaleDialogProps {
  isSaleOpen: boolean;
  setIsSaleOpen: Dispatch<SetStateAction<boolean>>;
  salesTarget: IPurchasePackage | undefined;
  fetchPurchasePackages: () => Promise<void>;
  salesPackage: ({ salesTarget, salesDoc }: ISalesPackageParams) => Promise<void>;
  createProduct: ({ products }: ICreateProductParams) => Promise<void>;
}

export default function SaleDialog({ isSaleOpen, setIsSaleOpen, salesTarget, salesPackage, fetchPurchasePackages, createProduct }: ISaleDialogProps) {
  // 환율 데이터
  const { exchangeOptions } = useExchangeRate();

  // ✍️ 폼 설정
  const form = useForm<z.infer<typeof ShippingSchema>>({
    resolver: zodResolver(ShippingSchema),
    defaultValues: {
      shipping: {
        amount: 0,
        exchange: { code: "", label: "", rate: 0, krw: 0 },
      },
    },
  });

  const onClickSales = async (data: z.infer<typeof ShippingSchema>) => {
    console.log("salesTarget: ", salesTarget);
    if (!salesTarget) {
      toast("⛔ 판매 등록할 패키지를 찾을 수 없습니다.");
      return;
    }

    try {
      const salesDoc: ISalesPackage = {
        shipping: {
          amount: data.shipping.amount,
          exchange: data.shipping.exchange,
        },
        addSaleAt: Timestamp.fromDate(new Date()),
      };

      await salesPackage({ salesTarget: salesTarget._id, salesDoc });
      await createProduct({ products: salesTarget.products });
      await fetchPurchasePackages();
      toast("✅ 선택한 패키지가 판매 등록되었습니다.");
      setIsSaleOpen(false);
      form.reset();
    } catch (error) {
      console.error("문서 추가 실패:", error);
    }
  };

  // updateTarget 변경 시 form 값을 리셋
  useEffect(() => {
    form.reset({
      shipping: {
        amount: 0,
        exchange: { code: "", label: "", rate: 0, krw: 0 },
      },
    });
  }, [form, salesTarget]);

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
            <Item variant="outline" className="flex-col justify-start">
              {/* {salesTarget?.products[0].name} - {salesTarget?.products[0].brand} */}
              {salesTarget?.products.map((p) => (
                <div key={p._id} className="w-full">
                  {p.brand} - {p.name} / {p.costPrice.amount} {p.costPrice.exchange.label}
                </div>
              ))}
            </Item>
          </div>

          <p className="text-muted-foreground text-sm">패키지에 대한 배송료를 입력해주세요.</p>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onClickSales)} className="flex flex-col gap-6">
              <fieldset className="flex flex-col gap-4">
                <FormField
                  control={form.control}
                  name="shipping"
                  render={({ field }) => (
                    <div className="flex items-start gap-2">
                      <FormInputWrap title="배송비" tooltip="배송비 발생 시 입력하세요. 실시간 환율이 적용되므로 추후 수정이 불가합니다.">
                        <Input
                          type="number"
                          className="bg-white"
                          placeholder="사용한 통화 기준으로 작성"
                          value={field.value.amount}
                          onChange={(e) => field.onChange({ ...field.value, amount: Number(e.target.value) })}
                        />
                      </FormInputWrap>
                      <PurchaseSelect
                        onChange={(code) => {
                          const selected = exchangeOptions.find((opt) => opt.code === code);
                          if (selected) {
                            field.onChange({ ...field.value, exchange: selected });
                          }
                        }}
                        value={field.value.exchange}
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
