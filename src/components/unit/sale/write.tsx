import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Timestamp } from "firebase/firestore";
import { toast } from "sonner";

import { useExchangeRate } from "@/hooks/useExchangeRate";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormLabel, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

import BasicSelect from "@/components/commons/select/basic";

// Schema
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import type { IProduct, IUpdateProduct, IUpdateItemParams, ICreateProduct, IProduct2 } from "@/types";
import FormInputWrap from "@/components/commons/inputWrap/form";

const FormSchema = z.object({
  // brand: z.string().min(1, "브랜드명은 최소 1글자 이상입니다."),
  // name: z.string().min(1, "제품명은 최소 1글자 이상입니다."),
  // costPrice: z.string().min(1, "매입가격을 입력해주세요."),
  // exchangeRate: z.string().min(1, "통화를 선택해주세요."),
  salePrice: z.string().min(1, "판매가격을 입력해주세요."),
});

interface IManagementWriteProps {
  uid: string;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  updateTarget: IProduct2 | undefined;
  setUpdateTarget: React.Dispatch<React.SetStateAction<IProduct2 | undefined>>;
  createProduct: ({ currency, products, createdAt }: ICreateProduct) => Promise<void>;
  updateProduct: ({ updateTargetId, product }: IUpdateItemParams) => Promise<void>;
  fetchProducts: () => Promise<void>;
}

export default function SaleWrite({ uid, isOpen, setIsOpen, updateTarget, setUpdateTarget, updateProduct, fetchProducts }: IManagementWriteProps) {
  const isEdit = !!updateTarget;

  // ✍️ 폼 설정
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      // brand: "",
      // name: "",
      // costPrice: "",
      // exchangeRate: "",
      salePrice: "",
    },
  });

  // updateTarget 변경 시 form 값을 리셋
  useEffect(() => {
    if (isEdit) {
      form.reset({
        // brand: updateTarget.brand,
        // name: updateTarget.name,
        // costPrice: updateTarget.costPrice.replace(/[^\d]/g, ""),
        // exchangeRate: updateTarget.exchangeRate?.toString(),
        salePrice: updateTarget.salePrice?.toString(),
      });
    } else {
      form.reset({
        // brand: "",
        // name: "",
        // costPrice: "",
        // exchangeRate: "",
        salePrice: "",
      });
    }
  }, [form, isOpen, isEdit, updateTarget]);

  // 통화 정보
  // const { currencyOptions } = useExchangeRate();

  // 원화로 환산
  // const watchCostPrice = Number(form.watch("costPrice"));
  // const watchExchangeRate = Number(form.watch("exchangeRate"));

  // 값 변환 함수
  const formatPriceKRW = (costPrice: string, exchangeRate: string) => Math.round(Number(costPrice) * Number(exchangeRate));
  // const formatLabel = (exchangeRate: string) => currencyOptions.find((opt) => opt.value === exchangeRate)?.label;

  // 등록 함수
  // const onClickSubmit = async (data: z.infer<typeof FormSchema>) => {
  //   try {
  //     const costPriceKRW = formatPriceKRW(data.costPrice, data.exchangeRate);

  //     const itemData: IProduct = {
  //       ...data,
  //       _id: "",
  //       uid,
  //       costPrice: `${data.costPrice.toLocaleString()} ${formatLabel(data.exchangeRate)}`,
  //       costPriceKRW,
  //       salePrice: Number(data.salePrice),
  //       profit: Number(data.salePrice) - costPriceKRW,
  //       exchangeRate: Number(data.exchangeRate),
  //       createdAt: Timestamp.fromDate(new Date()), // 테이블 생성 시간
  //       soldAt: null,
  //     };

  //     // 데이터 생성 및 리패치
  //     await createProduct(itemData);
  //     await fetchProducts();

  //     // 등록 성공 후 폼 초기화 및 토스트 띄우기
  //     form.reset();
  //     toast(<p className="font-bold">✅ 상품이 성공적으로 등록되었습니다!</p>, {
  //       description: `${data.brand} - ${data.name}`,
  //       action: {
  //         label: "닫기",
  //         onClick: () => console.log("닫기"),
  //       },
  //       position: "top-center",
  //       descriptionClassName: "ml-5",
  //     });
  //   } catch (error) {
  //     console.error("문서 추가 실패:", error);
  //   }
  // };

  // 수정 함수
  const onClickUpdate = async (data: z.infer<typeof FormSchema>) => {
    const updateTargetId = updateTarget?._id;
    if (!updateTargetId) return;

    try {
      const costPriceKRW = formatPriceKRW(data.costPrice, data.exchangeRate);

      const products: IUpdateProduct = {
        ...data,
        salePrice: Number(data.salePrice),
        profit: Number(data.salePrice) - costPriceKRW,
      };

      // 데이터 수정 및 리패치
      await updateProduct({ updateTargetId: updateTargetId, products });
      await fetchProducts();

      // 수정 성공 후 토스트 띄우기 및 다이얼로그 닫기
      toast(<p className="font-bold">🔄 상품이 성공적으로 수정되었습니다!</p>, {
        description: `${data.brand} - ${data.name}`,
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
          <form onSubmit={form.handleSubmit(onClickUpdate)} className="">
            <DialogHeader className="mb-4">
              <DialogTitle>상품 판매가 지정</DialogTitle>
              <DialogDescription>상품의 판매가를 지정하세요.</DialogDescription>
            </DialogHeader>

            <div className="flex flex-col gap-4">
              <div className="flex gap-4">
                <FormField
                  control={form.control}
                  name="brand"
                  render={({ field }) => (
                    <FormInputWrap title="브랜드명">
                      <Input placeholder="예) 페로우즈" {...field} className="bg-white" disabled />
                    </FormInputWrap>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormInputWrap title="제품명">
                    <Input placeholder="예) 1940s 복각 청남방" {...field} className="bg-white" disabled />
                  </FormInputWrap>
                )}
              />

              <div className="flex gap-2">
                <FormField
                  control={form.control}
                  name="salePrice"
                  render={({ field }) => (
                    <FormInputWrap title="판매가">
                      <Input type="number" placeholder="예) 1000" {...field} className="bg-white" />
                    </FormInputWrap>
                  )}
                />
              </div>
            </div>

            <DialogFooter className="mt-4">
              <DialogClose asChild>
                <Button variant="outline">취소</Button>
              </DialogClose>
              <Button type="submit">수정</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
