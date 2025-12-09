import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { useAuthStore } from "@/store/useAuthStore";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormField } from "@/components/ui/form";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import FormInputWrap from "@/components/commons/FormInputWrap";

import type { ISalesProduct, ISalesProductParams, ISales } from "@/types";

const SalesSchema = z.object({
  name: z.string().optional(),
  brand: z.string().optional(),
  sales: z.object({
    price: z.number().min(1, "판매가격을 입력해주세요."),
    fee: z.number().min(1, "수수료를 입력해주세요."),
    shipping: z.number().min(1, "배송료를 입력해주세요."),
  }),
});

interface IWriteDialogProps {
  isOpen: boolean;
  updateTarget: ISalesProduct | undefined;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setUpdateTarget: React.Dispatch<React.SetStateAction<ISalesProduct | undefined>>;
  salesProduct: ({ target, salesDoc }: ISalesProductParams) => Promise<void>;
  fetchProducts: () => Promise<void>;
}

export default function WriteDialog({ isOpen, updateTarget, setIsOpen, setUpdateTarget, salesProduct, fetchProducts }: IWriteDialogProps) {
  const { user } = useAuthStore();

  // ✍️ 폼 설정
  const form = useForm<z.infer<typeof SalesSchema>>({
    resolver: zodResolver(SalesSchema),
    defaultValues: { name: "", brand: "", sales: { price: 0, fee: 0, shipping: 0 } },
  });

  // updateTarget 변경 시 form 값을 리셋
  useEffect(() => {
    if (updateTarget) {
      form.reset({
        name: updateTarget.name,
        brand: updateTarget.brand,
        sales: { price: updateTarget.sales.price, fee: updateTarget.sales.fee, shipping: updateTarget.sales.shipping },
      });
    }
  }, [form, updateTarget]);

  // 수정 함수
  const onClickUpdate = async (data: z.infer<typeof SalesSchema>) => {
    if (!user || !updateTarget) return;

    try {
      const salesDoc: ISales = {
        ...data.sales,
        profit: data.sales.price - data.sales.fee - data.sales.shipping, // 이익 = 판매가 - 판매 수수료 - 판매 배송료
      };

      // 데이터 수정 및 리패치
      await salesProduct({ target: updateTarget?._id, salesDoc });
      await fetchProducts();

      toast("🔄 상품 판매 정보가 변경되었습니다.");
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
              <DialogTitle>상품 판매 정보 입력</DialogTitle>
              <DialogDescription>상품의 판매 정보를 입력하세요.</DialogDescription>
            </DialogHeader>

            <fieldset className="flex flex-col gap-4">
              <div className="flex gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormInputWrap title="제품명">
                      <Input {...field} disabled />
                    </FormInputWrap>
                  )}
                />
                <FormField
                  control={form.control}
                  name="brand"
                  render={({ field }) => (
                    <FormInputWrap title="브랜드명">
                      <Input {...field} disabled />
                    </FormInputWrap>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="sales.price"
                render={({ field }) => (
                  <FormInputWrap title="판매가(₩)">
                    <Input
                      type="number"
                      placeholder="예) 1000"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      onWheel={(e) => e.currentTarget.blur()}
                      value={field.value}
                    />
                  </FormInputWrap>
                )}
              />
              <FormField
                control={form.control}
                name="sales.shipping"
                render={({ field }) => (
                  <FormInputWrap title="판매 배송료(₩)">
                    <Input
                      type="number"
                      placeholder="예) 1000"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      onWheel={(e) => e.currentTarget.blur()}
                      value={field.value}
                    />
                  </FormInputWrap>
                )}
              />
              <FormField
                control={form.control}
                name="sales.fee"
                render={({ field }) => (
                  <FormInputWrap title="판매 수수료(₩)">
                    <Input
                      type="number"
                      placeholder="예) 1000"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      onWheel={(e) => e.currentTarget.blur()}
                      value={field.value}
                    />
                  </FormInputWrap>
                )}
              />
            </fieldset>

            <DialogFooter className="mt-4">
              <DialogClose asChild>
                <Button variant="outline">취소</Button>
              </DialogClose>
              <Button type="submit">입력완료</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
