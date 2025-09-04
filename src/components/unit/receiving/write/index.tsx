import { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { Timestamp } from "firebase/firestore";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

import { useExchangeRate } from "@/hooks/useExchangeRate";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormLabel, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertCircle, Info, PlusCircle, X } from "lucide-react";

import CurrencySelect from "./currencySelect";
import FormInputWrap from "@/components/commons/inputWrap/form";

// Schema
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import type { Dispatch, SetStateAction } from "react";
import type { IProductPackage } from "@/types";
interface IManagementWriteProps {
  uid: string;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;

  createProductPackage: (productsPackage: IProductPackage) => Promise<void>;
  fetchProductPackages: () => Promise<void>;
}

const ProductSchema = z.object({
  name: z.string().min(1, "제품명은 최소 1글자 이상입니다."),
  brand: z.string().min(1, "브랜드명은 최소 1글자 이상입니다."),
  costPrice: z.string().min(1, "매입가격을 입력해주세요."),
});
const FormSchema = z.object({
  currency: z.string().min(1, "통화를 선택해주세요."),
  shipping: z.string().min(1, "사용된 배송비를 입력해주세요."),
  products: z.array(ProductSchema).min(1, "상품을 최소 1개 입력해주세요."),
});

export default function ReceivingWrite({ uid, isOpen, setIsOpen, createProductPackage, fetchProductPackages }: IManagementWriteProps) {
  // ✍️ 폼 설정
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      currency: "",
      shipping: "",
      products: [{ name: "", brand: "", costPrice: "" }],
    },
  });
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "products",
  });

  // 통화 정보
  const { currencyOptions } = useExchangeRate();
  // 환율 데이터
  const currency = form.watch("currency");

  // 등록 함수
  const onClickSubmit = async (data: z.infer<typeof FormSchema>) => {
    try {
      const productPackage: IProductPackage = {
        ...data,
        uid,
        _id: "",
        products: data.products.map((p) => ({ ...p, _id: uuidv4() })),
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

  // 상품 추가 버튼
  const onClickAddProduct = () => {
    append({ name: "", brand: "", costPrice: "" });
  };

  // updateTarget 변경 시 form 값을 리셋
  useEffect(() => {
    form.reset({
      currency: "",
      shipping: "",
      products: [{ name: "", brand: "", costPrice: "" }],
    });
  }, [form, isOpen]);
  useEffect(() => {
    if (form.getValues("currency") !== "") {
      form.trigger("currency");
    }
  }, [form]);
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          form.reset();
          setIsOpen(false);
        } else {
          setIsOpen(true);
        }
      }}
    >
      <DialogContent className="flex-col overflow-y-auto max-h-180 sm:max-w-120">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onClickSubmit)} className="flex flex-col gap-4">
            <DialogHeader>
              <DialogTitle>패키지 등록</DialogTitle>
              <DialogDescription>패키지 정보를 입력하고 등록하세요.</DialogDescription>
            </DialogHeader>

            <div className="grid gap-2">
              <FormField
                control={form.control}
                name="currency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>사용된 통화</FormLabel>
                    <p className="flex items-center gap-1 text-sm text-red-500">
                      <AlertCircle className="w-3 h-3" /> 통화 가치는 실시간으로 변동되므로, 수정할 수 없습니다.
                    </p>
                    {!currency && (
                      <p className="flex items-center gap-1 text-sm text-yellow-600 mb-2">
                        <Info className="w-3 h-3" /> 통화를 선택하면 예상 원화 값을 볼 수 있습니다.
                      </p>
                    )}
                    <FormControl>
                      <CurrencySelect
                        placeholder="사용된 통화"
                        items={currencyOptions}
                        onChange={(selectedValue) => {
                          const selected = currencyOptions.find((opt) => opt.value === selectedValue);

                          if (selected) {
                            field.onChange(JSON.stringify(selected));
                          }
                        }}
                        value={field.value}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="shipping"
              render={({ field }) => (
                <FormInputWrap title="배송비 & 대행비">
                  <Input placeholder="사용한 통화 기준으로 작성" {...field} className="bg-white" />
                </FormInputWrap>
              )}
            />

            <ul className="space-y-8">
              {fields.map((el, idx) => {
                const costPrice = form.watch(`products.${idx}.costPrice`);

                return (
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
                          <FormItem className="w-full">
                            <div className="flex gap-2">
                              <FormLabel>매입가</FormLabel>
                              <p className="font-bold text-sm">( KRW: {Math.round(Number(costPrice) * Number(currency ? JSON.parse(currency).rate : 0)).toLocaleString()} )</p>
                            </div>
                            <FormControl>
                              <Input type="number" placeholder="예) 1000" {...field} className="bg-white" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </fieldset>
                  </li>
                );
              })}
            </ul>

            <Button type="button" variant="secondary" size="sm" onClick={onClickAddProduct}>
              <PlusCircle size={16} />
              <span className="pr-2">상품 추가하기</span>
            </Button>

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
