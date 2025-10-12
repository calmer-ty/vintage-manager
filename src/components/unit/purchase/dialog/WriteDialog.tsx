import { useEffect, useState } from "react";
import { useFieldArray } from "react-hook-form";
import { Timestamp } from "firebase/firestore";
import { toast } from "sonner";

import { useExchangeRate } from "@/hooks/useExchangeRate";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormField } from "@/components/ui/form";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PlusCircle, X } from "lucide-react";

import FormInputWrap from "@/components/commons/FormInputWrap";
import PurchaseSelect2 from "../PurchaseSelect2";
// import ReceivingSelect from "../ReceivingSelect";

import type { z } from "zod";
import type { Dispatch, SetStateAction } from "react";
import type { ICreatePurchaseParams, IPurchase } from "@/types";
import type { UseFormReturn } from "react-hook-form";
import type { PurchaseSchema } from "../schema";
interface IWriteDialogProps {
  uid: string;
  form: UseFormReturn<z.infer<typeof PurchaseSchema>>;
  isWriteOpen: boolean;
  setIsWriteOpen: Dispatch<SetStateAction<boolean>>;
  updateTarget: IPurchase | undefined;
  setUpdateTarget: Dispatch<SetStateAction<IPurchase | undefined>>;
  createPurchase: ({ purchase }: ICreatePurchaseParams) => Promise<void>;
  fetchPurchases: () => Promise<void>;
}

