import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormField } from "@/components/ui/form";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

import FormInputWrap from "@/components/commons/inputWrap/form";

// Schema
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import type { IUpdateProduct, IUpdateProductParams, IProduct, ICurrency } from "@/types";

const FormSchema = z.object({
  brand: z.string().min(1, "브랜드명은 최소 1글자 이상입니다."),
  name: z.string().min(1, "제품명은 최소 1글자 이상입니다."),
  salePrice: z.string().min(1, "판매가격을 입력해주세요."),
});

interface IManagementWriteProps {
  uid: string;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  updateTarget: IProduct | undefined;
  setUpdateTarget: React.Dispatch<React.SetStateAction<IProduct | undefined>>;
  updateProduct: ({ targetId, product }: IUpdateProductParams) => Promise<void>;
  fetchProducts: () => Promise<void>;
}

export default function SaleWrite({ uid, isOpen, setIsOpen, updateTarget, setUpdateTarget, updateProduct, fetchProducts }: IManagementWriteProps) {
  const isEdit = !!updateTarget;

  // ✍️ 폼 설정
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      brand: "",
      name: "",
      salePrice: "",
    },
  });

  // updateTarget 변경 시 form 값을 리셋
  useEffect(() => {
    if (isEdit) {
      form.reset({
        brand: updateTarget.brand,
        name: updateTarget.name,
        salePrice: updateTarget.salePrice ?? "",
      });
    } else {
      form.reset({
        brand: "",
        name: "",
        salePrice: "",
      });
    }
  }, [form, isOpen, isEdit, updateTarget]);

  // 수정 함수
  const onClickUpdate = async (data: z.infer<typeof FormSchema>) => {
    if (!uid || !isEdit) return;

    try {
      const costPrice = updateTarget?.costPrice;
      const currency: ICurrency = JSON.parse(updateTarget?.currency);
      const costPriceKRW = Number(costPrice) * currency.rate;

      const product: IUpdateProduct = {
        ...data,
        profit: Number(data.salePrice) - costPriceKRW,
      };

      // 데이터 수정 및 리패치
      await updateProduct({ targetId: updateTarget?._id, product });
      await fetchProducts();

      // 수정 성공 후 토스트 띄우기 및 다이얼로그 닫기
      toast(<p className="font-bold">🔄 상품 판매가가 변경되었습니다.</p>, {
        description: `${updateTarget.brand} - ${updateTarget.name} - 판매가: ${data.salePrice}`,
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
