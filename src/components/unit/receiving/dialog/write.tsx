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

// Schema
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import type { Dispatch, SetStateAction } from "react";
import type { IProductPackage, IUpdateProductPackage, IUpdateProductPackageParams } from "@/types";
interface IReceivingWriteProps {
  uid: string;
  updateTarget: IProductPackage | undefined;
  setIsWriteOpen: Dispatch<SetStateAction<boolean>>;
  setUpdateTarget: Dispatch<SetStateAction<IProductPackage | undefined>>;
  updateProductPackage: ({ updateTargetId, productPackage }: IUpdateProductPackageParams) => Promise<void>;

  isWriteOpen: boolean;
  createProductPackage: (productsPackage: IProductPackage) => Promise<void>;
  fetchProductPackages: () => Promise<void>;
}

const ProductSchema = z.object({
  name: z.string().min(1, "제품명은 최소 1글자 이상입니다."),
  brand: z.string().min(1, "브랜드명은 최소 1글자 이상입니다."),
  costPrice: z
    .object({
      amount: z.string(),
      currency: z.string(),
    })
    .superRefine((val, ctx) => {
      if (!val.amount || !val.currency) {
        ctx.addIssue({
          code: "custom",
          path: [],
          message: "매입가와 통화를 모두 입력해주세요.",
        });
      }
    }),
});
export const PackageSchema = z.object({
  shipping: z
    .object({
      amount: z.string(),
      currency: z.string(),
    })
    .superRefine((val, ctx) => {
      // 둘 중 하나만 입력됐을 때
      if ((val.amount && !val.currency) || (!val.amount && val.currency)) {
        ctx.addIssue({
          code: "custom",
          path: [],
          message: "배송비와 통화를 모두 입력해주세요.",
        });
      }
    }),
  products: z.array(ProductSchema).min(1, "상품을 최소 1개 입력해주세요."),
});

export default function ReceivingWrite({
  setIsWriteOpen,
  setUpdateTarget,

  uid,
  isWriteOpen,
  updateTarget,
  createProductPackage,
  updateProductPackage,
  fetchProductPackages,
}: IReceivingWriteProps) {
  const isEdit = !!updateTarget;

  // ✍️ 폼 설정
  const form = useForm<z.infer<typeof PackageSchema>>({
    resolver: zodResolver(PackageSchema),
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
  const onClickCreate = async (data: z.infer<typeof PackageSchema>) => {
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
      setIsWriteOpen(false);
      toast("✅ 상품이 성공적으로 등록되었습니다.");
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
      const productPackage: IUpdateProductPackage = {
        ...data,
        shipping: {
          amount: data.shipping.amount ?? "",
          currency: data.shipping.currency ?? "",
        },
      };

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
      <DialogContent className="flex-col overflow-y-auto max-h-180 sm:max-w-120">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(isEdit ? onClickUpdate : onClickCreate)} className="flex flex-col gap-4">
            <DialogHeader>
              <DialogTitle>패키지 {isEdit ? "수정" : "등록"}</DialogTitle>
              <DialogDescription>패키지 정보를 입력하고 등록하세요.</DialogDescription>
            </DialogHeader>

            {/* <FormField
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
                      disabled={isEdit && updateTarget.shipping?.amount !== ""}
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
                    disabled={isEdit && updateTarget.shipping?.amount !== ""}
                  />
                </div>
              )}
            ></FormField> */}

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
