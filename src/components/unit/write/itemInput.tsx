import { useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";

import { db } from "@/commons/libraries/firebase/firebaseApp";
import { addDoc, collection, updateDoc } from "firebase/firestore";

import { useExchangeRate } from "@/commons/hooks/useExchangeRate";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";

import BasicSelect from "@/components/commons/select/basic";

// Schema
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { categoryItems } from "./data";
import { FormSchema } from "./schema";

// 🏷️ 옵션

interface IItemInputProps {
  uid: string;
  readData: () => Promise<void>;
}

export default function ItemInput({ uid, readData }: IItemInputProps) {
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

  const [currencyLabel, setCurrencyLabel] = useState("");

  // 📥 등록 함수
  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    try {
      // 등록 시간 측정
      const now = new Date(); // 현재 시간을 Date 객체로 가져옴
      const createdAt = now.toISOString(); // ISO 형식으로 문자열 변환

      const docRef = await addDoc(collection(db, "income"), {
        ...data, // IncomeItemData 타입에 있는 모든 데이터
        uid,
        price: `${data.price} ${currencyLabel}`,
        priceKRW: Number(data.price) * Number(data.currencyValue),
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
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex">
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
              <FormItem>
                <FormControl>
                  <Input placeholder="브랜드명" {...field} className="bg-white" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="제품명" {...field} className="bg-white" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="매입 가격" {...field} className="bg-white" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </>

    // <form onSubmit={handleFormSubmit(handleSubmit)}>
    //   <div className="flex items-baseline gap-4 p-6">
    //     <BasicSelect title="상품 종류" items={items} />
    //     <Input type="text" placeholder="브랜드명" className="bg-white" />
    //     <Input type="text" placeholder="제품명" className="bg-white" />
    //     <Input type="text" placeholder="매입 가격" className="bg-white" />
    //     <BasicSelect title="통화" items={items} />

    //     <BasicSelect title="타입" value={itemType} options={itemTypeOptions} setValue={setItemType} />
    //     <ControllerInput name="brandName" control={control} required="브랜드명을 입력해 주세요" label="브랜드명" error={errors.brandName?.message} />
    //     <ControllerInput name="itemName" control={control} required="제품명을 입력해 주세요" label="제품명" error={errors.itemName?.message} />
    //     <ControllerInput name="price" control={control} required="매입 가격을 입력해 주세요" label="매입 가격" error={errors.price?.message} />
    //     <BasicSelect title="통화" value={selectedCurrencyValue} options={currencyOptions} setValue={setSelectedCurrencyValue} />

    //     <Button variant="outline" size="sm" type="submit">
    //       등록하기
    //     </Button>
    //     <button
    //         onClick={() => {
    //           // 바로 함수가 실행 되기 떄문에 함수 참조를 전달해야합니다.
    //           handleFormDelete(selectionItem);
    //         }}
    //       >
    //         삭제하기
    //       </button>
    //   </div>
    // </form>
  );
}
