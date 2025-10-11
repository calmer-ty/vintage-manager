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

import FormInputWrap from "@/components/commons/inputWrap/form";
import ReceivingSelect from "../ReceivingSelect";

import { ShippingSchema } from "../schema";

import type { ICreateProductParams, IPackage, ISalesPackage, ISalesPackageParams } from "@/types";
import type { Dispatch, SetStateAction } from "react";
import type { z } from "zod";
interface ISaleDialogProps {
  uid: string;
  isSaleOpen: boolean;
  setIsSaleOpen: Dispatch<SetStateAction<boolean>>;
  saleTarget: IPackage | undefined;
  setSaleTarget: Dispatch<SetStateAction<IPackage | undefined>>;
  salesProductPackage: ({ updateTargetId, salesData }: ISalesPackageParams) => Promise<void>;
  fetchProductPackages: () => Promise<void>;
  createProduct: ({ uid, products }: ICreateProductParams) => Promise<void>;
}

export default function SaleDialog({ uid, isSaleOpen, setIsSaleOpen, saleTarget, setSaleTarget, createProduct, salesProductPackage, fetchProductPackages }: ISaleDialogProps) {
  // 환율 데이터
  const { currencyOptions } = useExchangeRate();

  // ✍️ 폼 설정
  const form = useForm<z.infer<typeof ShippingSchema>>({
    resolver: zodResolver(ShippingSchema),
    defaultValues: {
      shipping: {
        amount: 0,
        currency: { code: "", label: "", rate: 0, krw: 0 },
      },
      fee: {
        amount: 0,
        currency: { code: "", label: "", rate: 0, krw: 0 },
      },
    },
  });

  const onClickSalesPackage = async (data: z.infer<typeof ShippingSchema>) => {
    if (!saleTarget) {
      toast("⛔ 판매 등록할 패키지를 찾을 수 없습니다.");
      return;
    }
    if (!saleTarget) {
      toast("⛔ 판매 등록할 패키지를 찾을 수 없습니다.");
      return;
    }

    try {
      const salesData: ISalesPackage = {
        shipping: {
          amount: data.shipping.amount,
          currency: data.shipping.currency,
        },
        fee: {
          amount: data.fee.amount,
          currency: data.fee.currency,
        },
        addSaleAt: Timestamp.fromDate(new Date()),
      };

      await salesProductPackage({ updateTargetId: saleTarget._id, salesData });
      await createProduct({ uid, products: saleTarget.products });
      await fetchProductPackages();
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
        currency: { code: "", label: "", rate: 0, krw: 0 },
      },
      fee: {
        amount: 0,
        currency: { code: "", label: "", rate: 0, krw: 0 },
      },
    });
  }, [form, saleTarget]);

  return (
    <>
      <Dialog
        open={isSaleOpen}
        onOpenChange={(open) => {
          if (!open) {
            setIsSaleOpen(false);
            setSaleTarget(undefined);
          } else {
            setIsSaleOpen(true);
          }
        }}
      >
        <DialogContent className="sm:max-w-120">
          <DialogHeader>
            <DialogTitle>입고된 패키지를 판매 등록하시겠습니까?</DialogTitle>
            <DialogDescription>선택한 패키지를 판매 등록하면 수정할 수 없습니다.</DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onClickSalesPackage)} className="flex flex-col gap-6">
              <fieldset className="flex flex-col gap-4 px-2">
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
                      <ReceivingSelect
                        onChange={(code) => {
                          const selected = currencyOptions.find((opt) => opt.code === code);
                          if (selected) {
                            field.onChange({ ...field.value, currency: selected });
                          }
                        }}
                        value={field.value.currency}
                      />
                    </div>
                  )}
                ></FormField>
                <FormField
                  control={form.control}
                  name="fee"
                  render={({ field }) => (
                    <div className="flex items-start gap-2">
                      <FormInputWrap title="수수료" tooltip="수수료 발생 시 입력하세요. 실시간 환율이 적용되므로 추후 수정이 불가합니다.">
                        <Input
                          type="number"
                          className="bg-white"
                          placeholder="사용한 통화 기준으로 작성"
                          value={field.value.amount}
                          onChange={(e) => field.onChange({ ...field.value, amount: Number(e.target.value) })}
                        />
                      </FormInputWrap>
                      <ReceivingSelect
                        value={field.value.currency}
                        onChange={(code) => {
                          const selected = currencyOptions.find((opt) => opt.code === code);
                          if (selected) {
                            field.onChange({ ...field.value, currency: selected });
                          }
                        }}
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