export default function WriteDialog({ uid, form, isWriteOpen, setIsWriteOpen, updateTarget, setUpdateTarget, createPurchase, fetchPurchases }: IWriteDialogProps) {
  const isEdit = !!updateTarget;

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "products",
  });

  // 환율 데이터
  const { exchangeOptions } = useExchangeRate();

  // 사용할 화폐
  const [currency, setCurrency] = useState("USD");
  const selectedExchange = exchangeOptions.find((opt) => opt.code === currency) ?? { code: "", label: "", rate: 0, krw: 0 };

  // 등록 함수
  const onClickCreate = async (data: z.infer<typeof PurchaseSchema>) => {
    try {
      const purchase = {
        ...data,
        uid,
        _id: "",
        currency,
        products: data.products.map((p) => ({
          ...p,
          costPrice: { amount: p.costPrice.amount, exchange: selectedExchange },
        })),
        shipping: {
          amount: 0,
          exchange: { code: "", label: "", rate: 0, krw: 0 },
        },
        fee: {
          amount: 0,
          exchange: { code: "", label: "", rate: 0, krw: 0 },
        },
        createdAt: Timestamp.fromDate(new Date()),
        addSaleAt: null,
      };

      // 데이터 생성 및 리패치
      await createPurchase({ purchase });
      await fetchPurchases();

      // 등록 성공 후 폼 초기화 및 토스트 띄우기
      toast("✅ 상품이 성공적으로 등록되었습니다.");
      setIsWriteOpen(false);
      form.reset();
    } catch (error) {
      console.error("문서 추가 실패:", error);
    }
  };

  // 수정 함수
  // const onClickUpdate = async (data: z.infer<typeof PurchaseSchema>) => {
  //   if (!isEdit) return;

  // 추후 개발 필요
  //   const hasChanges = Object.keys(form.formState.dirtyFields).length > 0;
  //   if (!hasChanges) {
  //     toast("✨ 변경된 내용이 없습니다.");
  //     return;
  //   }

  //   try {
  //     const products: IUpdateProducts = {
  //       ...data,
  //       products: data.products.map((p) => ({
  //         ...p,
  //         costPrice: { amount: p.costPrice.amount, exchange: selectedExchange },
  //       })),
  //     };

  //     // 데이터 수정 및 리패치
  //     await updateProductPackage({ updateTargetId: updateTarget._id, products });
  //     await fetchProductPackages();

  //     toast("🔄 패키지가 성공적으로 수정되었습니다.");
  //     setIsWriteOpen(false);
  //     setUpdateTarget(undefined);
  //     form.reset();
  //   } catch (error) {
  //     console.error("문서 추가 실패:", error);
  //   }
  // };

  // 상품 추가 버튼
  const onClickAddProduct = () => {
    append({
      name: "",
      brand: "",
      costPrice: { amount: 0, exchange: { code: "", label: "", rate: 0, krw: 0 } },
    });
  };

  // updateTarget 변경 시 form 값을 리셋
  useEffect(() => {
    if (isEdit) {
      form.reset({
        products: updateTarget.products.map((p) => ({
          name: p.name,
          brand: p.brand,
          costPrice: {
            amount: p.costPrice?.amount,
            exchange: {
              code: p.costPrice?.exchange.code,
              label: p.costPrice?.exchange.label,
              rate: p.costPrice?.exchange.rate,
              krw: p.costPrice?.exchange.krw,
            },
          },
        })),
      });
    } else {
      form.reset({
        products: [
          {
            name: "",
            brand: "",
            costPrice: { amount: 0, exchange: { code: "", label: "", rate: 0, krw: 0 } },
          },
        ],
      });
    }
  }, [form, isWriteOpen, isEdit, updateTarget]);

  return (
    <Dialog
      open={isWriteOpen}
      onOpenChange={(open) => {
        if (!open) {
          form.reset();
          setIsWriteOpen(false);
          setUpdateTarget(undefined);
        } else {
          setIsWriteOpen(true);
        }
      }}
    >
      <DialogContent className="max-w-120">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onClickCreate)} className="flex flex-col gap-4">
            <DialogHeader>
              <DialogTitle>패키지 {isEdit ? "수정" : "등록"}</DialogTitle>
              <DialogDescription>패키지 정보를 입력하고 등록하세요.</DialogDescription>
            </DialogHeader>

            <PurchaseSelect2
              onChange={(code) => {
                setCurrency(code);
              }}
              value={currency}
              disabled={!!updateTarget?.currency}
            />
            <div className="flex-1 overflow-y-auto max-h-100">
              <ul className="space-y-8">
                {fields.map((el, idx) => (
                  <li key={el.id}>
                    <h3 className="flex justify-between items-center mb-4 px-3 py-1 border-t bg-gray-200">
                      <span className="text-sm font-bold">상품 {idx + 1}</span>
                      {/* 첫번째 폼은 삭제하지 않고, 수정하려는 패키지의 상품 이후의 폼만 삭제 버튼이 보이도록 함 */}
                      {idx !== 0 && (!isEdit || idx >= updateTarget.products.length) && <X size={16} onClick={() => remove(idx)} className="cursor-pointer" />}
                    </h3>

                    <fieldset className="flex flex-col gap-4 px-2">
                      <FormField
                        control={form.control}
                        name={`products.${idx}.name`}
                        render={({ field }) => (
                          <FormInputWrap title="제품명">
                            <Input placeholder="예) 페로우즈 1950s 복각 청남방" {...field} className="bg-white" autoComplete="off" />
                          </FormInputWrap>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`products.${idx}.brand`}
                        render={({ field }) => (
                          <FormInputWrap title="브랜드명">
                            <Input placeholder="예) 페로우즈" {...field} className="bg-white" autoComplete="off" />
                          </FormInputWrap>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`products.${idx}.costPrice`}
                        render={({ field }) => (
                          <div className="flex items-start gap-2">
                            <FormInputWrap title="매입가" tooltip="매입가는 실시간 환율이 적용되므로 추후 수정이 불가합니다.">
                              <Input
                                type="number"
                                placeholder="예) 1000"
                                className="bg-white"
                                value={field.value.amount}
                                onChange={(e) => field.onChange({ ...field.value, amount: Number(e.target.value) })}
                                disabled={isEdit && idx < updateTarget.products.length}
                              />
                            </FormInputWrap>
                            {/* <ReceivingSelect
                              onChange={(code) => {
                                const selected = exchangeOptions.find((opt) => opt.code === code);
                                if (selected) {
                                  field.onChange({ ...field.value, exchange: selected });
                                }
                              }}
                              value={field.value.exchange}
                              disabled={isEdit && idx < updateTarget.products.length}
                            /> */}
                          </div>
                        )}
                      ></FormField>
                    </fieldset>
                  </li>
                ))}
              </ul>
            </div>
            <Button type="button" variant="secondary" size="sm" onClick={onClickAddProduct}>
              <PlusCircle size={16} />
              <span className="pr-2">상품 추가하기</span>
            </Button>

            <DialogFooter className="mt-4">
              <DialogClose asChild>
                <Button variant="outline">취소</Button>
              </DialogClose>
              <Button type="submit">{isEdit ? "수정" : "등록"}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
