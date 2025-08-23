import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";

import { useExchangeRate } from "@/hooks/useExchangeRate";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormLabel, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

import { toast } from "sonner";

import BasicSelect from "@/components/commons/select/basic";

// Schema
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Timestamp } from "firebase/firestore";
import type { IItemData, IUpdateItemData, IUpdateItemParams } from "@/types";

const FormSchema = z.object({
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
        name: updateTarget.name,
        costPrice: updateTarget.costPrice.replace(/[^\d]/g, ""),
        salePrice: updateTarget.salePrice?.toString(),
        exchangeRate: updateTarget.exchangeRate?.toString(),
      });
    } else {
      form.reset({
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
        description: `${data.name}`,
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
        description: `${data.name}`,
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
          <form onSubmit={form.handleSubmit(isEdit ? onClickUpdate : onClickSubmit)} className="flex flex-col gap-4">
            <DialogHeader>
              <DialogTitle className="pb-3">패키지 {isEdit ? "수정" : "등록"}</DialogTitle>
              {/* <DialogDescription>{isEdit ? "패키지의 옵션 정보를 수정하세요." : "패키지 정보를 입력하고 등록하세요."}</DialogDescription> */}
            </DialogHeader>

            <div className="pb-4 border-b-1">
              <p className="text-sm text-muted-foreground mb-2">상품을 구매했을 때 사용한 통화를 선택해주세요. </p>
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
            </div>

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>제품명</FormLabel>
                  <FormControl>
                    <Input placeholder="예) 페로우즈 1950s 복각 청남방" {...field} className="bg-white" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-4">
              <FormField
                control={form.control}
                name="costPrice"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <div className="flex gap-2">
                      <FormLabel>매입가</FormLabel>
                      <p className="font-bold text-sm">( KRW: {Math.round(watchCostPrice * watchExchangeRate).toLocaleString()} )</p>
                    </div>
                    <FormControl>
                      <Input type="number" placeholder="예) 1000" {...field} className="bg-white" disabled={isEdit} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
