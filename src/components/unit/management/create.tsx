import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";

import { db } from "@/lib/firebase/firebaseApp";
import { addDoc, collection, updateDoc } from "firebase/firestore";

import { useExchangeRate } from "@/hooks/useExchangeRate";
import { getNowString } from "@/lib/date";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormLabel, FormField, FormItem, FormMessage } from "@/components/ui/form";
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
  purchasePrice: z.string().min(1, "매입가격을 입력해주세요."),
  // 하단 값들은 number 타입이지만, input은 string로 받기 때문에 타입 변경
  salePrice: z.string().min(1, "판매가격을 입력해주세요."),
  exchangeRate: z.string().min(1, "통화를 선택해주세요."),
  // purchasePriceKRW: z.string().optional(),
});

interface IManagementCreateProps {
  uid: string;
  refetch: () => Promise<void>;
}

export default function ManagementCreate({ uid, refetch }: IManagementCreateProps) {
  const [currencyLabel, setCurrencyLabel] = useState("");
  const [currencyValue, setCurrencyValue] = useState(0);

  // ✍️ 폼 설정
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      category: "",
      brandName: "",
      name: "",
      purchasePrice: "",
      salePrice: "",
      exchangeRate: "",
    },
  });

  // 등록 함수
  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    try {
      // 등록 시간 측정
      const purchasePriceKRW = Math.round(Number(data.purchasePrice) * Number(data.exchangeRate));

      const docRef = await addDoc(collection(db, "items"), {
        ...data, // IncomeItemData 타입에 있는 모든 데이터
        uid,
        exchangeRate: Number(data.exchangeRate),
        purchasePrice: `${Number(data.purchasePrice).toLocaleString()} ${currencyLabel}`,
        purchasePriceKRW,
        salePrice: Number(data.salePrice),
        profit: Number(data.salePrice) - purchasePriceKRW,
        createdAt: getNowString(), // 테이블 생성 시간
        isSold: false,
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
  const purchasePrice = form.watch("purchasePrice");
  const purchasePriceKRW = Math.round(Number(purchasePrice) * currencyValue);

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="default">상품 등록</Button>
        </DialogTrigger>
        <DialogContent className="flex-col sm:max-w-120">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="">
              <DialogHeader className="mb-4">
                <DialogTitle>상품 등록</DialogTitle>
                <DialogDescription>원하는 상품의 옵션을 입력하고 생성하세요.</DialogDescription>
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
                                setCurrencyLabel(selected.label);
                                setCurrencyValue(Number(selected.value));
                              }
                            }}
                            value={field.value}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid gap-4 w-full">
                    <FormField
                      control={form.control}
                      name="purchasePrice"
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
                        <Input placeholder="예) 1000" className="bg-white" value={purchasePriceKRW.toLocaleString()} readOnly />
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
                  <Button variant="outline" onClick={() => form.reset()}>
                    취소
                  </Button>
                </DialogClose>
                <Button type="submit">등록</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
