import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";

import { db } from "@/lib/firebase/firebaseApp";
import { addDoc, collection, updateDoc } from "firebase/firestore";

import { useExchangeRate } from "@/hooks/useExchangeRate";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormLabel, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

import BasicSelect from "@/components/commons/select/basic";

// Schema
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import type { IItemData } from "@/types";

const categoryItems = [
  { label: "상의", value: "상의" },
  { label: "하의", value: "하의" },
  { label: "아우터", value: "아우터" },
  { label: "가방", value: "가방" },
  { label: "액세사리", value: "액세사리" },
  { label: "기타", value: "기타" },
];

const FormSchema = z.object({
  category: z.string().min(1, "카테고리를 선택해주세요."),
  brandName: z.string().min(1, "브랜드명은 최소 1글자 이상입니다."),
  name: z.string().min(1, "제품명은 최소 1글자 이상입니다."),
  costPrice: z.string().min(1, "매입가격을 입력해주세요."),
  salePrice: z.string().min(1, "판매가격을 입력해주세요."),
  exchangeRate: z.string().min(1, "통화를 선택해주세요."),
  // 하단 값들은 number 타입이지만, input은 string로 받기 때문에 타입 변경
  // costPriceKRW: z.string().optional(),
});

interface IManagementWriteProps {
  uid: string;
  refetch: () => Promise<void>;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  updateTarget: IItemData | undefined;
  setUpdateTarget: React.Dispatch<React.SetStateAction<IItemData | undefined>>;
}

export default function ManagementWrite({ uid, refetch, isOpen, setIsOpen, updateTarget, setUpdateTarget }: IManagementWriteProps) {
  const isEdit = !!updateTarget;
  const [currency, setCurrency] = useState({ label: isEdit ? updateTarget.currency.label : "", value: isEdit ? updateTarget.currency.value : 0 });

  // ✍️ 폼 설정
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      category: "",
      brandName: "",
      name: "",
      costPrice: "",
      salePrice: "",
      exchangeRate: "",
    },
  });

  // updateTarget 변경 시 form 값을 리셋
  useEffect(() => {
    // 수정시 값 초기화
    if (isEdit) {
      setCurrency({
        label: updateTarget.currency.label,
        value: updateTarget.currency.value,
      });
      form.reset({
        category: updateTarget.category,
        brandName: updateTarget.brandName,
        name: updateTarget.name,
        costPrice: updateTarget.costPrice.replace(/[^\d]/g, ""),
        salePrice: updateTarget.salePrice?.toString(),
        exchangeRate: updateTarget.currency.value?.toString(),
      });
    } else {
      form.reset({
        category: "",
        brandName: "",
        name: "",
        costPrice: "",
        salePrice: "",
        exchangeRate: "",
      });
    }
  }, [form, isOpen, isEdit, updateTarget]);

  // 등록 함수
  const onClickSubmit = async (data: z.infer<typeof FormSchema>) => {
    try {
      // 등록 시간 측정
      const costPriceKRW = Math.round(Number(data.costPrice) * Number(data.exchangeRate));

      const docRef = await addDoc(collection(db, "items"), {
        ...data, // IncomeItemData 타입에 있는 모든 데이터
        uid,
        currency: { label: currency.label, value: currency.value },
        // exchangeRate: Number(data.exchangeRate),
        costPrice: `${Number(data.costPrice).toLocaleString()} ${currency.label}`,
        costPriceKRW,
        salePrice: Number(data.salePrice),
        profit: Number(data.salePrice) - costPriceKRW,
        createdAt: new Date(), // 테이블 생성 시간
        soldAt: null,
      });

      // 문서 ID를 포함한 데이터로 업데이트
      await updateDoc(docRef, {
        _id: docRef.id,
      });

      form.reset();
      refetch();
    } catch (error) {
      console.error("문서 추가 실패:", error);
    }
  };

  // 통화 정보
  const { baseRate, usdToKrw, jpyToKrw } = useExchangeRate();
  // prettier-ignore
  const currencyOptions = useMemo(() => [
    { label: "₩", value: baseRate.toString() },
    { label: "$", value: usdToKrw.toString() },
    { label: "¥", value: jpyToKrw.toString() },
  ],[baseRate, usdToKrw, jpyToKrw]);

  // 원화로 환산
  const costPrice = form.watch("costPrice");
  const costPriceKRW = Math.round(Number(costPrice) * currency.value);

  return (
    <>
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
        <DialogContent className="flex-col sm:max-w-120">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onClickSubmit)} className="">
              <DialogHeader className="mb-4">
                <DialogTitle>상품 {isEdit ? "수정" : "등록"}</DialogTitle>
                <DialogDescription>{isEdit ? "상품의 옵션 정보를 수정하세요." : "원하는 상품의 옵션을 입력하고 생성하세요."}</DialogDescription>
              </DialogHeader>

              <div className="flex flex-col gap-4">
                <div className="flex gap-4">
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>카테고리</FormLabel>
                        <FormControl>
                          <BasicSelect items={categoryItems} onChange={field.onChange} value={field.value} placeholder="카테고리를 선택해주세요." />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="brandName"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>브랜드명</FormLabel>
                        <FormControl>
                          <Input placeholder="예) 페로우즈" {...field} className="bg-white" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>제품명</FormLabel>
                      <FormControl>
                        <Input placeholder="예) 1940s 복각 청남방" {...field} className="bg-white" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <p className="text-sm text-muted-foreground mt-1">상품을 매입했을 때 사용한 통화를 선택해주세요.</p>
                <div className="flex gap-4">
                  <FormField
                    control={form.control}
                    name="exchangeRate"
                    render={({ field }) => (
                      <FormItem className="self-start">
                        <FormLabel>통화</FormLabel>
                        <FormControl>
                          <BasicSelect
                            placeholder="통화를 선택해주세요."
                            items={currencyOptions}
                            onChange={(selectedValue) => {
                              const selected = currencyOptions.find((opt) => opt.value === selectedValue);

                              if (selected) {
                                field.onChange(selected.value);
                                setCurrency({ label: selected.label, value: Number(selected.value) });
                              }
                            }}
                            value={field.value}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex flex-col gap-4 w-full">
                    <FormField
                      control={form.control}
                      name="costPrice"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel>매입가격</FormLabel>
                          <FormControl>
                            <Input placeholder="예) 1000" {...field} className="bg-white" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="w-full">
                      <FormItem className="w-full">
                        <FormLabel>원화 환산</FormLabel>
                        <Input placeholder="예) 1000" className="bg-white" value={costPriceKRW.toLocaleString()} readOnly />
                      </FormItem>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <FormField
                    control={form.control}
                    name="salePrice"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>판매가격</FormLabel>
                        <FormControl>
                          <Input placeholder="예) 1000" {...field} className="bg-white" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <DialogFooter className="mt-4">
                <DialogClose asChild>
                  <Button variant="outline">취소</Button>
                </DialogClose>
                <Button type="submit">{updateTarget ? "수정" : "등록"}</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
