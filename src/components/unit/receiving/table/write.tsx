import { useEffect, useMemo } from "react";
import { useFieldArray, useForm } from "react-hook-form";

import { useExchangeRate } from "@/hooks/useExchangeRate";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormLabel, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

import { toast } from "sonner";

import BasicSelect from "@/components/commons/select/basic";
import FormInputWrap from "@/components/commons/inputWrap/form";

// Schema
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Timestamp } from "firebase/firestore";
import type { IProductPackage, IUpdateItemParams } from "@/types";

const ProductSchema = z.object({
  name: z.string().min(1, "제품명은 최소 1글자 이상입니다."),
  brand: z.string().min(1, "브랜드명은 최소 1글자 이상입니다."),
  costPrice: z.string().min(1, "매입가격을 입력해주세요."),
});
const FormSchema = z.object({
  exchangeRate: z.string().min(1, "통화를 선택해주세요."),
  shipping: z.string().min(1, "사용된 배송비를 입력해주세요."),
  products: z.array(ProductSchema).min(1, "상품을 최소 1개 입력해주세요."),
});

interface IManagementWriteProps {
  uid: string;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  createProductPackage: (productsPackage: IProductPackage) => Promise<void>;
  fetchProductPackages: () => Promise<void>;
}

export default function ManagementWrite({ uid, isOpen, setIsOpen, createProductPackage }: IManagementWriteProps) {
  // const isEdit = !!updateTarget;
  const isEdit = false;

  // ✍️ 폼 설정
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      exchangeRate: "",
      shipping: "",
      products: [{ name: "", brand: "", costPrice: "" }],
    },
  });
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "products",
  });
  console.log("fields: ", fields);

  // updateTarget 변경 시 form 값을 리셋
  // useEffect(() => {
  //   if (isEdit) {
  //     form.reset({
  //       name: updateTarget.name,
  //       costPrice: updateTarget.costPrice.replace(/[^\d]/g, ""),
  //       salePrice: updateTarget.salePrice?.toString(),
  //       exchangeRate: updateTarget.exchangeRate?.toString(),
  //     });
  //   } else {
  //     form.reset({
  //       name: "",
  //       costPrice: "",
  //       salePrice: "",
  //       exchangeRate: "",
  //     });
  //   }
  // }, [form, isOpen, isEdit, updateTarget]);

  // 통화 정보
  const { baseRate, usdToKrw, jpyToKrw } = useExchangeRate();
  // prettier-ignore
  const currencyOptions = useMemo(() => [
    { label: "₩", value: baseRate.toString() },
    { label: "$", value: usdToKrw.toString() },
    { label: "¥", value: jpyToKrw.toString() },
  ],[baseRate, usdToKrw, jpyToKrw]);

  // 원화로 환산
  const exchangeRate = Number(form.watch("exchangeRate"));

  // 등록 함수
  const onClickSubmit = async (data: z.infer<typeof FormSchema>) => {
    try {
      const productPackage: IProductPackage = {
        ...data,
        uid,
        _id: "",
        createdAt: Timestamp.fromDate(new Date()), // 테이블 생성 시간
      };

      // 데이터 생성 및 리패치
      await createProductPackage(productPackage);
      // await fetchItems();

      // 등록 성공 후 폼 초기화 및 토스트 띄우기
      form.reset();
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
  const onClickUpdate = async (data: z.infer<typeof FormSchema>) => {};

  // 추가버튼

  const onClickAddProduct = () => {
    append({ name: "", brand: "", costPrice: "" });
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          form.reset();
          setIsOpen(false);
          // setUpdateTarget(undefined);
        } else {
          setIsOpen(true);
        }
      }}
    >
      <DialogContent className="flex-col overflow-y-scroll max-h-160 sm:max-w-120">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(isEdit ? onClickUpdate : onClickSubmit)} className="flex flex-col gap-4">
            <DialogHeader>
              <DialogTitle>패키지 {isEdit ? "수정" : "등록"}</DialogTitle>
              {/* <DialogDescription>{isEdit ? "패키지의 옵션 정보를 수정하세요." : "패키지 정보를 입력하고 등록하세요."}</DialogDescription> */}
            </DialogHeader>

            <p className="text-sm text-muted-foreground">상품을 구매했을 때 사용한 통화를 선택해주세요. </p>
            <div className="flex gap-4 mt-2 pb-4 border-b-1">
              <FormField
                control={form.control}
                name="exchangeRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>통화</FormLabel>
                    <FormControl>
                      <BasicSelect
                        placeholder="통화"
                        items={currencyOptions}
                        onChange={(selectedValue) => {
                          const selected = currencyOptions.find((opt) => opt.value === selectedValue);
                          if (selected) {
                            field.onChange(selected.value);
                          }
                        }}
                        value={field.value}
                        disabled={isEdit}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="shipping"
                render={({ field }) => (
                  <FormInputWrap title="직배송비">
                    <Input placeholder="사용한 통화 기준으로 작성" {...field} className="bg-white" />
                  </FormInputWrap>
                )}
              />
            </div>

            <ul className="space-y-8">
              {fields.map((el, idx) => {
                const costPrice = form.watch(`products.${idx}.costPrice`);

                return (
                  <li key={el.id}>
                    <h3 className="mb-4 px-6 py-2 border-t bg-gray-100 text-md font-semibold">
                      <span>상품 {idx + 1}</span>
                      <Button type="button" variant="destructive" onClick={() => remove(idx)}>
                        삭제
                      </Button>
                    </h3>

                    <div className="flex flex-col gap-4">
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
                              <p className="font-bold text-sm">( KRW: {Math.round(Number(costPrice) * exchangeRate).toLocaleString()} )</p>
                            </div>
                            <FormControl>
                              <Input type="number" placeholder="예) 1000" {...field} className="bg-white" disabled={isEdit} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </li>
                );
              })}
            </ul>

            <Button type="button" onClick={onClickAddProduct}>
              상품 추가하기
            </Button>

            <DialogFooter className="mt-4">
              <DialogClose asChild>
                <Button variant="outline">취소</Button>
              </DialogClose>
              {/* <Button type="submit">{updateTarget ? "수정" : "등록"}</Button> */}
              <Button type="submit">등록</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
