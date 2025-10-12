import { useEffect, useState } from "react";
import { Timestamp } from "firebase/firestore";
import { toast } from "sonner";

import { useExchangeRate } from "@/hooks/useExchangeRate";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormField } from "@/components/ui/form";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

import FormInputWrap from "@/components/commons/FormInputWrap";
import PurchaseSelect from "../PurchaseSelect";

import type { z } from "zod";
import type { Dispatch, SetStateAction } from "react";
import type { ICreatePurchaseSingleParams } from "@/types";
import type { UseFormReturn } from "react-hook-form";
import type { PurchaseSchema } from "../schema";
interface IWriteDialogProps {
  uid: string;
  form: UseFormReturn<z.infer<typeof PurchaseSchema>>;
  isWriteOpen: boolean;
  setIsWriteOpen: Dispatch<SetStateAction<boolean>>;
  createPurchaseSingle: ({ purchaseDoc }: ICreatePurchaseSingleParams) => Promise<void>;
  fetchPurchaseSingle: () => Promise<void>;
}

export default function WriteDialog({ uid, form, isWriteOpen, setIsWriteOpen, createPurchaseSingle, fetchPurchaseSingle }: IWriteDialogProps) {
  // 환율 데이터
  const { exchangeOptions } = useExchangeRate();

  // 사용할 화폐
  const [currency, setCurrency] = useState("USD");
  const selectedExchange = exchangeOptions.find((opt) => opt.code === currency) ?? { code: "", label: "", rate: 0, krw: 0 };

  // 등록 함수
  const onClickCreate = async (data: z.infer<typeof PurchaseSchema>) => {
    try {
      const singleItem = {
        _id: "",
        uid,
        ...data,
        costPrice: { amount: data.costPrice.amount, exchange: selectedExchange },
        createdAt: Timestamp.fromDate(new Date()),
        isBundle: false,
      };

      // 데이터 생성 및 리패치
      await createPurchaseSingle({ purchaseDoc: singleItem });
      await fetchPurchaseSingle();

      // 등록 성공 후 폼 초기화 및 토스트 띄우기
      toast("✅ 상품이 성공적으로 등록되었습니다.");
      setIsWriteOpen(false);
      form.reset();
    } catch (error) {
      console.error("문서 추가 실패:", error);
    }
  };

  useEffect(() => {
    form.reset({
      name: "",
      brand: "",
      costPrice: { amount: 0, exchange: { code: "", label: "", rate: 0, krw: 0 } },
    });
  }, [form]);

  return (
    <Dialog
      open={isWriteOpen}
      onOpenChange={(open) => {
        if (!open) {
          form.reset();
          setIsWriteOpen(false);
        } else {
          setIsWriteOpen(true);
        }
      }}
    >
      <DialogContent className="max-w-120">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onClickCreate)} className="flex flex-col gap-4">
            <DialogHeader>
              <DialogTitle>패키지 등록</DialogTitle>
              <DialogDescription>패키지 정보를 입력하고 등록하세요.</DialogDescription>
            </DialogHeader>

            <PurchaseSelect
              onChange={(code) => {
                setCurrency(code);
              }}
              value={currency}
            />
            <div className="flex-1 overflow-y-auto max-h-100">
              <h3 className="flex justify-between items-center mb-4 px-3 py-1 border-t bg-gray-200">
                <span className="text-sm font-bold">매입 상품</span>
              </h3>

              <fieldset className="flex flex-col gap-4 px-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormInputWrap title="제품명">
                      <Input placeholder="예) 럭비 셔츠" {...field} className="bg-white" autoComplete="off" />
                    </FormInputWrap>
                  )}
                />
                <FormField
                  control={form.control}
                  name="brand"
                  render={({ field }) => (
                    <FormInputWrap title="브랜드명">
                      <Input placeholder="예) 엘엘빈" {...field} className="bg-white" autoComplete="off" />
                    </FormInputWrap>
                  )}
                />
                <FormField
                  control={form.control}
                  name="costPrice"
                  render={({ field }) => (
                    <div className="flex items-start gap-2">
                      <FormInputWrap title="매입가" tooltip="매입가는 실시간 환율이 적용되므로 추후 수정이 불가합니다.">
                        <Input
                          type="number"
                          placeholder="예) 1000"
                          className="bg-white"
                          value={field.value.amount}
                          onChange={(e) => field.onChange({ ...field.value, amount: Number(e.target.value) })}
                        />
                      </FormInputWrap>
                    </div>
                  )}
                ></FormField>
              </fieldset>
            </div>

            <DialogFooter className="mt-4">
              <DialogClose asChild>
                <Button variant="outline">취소</Button>
              </DialogClose>
              <Button type="submit">등록</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
