import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { getPriceInKRW } from "@/lib/price";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormField } from "@/components/ui/form";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

import FormInputWrap from "@/components/commons/inputWrap/form";

import type { IProduct, IUpdateProductParams, IUpdateProduct } from "@/types";

const ProductSchema = z.object({
  brand: z.string().optional(),
  name: z.string().optional(),
  salePrice: z.number().min(1, "판매가격을 입력해주세요."),
});

interface ISalesWriteProps {
  uid: string;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  updateTarget: IProduct | undefined;
  setUpdateTarget: React.Dispatch<React.SetStateAction<IProduct | undefined>>;
  updateProduct: ({ targetId, product }: IUpdateProductParams) => Promise<void>;
  fetchProducts: () => Promise<void>;
}

export default function SalesWrite({ uid, isOpen, setIsOpen, updateTarget, setUpdateTarget, updateProduct, fetchProducts }: ISalesWriteProps) {
  const isEdit = !!updateTarget;

  // ✍️ 폼 설정
  const form = useForm<z.infer<typeof ProductSchema>>({
    resolver: zodResolver(ProductSchema),
    defaultValues: {
      name: "",
      brand: "",
      salePrice: 0,
    },
  });

  // updateTarget 변경 시 form 값을 리셋
  useEffect(() => {
    if (isEdit) {
      form.reset({
        brand: updateTarget.brand,
        name: updateTarget.name,
        salePrice: updateTarget.salePrice,
      });
    } else {
      form.reset({
        brand: "",
        name: "",
        salePrice: 0,
      });
    }
  }, [form, isOpen, isEdit, updateTarget]);

  // 수정 함수
  const onClickUpdate = async (data: z.infer<typeof ProductSchema>) => {
    if (!uid || !isEdit) return;

    try {
      const product: IUpdateProduct = {
        ...data,
        profit: data.salePrice - getPriceInKRW(updateTarget.costPrice.amount, updateTarget.costPrice.currency.krw),
      };

      // 데이터 수정 및 리패치
      await updateProduct({ targetId: updateTarget?._id, product });
      await fetchProducts();

      toast("🔄 상품 판매가가 변경되었습니다.");
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
      <DialogContent className="max-w-120">
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
                      <Input type="number" placeholder="예) 1000" {...field} className="bg-white" onChange={(e) => field.onChange(Number(e.target.value))} />
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
