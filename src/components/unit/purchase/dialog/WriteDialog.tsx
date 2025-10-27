import { toast } from "sonner";
import { v4 as uuid } from "uuid";

import { useExchangeRate } from "@/hooks/useExchangeRate";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormField } from "@/components/ui/form";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

import FormInputWrap from "@/components/commons/FormInputWrap";
import PurchaseSelect from "../PurchaseSelect";

import type { z } from "zod";
import type { Dispatch, SetStateAction } from "react";
import type { ICreatePackageDoc, ICreatePackageParams } from "@/types";
import type { UseFormReturn } from "react-hook-form";
import type { PurchaseSchema } from "../schema";
import type { RowSelectionState } from "@tanstack/react-table";
interface IWriteDialogProps {
  form: UseFormReturn<z.infer<typeof PurchaseSchema>>;
  setRowSelection: Dispatch<SetStateAction<RowSelectionState>>;
  isWriteOpen: boolean;
  setIsWriteOpen: Dispatch<SetStateAction<boolean>>;
  createPackage: ({ packageDoc }: ICreatePackageParams) => Promise<void>;
  fetchPackages: () => Promise<void>;
}

export default function WriteDialog({
  form,
  setRowSelection,
  isWriteOpen,
  setIsWriteOpen,
  createPackage,
  fetchPackages,
}: IWriteDialogProps) {
  // 환율 데이터
  const { exchangeOptions } = useExchangeRate();

  // 등록 함수
  const onClickCreate = async (data: z.infer<typeof PurchaseSchema>) => {
    try {
      const packageDoc: ICreatePackageDoc = {
        products: data.products.map((p) => ({
          _id: uuid(),
          ...p,
        })),
      };

      // 데이터 생성 및 리패치
      await createPackage({ packageDoc });
      await fetchPackages();

      // 등록 성공 후 폼 초기화 및 토스트 띄우기
      toast("✅ 상품이 성공적으로 등록되었습니다.");
      setRowSelection({});
      setIsWriteOpen(false);
      form.reset();
    } catch (error) {
      console.error("문서 추가 실패:", error);
    }
  };

  return (
    <Dialog
      open={isWriteOpen}
      onOpenChange={(open) => {
        if (!open) {
          form.reset();
          setIsWriteOpen(false);
        } else {
          setIsWriteOpen(true);
        }
      }}
    >
      <DialogContent className="max-w-120">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onClickCreate)} className="flex flex-col gap-4">
            <DialogHeader>
              <DialogTitle>패키지 등록</DialogTitle>
              <DialogDescription>패키지 정보를 입력하고 등록하세요.</DialogDescription>
            </DialogHeader>

            <div className="flex-1 overflow-y-auto max-h-100">
              <h3 className="flex justify-between items-center mb-4 px-3 py-1 border-t bg-gray-200">
                <span className="text-sm font-bold">매입 상품</span>
              </h3>

              <fieldset className="flex flex-col gap-4 px-2">
                <FormField
                  control={form.control}
                  name="products.0.cost.exchange"
                  render={({ field }) => (
                    <PurchaseSelect
                      onChange={(code) => {
                        const selected = exchangeOptions.find((opt) => opt.code === code);
                        if (selected) {
                          field.onChange(selected);
                        }
                      }}
                      value={field.value}
                      label="당신이 사용한 통화를 선택해주세요."
                    />
                  )}
                />

                <FormField
                  control={form.control}
                  name="products.0.name.product"
                  render={({ field }) => (
                    <FormInputWrap title="제품명">
                      <Input placeholder="예) 럭비 셔츠" {...field} className="bg-white" autoComplete="off" />
                    </FormInputWrap>
                  )}
                />
                <FormField
                  control={form.control}
                  name="products.0.name.brand"
                  render={({ field }) => (
                    <FormInputWrap title="브랜드명">
                      <Input placeholder="예) 엘엘빈" {...field} className="bg-white" autoComplete="off" />
                    </FormInputWrap>
                  )}
                />

                <FormField
                  control={form.control}
                  name="products.0.cost.price"
                  render={({ field }) => (
                    <div className="flex items-start gap-2">
                      <FormInputWrap title="매입가">
                        <Input
                          type="number"
                          placeholder="예) 1000"
                          className="bg-white"
                          value={field.value}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormInputWrap>
                    </div>
                  )}
                ></FormField>
                <FormField
                  control={form.control}
                  name="products.0.cost.shipping"
                  render={({ field }) => (
                    <div className="flex items-start gap-2">
                      <FormInputWrap title="국내 배송료" tooltip="현지에서 발생된 배송료입니다.">
                        <Input
                          type="number"
                          placeholder="예) 1000"
                          className="bg-white"
                          value={field.value}
                          onChange={(e) => field.onChange(Number(e.target.valueAsNumber ?? 0))}
                        />
                      </FormInputWrap>
                    </div>
                  )}
                ></FormField>
                <FormField
                  control={form.control}
                  name="products.0.cost.fee"
                  render={({ field }) => (
                    <div className="flex items-start gap-2">
                      <FormInputWrap title="수수료">
                        <Input
                          type="number"
                          placeholder="예) 1000"
                          className="bg-white"
                          value={field.value}
                          onChange={(e) => field.onChange(Number(e.target.valueAsNumber ?? 0))}
                        />
                      </FormInputWrap>
                    </div>
                  )}
                ></FormField>
              </fieldset>
            </div>

            <DialogFooter className="mt-4">
              <DialogClose asChild>
                <Button variant="outline">취소</Button>
              </DialogClose>
              <Button type="submit">등록</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
