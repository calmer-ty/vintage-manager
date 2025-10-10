import { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { Timestamp } from "firebase/firestore";
import { toast } from "sonner";
import { v4 as uuid } from "uuid";

import { useExchangeRate } from "@/hooks/useExchangeRate";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormField } from "@/components/ui/form";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PlusCircle, X } from "lucide-react";

import CurrencySelect from "./currencySelect";
import FormInputWrap from "@/components/commons/inputWrap/form";

import { zodResolver } from "@hookform/resolvers/zod";
import { PackageSchema } from "./schema";

import type { z } from "zod";
import type { Dispatch, SetStateAction } from "react";
import type { ICreateProductPackageParams, IProductPackage, IUpdateProductPackage, IUpdateProductPackageParams } from "@/types";
interface IReceivingFormProps {
  uid: string;
  isWriteOpen: boolean;
  setIsWriteOpen: Dispatch<SetStateAction<boolean>>;
  updateTarget: IProductPackage | undefined;
  setUpdateTarget: Dispatch<SetStateAction<IProductPackage | undefined>>;
  createProductPackage: ({ productPackage }: ICreateProductPackageParams) => Promise<void>;
  updateProductPackage: ({ updateTargetId, productPackage }: IUpdateProductPackageParams) => Promise<void>;
  fetchProductPackages: () => Promise<void>;
}

export default function ReceivingForm({ uid, isWriteOpen, setIsWriteOpen, updateTarget, setUpdateTarget, createProductPackage, updateProductPackage, fetchProductPackages }: IReceivingFormProps) {
  const isEdit = !!updateTarget;

  // ✍️ 폼 설정
  const form = useForm<z.infer<typeof PackageSchema>>({
    resolver: zodResolver(PackageSchema),
    // prettier-ignore
    defaultValues: {
      products: [
        { name: "",
          brand: "",
          costPrice: { amount: "", currency: "" },
        },
      ],
    },
  });
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "products",
  });

  // 환율 데이터
  const { currencyOptions } = useExchangeRate();

  // 등록 함수
  const onClickCreate = async (data: z.infer<typeof PackageSchema>) => {
    try {
      const productPackage = {
        ...data,
        uid,
        _id: "",
        products: data.products.map((p) => ({
          ...p,
          uid,
          _id: uuid(),
          salePrice: "",
          profit: 0,
          createdAt: Timestamp.fromDate(new Date()),
          soldAt: null, // 판매중/판매완료 값이 토글하며 들어가기에 초기값 null 처리
        })),
        shipping: {
          amount: "",
          currency: "",
        },
        fee: {
          amount: "",
          currency: "",
        },
      };

      // 데이터 생성 및 리패치
      await createProductPackage({ productPackage });
      await fetchProductPackages();

      // 등록 성공 후 폼 초기화 및 토스트 띄우기
      toast("✅ 상품이 성공적으로 등록되었습니다.");
      setIsWriteOpen(false);
      form.reset();
    } catch (error) {
      console.error("문서 추가 실패:", error);
    }
  };

  // 수정 함수
  const onClickUpdate = async (data: z.infer<typeof PackageSchema>) => {
    if (!isEdit) return;
    if (!form.formState.isDirty) {
      toast("✨ 변경된 내용이 없습니다.");
      return;
    }

    try {
      const productPackage: IUpdateProductPackage = { ...data };

      // 데이터 수정 및 리패치
      await updateProductPackage({ updateTargetId: updateTarget._id, productPackage });
      await fetchProductPackages();

      toast("🔄 패키지가 성공적으로 수정되었습니다.");
      setIsWriteOpen(false);
    } catch (error) {
      console.error("문서 추가 실패:", error);
    }
  };

  // 상품 추가 버튼
  const onClickAddProduct = () => {
    // prettier-ignore
    append({
      name: "",
      brand: "",
      costPrice: { amount: "", currency: "" },
    });
  };

  // updateTarget 변경 시 form 값을 리셋
  useEffect(() => {
    if (isEdit) {
      form.reset({
        products: updateTarget.products,
      });
    } else {
      form.reset({
        // prettier-ignore
        products: [
          { name: "",
            brand: "",
            costPrice: { amount: "", currency: "" },
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
          <form onSubmit={form.handleSubmit(isEdit ? onClickUpdate : onClickCreate)} className="flex flex-col gap-4">
            <DialogHeader>
              <DialogTitle>패키지 {isEdit ? "수정" : "등록"}</DialogTitle>
              <DialogDescription>패키지 정보를 입력하고 등록하세요.</DialogDescription>
            </DialogHeader>

            <div className="flex-1 overflow-y-auto max-h-100">
              <ul className="space-y-8">
                {fields.map((el, idx) => (
                  <li key={el.id}>
                    <h3 className="flex justify-between items-center mb-4 px-3 py-1 border-t bg-gray-200">
                      <span className="text-sm font-bold">상품 {idx + 1}</span>
                      {idx !== 0 && <X size={16} onClick={() => remove(idx)} className="cursor-pointer" />}
                    </h3>

                    <fieldset className="flex flex-col gap-4 px-2">
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
                        name={`products.${idx}.name`}
                        render={({ field }) => (
                          <FormInputWrap title="제품명">
                            <Input placeholder="예) 페로우즈 1950s 복각 청남방" {...field} className="bg-white" autoComplete="off" />
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
                                onChange={(e) => field.onChange({ ...field.value, amount: e.target.value })}
                                disabled={isEdit && idx < updateTarget.products.length}
                              />
                            </FormInputWrap>
                            <CurrencySelect
                              items={currencyOptions}
                              onChange={(selectedValue) => {
                                const selected = currencyOptions.find((opt) => opt.value === selectedValue);
                                if (selected) {
                                  field.onChange({ ...field.value, currency: JSON.stringify(selected) });
                                }
                              }}
                              value={field.value.currency}
                              disabled={isEdit && idx < updateTarget.products.length}
                            />
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
