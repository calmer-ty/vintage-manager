import { useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";

import { db } from "@/lib/firebase/firebaseApp";
import { addDoc, collection, updateDoc } from "firebase/firestore";

import { useExchangeRate } from "@/hooks/useExchangeRate";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

import BasicSelect from "@/components/commons/select/basic";

// Schema
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

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
  price: z.string().min(1, "가격을 입력해주세요."),
  currencyValue: z.string().min(1, "통화를 선택해주세요."),
  priceKRW: z.string().optional(), // 필요에 따라
});

interface IWriteDialogProps {
  uid: string;
  readData: () => Promise<void>;
}

export default function ManagementCreate({ uid, readData }: IWriteDialogProps) {
  const [currencyLabel, setCurrencyLabel] = useState("");

  // ✍️ 폼 설정
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      category: "",
      brandName: "",
      name: "",
      price: "",
      currencyValue: "",
      priceKRW: "",
    },
  });

  // 등록 함수
  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    try {
      // 등록 시간 측정
      const now = new Date(); // 현재 시간을 Date 객체로 가져옴
      const createdAt = now.toISOString(); // ISO 형식으로 문자열 변환

      const docRef = await addDoc(collection(db, "income"), {
        ...data, // IncomeItemData 타입에 있는 모든 데이터
        uid,
        price: `${Number(data.price).toLocaleString()} ${currencyLabel}`,
        priceKRW: Math.round(Number(data.price) * Number(data.currencyValue)).toLocaleString(),
        createdAt, // 테이블 생성 시간
      });

      // 문서 ID를 포함한 데이터로 업데이트
      await updateDoc(docRef, {
        _id: docRef.id,
      });

      form.reset();
      readData();
    } catch (error) {
      console.error("문서 추가 실패:", error);
    }
  };

  // 통화 정보
  const { baseRate, usdToKrw, jpyToKrw } = useExchangeRate();
  // prettier-ignore
  const currencyOptions = useMemo(() => [
    { label: "₩", value: baseRate },
    { label: "$", value: usdToKrw },
    { label: "¥", value: jpyToKrw },
  ],[baseRate, usdToKrw, jpyToKrw]);

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="default">상품 등록</Button>
        </DialogTrigger>
        <DialogContent className="flex-col sm:max-w-[425px]">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="">
              <DialogHeader className="mb-4">
                <DialogTitle>상품 등록</DialogTitle>
                <DialogDescription>원하는 상품의 옵션을 입력하고 생성하세요.</DialogDescription>
              </DialogHeader>

              <div className="flex flex-col gap-3">
                <div className="flex gap-2">
                  <Controller
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <BasicSelect title="카테고리" items={categoryItems} onChange={field.onChange} value={field.value} />
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
                        <FormControl>
                          <Input placeholder="브랜드명" {...field} className="bg-white" />
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
                      <FormControl>
                        <Input placeholder="제품명" {...field} className="bg-white" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex gap-2">
                  <Controller
                    control={form.control}
                    name="currencyValue"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <BasicSelect
                            title="통화"
                            items={currencyOptions}
                            onChange={(selectedValue) => {
                              const selected = currencyOptions.find((opt) => opt.value === selectedValue);

                              if (selected) {
                                field.onChange(selected.value);
                                setCurrencyLabel(selected.label);
                              }
                            }}
                            value={field.value}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormControl>
                          <Input placeholder="매입 가격" {...field} className="bg-white" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <DialogFooter className="mt-4">
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="submit">Submit</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
