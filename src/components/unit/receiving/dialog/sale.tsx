import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { useExchangeRate } from "@/hooks/useExchangeRate";

// 외부 요소
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormField } from "@/components/ui/form";

import FormInputWrap from "@/components/commons/inputWrap/form";
import CurrencySelect from "./currencySelect";

import { ShippingSchema } from "./schema";

import type { ICreateProductParams, IProductPackage, IUpdateProductPackage, IUpdateProductPackageParams } from "@/types";
import type { Dispatch, SetStateAction } from "react";
import type { z } from "zod";
interface IReceivingSaleProps {
  uid: string;
  isSaleOpen: boolean;
  setIsSaleOpen: Dispatch<SetStateAction<boolean>>;
  saleTarget: IProductPackage | undefined;
  setSaleTarget: Dispatch<SetStateAction<IProductPackage | undefined>>;

  onClickMoveToSale: (rowId: string) => void;

  updateProductPackage: ({ updateTargetId, productPackage }: IUpdateProductPackageParams) => Promise<void>;
  createProduct: ({ uid, products }: ICreateProductParams) => Promise<void>;
}

export default function ReceivingSale({ uid, isSaleOpen, setIsSaleOpen, saleTarget, setSaleTarget, createProduct, updateProductPackage }: IReceivingSaleProps) {
  // 환율 데이터
  const { currencyOptions } = useExchangeRate();

  // ✍️ 폼 설정
  const form = useForm<z.infer<typeof ShippingSchema>>({
    resolver: zodResolver(ShippingSchema),
    // prettier-ignore
    defaultValues: {
       shipping : {
        amount: "",
        currency: "",
       }
    },
  });

  const onClickSaleCreate = async (data: z.infer<typeof ShippingSchema>) => {
    console.log("클릭");
    if (!saleTarget) {
      toast("⛔ 판매 등록할 패키지를 찾을 수 없습니다.");
      return;
    }

    try {
      const productPackage: IUpdateProductPackage = {
        shipping: {
          amount: data.shipping.amount,
          currency: data.shipping.currency,
        },
      };

      await updateProductPackage({ updateTargetId: saleTarget._id, productPackage });
      await createProduct({ uid, products: saleTarget.products });

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
        amount: "",
        currency: "",
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
        <DialogContent className="sm:max-w-100">
          <DialogHeader>
            <DialogTitle>입고된 패키지를 판매 등록하시겠습니까?</DialogTitle>
            <DialogDescription>선택한 패키지를 판매 등록하면 수정할 수 없습니다.</DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onClickSaleCreate)} className="flex flex-col gap-6">
              <FormField
                control={form.control}
                name="shipping"
                render={({ field }) => (
                  <div className="flex items-start gap-2">
                    <FormInputWrap title="배송비 & 대행비" tooltip="배송비 발생 시 입력하세요. 실시간 환율이 적용되므로 추후 수정이 불가합니다.">
                      <Input
                        type="number"
                        className="bg-white"
                        placeholder="사용한 통화 기준으로 작성"
                        value={field.value.amount}
                        onChange={(e) => field.onChange({ ...field.value, amount: e.target.value })}
                      />
                    </FormInputWrap>
                    <CurrencySelect
                      items={currencyOptions}
                      value={field.value.currency}
                      onChange={(selectedValue) => {
                        const selected = currencyOptions.find((opt) => opt.value === selectedValue);
                        if (selected) {
                          field.onChange({ ...field.value, currency: JSON.stringify(selected) });
                        }
                      }}
                    />
                  </div>
                )}
              ></FormField>

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
