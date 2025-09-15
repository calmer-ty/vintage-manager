import { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { Timestamp } from "firebase/firestore";
import { toast } from "sonner";
import { v4 as uuid } from "uuid";

import { useExchangeRate } from "@/hooks/useExchangeRate";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormLabel, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PlusCircle, X } from "lucide-react";

import CurrencySelect from "./currencySelect";
import FormInputWrap from "@/components/commons/inputWrap/form";

// Schema
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import type { Dispatch, SetStateAction } from "react";
import type { IProductPackage, IUpdateProductPackage, IUpdateProductPackageParams } from "@/types";
interface IManagementWriteProps {
  uid: string;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;

  createProductPackage: (productsPackage: IProductPackage) => Promise<void>;
  updateProductPackage: ({ updateTargetId, productPackage }: IUpdateProductPackageParams) => Promise<void>;
  fetchProductPackages: () => Promise<void>;

  updateTarget: IProductPackage | undefined;
  setUpdateTarget: Dispatch<SetStateAction<IProductPackage | undefined>>;
}

const ProductSchema = z.object({
  name: z.string().min(1, "제품명은 최소 1글자 이상입니다."),
  brand: z.string().min(1, "브랜드명은 최소 1글자 이상입니다."),
  costPrice: z.object({
    amount: z.string().min(1, "매입가는 최소 0 이상입니다."),
    currency: z.string().min(1, "통화를 선택해주세요."),
  }),
});
const FormSchema = z.object({
  shipping: z.object({
    amount: z.string().min(1, "배송비는 최소 0 이상입니다."),
    currency: z.string().min(1, "통화를 선택해주세요."),
  }),
  products: z.array(ProductSchema).min(1, "상품을 최소 1개 입력해주세요."),
});

