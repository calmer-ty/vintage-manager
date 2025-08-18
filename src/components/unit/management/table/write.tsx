import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";

import { useExchangeRate } from "@/hooks/useExchangeRate";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormLabel, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "sonner";

import BasicSelect from "@/components/commons/select/basic";

// Schema
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Timestamp } from "firebase/firestore";
import type { IItemData, IUpdateItemData, IUpdateItemParams } from "@/types";

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
  brand: z.string().min(1, "브랜드명은 최소 1글자 이상입니다."),
  name: z.string().min(1, "제품명은 최소 1글자 이상입니다."),
  costPrice: z.string().min(1, "매입가격을 입력해주세요."),
  salePrice: z.string().min(1, "판매가격을 입력해주세요."),
  exchangeRate: z.string().min(1, "통화를 선택해주세요."),
});

interface IManagementWriteProps {
  uid: string;
  createItem: (itemData: IItemData) => Promise<void>;
  updateItem: ({ updateTargetId, itemData }: IUpdateItemParams) => Promise<void>;
  fetchItems: () => Promise<void>;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  updateTarget: IItemData | undefined;
  setUpdateTarget: React.Dispatch<React.SetStateAction<IItemData | undefined>>;
}

export default function ManagementWrite({ uid, isOpen, setIsOpen, createItem, updateItem, fetchItems, updateTarget, setUpdateTarget }: IManagementWriteProps) {
  const isEdit = !!updateTarget;

  // ✍️ 폼 설정
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      category: "",
      brand: "",
      name: "",
      costPrice: "",
      salePrice: "",
      exchangeRate: "",
    },
  });

  // updateTarget 변경 시 form 값을 리셋
  useEffect(() => {
    if (isEdit) {
      form.reset({
        category: updateTarget.category,
        brand: updateTarget.brand,
        name: updateTarget.name,
        costPrice: updateTarget.costPrice.replace(/[^\d]/g, ""),
        salePrice: updateTarget.salePrice?.toString(),
        exchangeRate: updateTarget.exchangeRate?.toString(),
      });
    } else {
      form.reset({
        category: "",
        brand: "",
        name: "",
        costPrice: "",
        salePrice: "",
        exchangeRate: "",
      });
    }
  }, [form, isOpen, isEdit, updateTarget]);

  // 통화 정보
  const { baseRate, usdToKrw, jpyToKrw } = useExchangeRate();
  // prettier-ignore
  const currencyOptions = useMemo(() => [
    { label: "₩", value: baseRate.toString() },
    { label: "$", value: usdToKrw.toString() },
    { label: "¥", value: jpyToKrw.toString() },
  ],[baseRate, usdToKrw, jpyToKrw]);

  // 원화로 환산
  const watchCostPrice = Number(form.watch("costPrice"));
  const watchExchangeRate = Number(form.watch("exchangeRate"));

  // 값 변환 함수
  const formatPriceKRW = (costPrice: string, exchangeRate: string) => Math.round(Number(costPrice) * Number(exchangeRate));
  const formatLabel = (exchangeRate: string) => currencyOptions.find((opt) => opt.value === exchangeRate)?.label;

  // 등록 함수
  const onClickSubmit = async (data: z.infer<typeof FormSchema>) => {
    try {
      const costPriceKRW = formatPriceKRW(data.costPrice, data.exchangeRate);

      const itemData: IItemData = {
        ...data,
        _id: "",
        uid,
        costPrice: `${data.costPrice.toLocaleString()} ${formatLabel(data.exchangeRate)}`,
        costPriceKRW,
        salePrice: Number(data.salePrice),
        profit: Number(data.salePrice) - costPriceKRW,
        exchangeRate: Number(data.exchangeRate),
        createdAt: Timestamp.fromDate(new Date()), // 테이블 생성 시간
        soldAt: null,
      };

      // 데이터 생성 및 리패치
      await createItem(itemData);
      await fetchItems();

      // 등록 성공 후 폼 초기화 및 토스트 띄우기
      form.reset();
      toast(<p className="font-bold">✅ 상품이 성공적으로 등록되었습니다!</p>, {
        description: `${data.category} • ${data.brand} - ${data.name}`,
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
    const updateTargetId = updateTarget?._id;
    if (!updateTargetId) return;

    try {
      const costPriceKRW = formatPriceKRW(data.costPrice, data.exchangeRate);

      const itemData: IUpdateItemData = {
        ...data,
        salePrice: Number(data.salePrice),
        profit: Number(data.salePrice) - costPriceKRW,
      };

      // 데이터 수정 및 리패치
      await updateItem({ updateTargetId: updateTargetId, itemData: itemData });
      await fetchItems();

      // 수정 성공 후 토스트 띄우기 및 다이얼로그 닫기
      toast(<p className="font-bold">🔄 상품이 성공적으로 수정되었습니다!</p>, {
        description: `${data.category} • ${data.brand} - ${data.name}`,
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
      <DialogContent className="flex-col sm:max-w-120">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(isEdit ? onClickUpdate : onClickSubmit)} className="">
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
                  name="brand"
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

              <div>
                <p className="text-sm text-muted-foreground mt-1">상품을 매입했을 때 사용한 통화를 선택해주세요. </p>
                <p className="text-sm text-destructive mt-1">※ 통화와 매입가는 등록 후 수정할 수 없습니다.</p>
              </div>
              <div className="flex gap-4">
                <FormField
                  control={form.control}
                  name="exchangeRate"
                  render={({ field }) => (
                    <FormItem className="self-start">
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

                <div className="flex gap-4 w-full">
                  <FormField
                    control={form.control}
                    name="costPrice"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>매입가</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="예) 1000" {...field} className="bg-white" disabled={isEdit} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="w-full">
                    <FormItem className="w-full">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <FormLabel className="cursor-help gap-1">
                            원화 환산 금액<span className="text-red-500 ">*</span>
                          </FormLabel>
                        </TooltipTrigger>
                        <TooltipContent>상품 매입시 사용했던 화폐를 원화로 환산한 금액입니다.</TooltipContent>
                      </Tooltip>
                      <Input placeholder="예) 1000" className="bg-white" value={(watchCostPrice * watchExchangeRate).toLocaleString()} readOnly />
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
                      <FormLabel>판매가</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="예) 1000" {...field} className="bg-white" />
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
  );
}