export default function ReceivingWrite({ uid, isOpen, setIsOpen, createProductPackage, updateProductPackage, fetchProductPackages, updateTarget, setUpdateTarget }: IManagementWriteProps) {
  const isEdit = !!updateTarget;

  // ✍️ 폼 설정
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      shipping: {
        amount: "",
        currency: "",
      },
      products: [
        {
          name: "",
          brand: "",
          costPrice: {
            amount: "",
            currency: "",
          },
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
  const onClickSubmit = async (data: z.infer<typeof FormSchema>) => {
    try {
      const productPackage = {
        ...data,
        uid,
        _id: "",
        shipping: {
          amount: data.shipping.amount ?? "",
          currency: data.shipping.currency ?? "",
        },
        products: data.products.map((p) => ({
          ...p,
          _id: uuid(),
          costPrice: {
            amount: p.costPrice.amount ?? "",
            currency: p.costPrice.currency ?? "",
          },
          salePrice: "0",
          profit: 0,
          soldAt: null,
        })),
        createdAt: Timestamp.fromDate(new Date()), // 테이블 생성 시간
      };

      // 데이터 생성 및 리패치
      await createProductPackage(productPackage);
      await fetchProductPackages();

      // 등록 성공 후 폼 초기화 및 토스트 띄우기
      form.reset();
      setIsOpen(false);
      toast(<p className="font-bold">✅ 상품이 성공적으로 등록되었습니다!</p>, {
        description: `상품 ${data.products.length} 개`,
        action: {
          label: "닫기",
          onClick: () => console.log("닫기"),
        },
        position: "top-center",
        descriptionClassName: "ml-5",
      });
    } catch (error) {
      console.error("문서 추가 실패:", error);
    }
  };

  // 수정 함수
  const onClickUpdate = async (data: z.infer<typeof FormSchema>) => {
    if (!isEdit) return;

    try {
      const productPackage: IUpdateProductPackage = { ...data };

      // 데이터 수정 및 리패치
      await updateProductPackage({ updateTargetId: updateTarget._id, productPackage });
      await fetchProductPackages();

      // 수정 성공 후 토스트 띄우기 및 다이얼로그 닫기
      toast(<p className="font-bold">🔄 패키지가 성공적으로 수정되었습니다!</p>, {
        action: {
          label: "닫기",
          onClick: () => console.log("닫기"),
        },
        position: "top-center",
        descriptionClassName: "ml-5",
      });
      setIsOpen(false);
    } catch (error) {
      console.error("문서 추가 실패:", error);
    }
  };

  // 상품 추가 버튼
  const onClickAddProduct = () => {
    append({
      name: "",
      brand: "",
      costPrice: {
        amount: "",
        currency: "",
      },
    });
  };

  // updateTarget 변경 시 form 값을 리셋
  useEffect(() => {
    if (isEdit) {
      form.reset({
        shipping: updateTarget.shipping,
        products: updateTarget.products,
      });
    } else {
      form.reset({
        shipping: {
          amount: "",
          currency: "",
        },
        products: [
          {
            name: "",
            brand: "",
            costPrice: {
              amount: "",
              currency: "",
            },
          },
        ],
      });
    }
  }, [form, isOpen, isEdit, updateTarget]);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          form.reset();
          setIsOpen(false);
          setUpdateTarget(undefined);
        } else {
          setIsOpen(true);
        }
      }}
    >
      <DialogContent className="flex-col overflow-y-auto max-h-180 sm:max-w-120">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(isEdit ? onClickUpdate : onClickSubmit)} className="flex flex-col gap-4">
            <DialogHeader>
              <DialogTitle>패키지 {isEdit ? "수정" : "등록"}</DialogTitle>
              <DialogDescription>패키지 정보를 입력하고 등록하세요.</DialogDescription>
            </DialogHeader>

            {/* <div className="flex items-center gap-2">
              <FormField
                control={form.control}
                name="shipping.amount"
                render={({ field }) => (
                  <FormInputWrap title="배송비 & 대행비">
                    <Input type="number" placeholder="사용한 통화 기준으로 작성" {...field} className="bg-white" disabled={!!field.value && isEdit} />
                  </FormInputWrap>
                )}
              />
              <FormField
                control={form.control}
                name="shipping.currency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="opacity-0">통화</FormLabel>
                    <FormControl>
                      <CurrencySelect
                        placeholder="사용한 통화"
                        items={currencyOptions}
                        onChange={(selectedValue) => {
                          console.log("selectedValue", selectedValue);
                          const selected = currencyOptions.find((opt) => opt.value === selectedValue);
                          if (selected) {
                            field.onChange(JSON.stringify(selected));
                          }
                        }}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div> */}

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
                          <Input placeholder="예) 페로우즈" {...field} className="bg-white" />
                        </FormInputWrap>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`products.${idx}.name`}
                      render={({ field }) => (
                        <FormInputWrap title="제품명">
                          <Input placeholder="예) 페로우즈 1950s 복각 청남방" {...field} className="bg-white" />
                        </FormInputWrap>
                      )}
                    />

                    <div className="flex items-end gap-2">
                      <FormField
                        control={form.control}
                        name={`products.${idx}.costPrice.amount`}
                        render={({ field }) => (
                          <FormInputWrap title="매입가">
                            <Input type="number" placeholder="예) 1000" {...field} className="bg-white" disabled={isEdit} />
                          </FormInputWrap>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`products.${idx}.costPrice.currency`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="opacity-0">통화</FormLabel>
                            <FormControl>
                              <CurrencySelect
                                placeholder="사용한 통화"
                                items={currencyOptions}
                                onChange={(selectedValue) => {
                                  console.log("selectedValue", selectedValue);
                                  const selected = currencyOptions.find((opt) => opt.value === selectedValue);
                                  if (selected) {
                                    field.onChange(JSON.stringify(selected));
                                  }
                                }}
                                value={field.value ?? ""}
                                disabled={isEdit}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </fieldset>
                </li>
              ))}
            </ul>

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
