import { toast } from "sonner";
import { v4 as uuid } from "uuid";

import { useGradeDialogStore } from "@/store/useGradeDialogStore";
import { useUserDataStore } from "@/store/useUserDataStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useExchangeRate } from "@/hooks/useExchangeRate";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormField } from "@/components/ui/form";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

import FormInputWrap from "@/components/commons/FormInputWrap";
import PurchaseSelect from "../PurchaseSelect";

import type { z } from "zod";
import type { Dispatch, SetStateAction } from "react";
import type { IProduct } from "@/types";
import type { UseFormReturn } from "react-hook-form";
import type { ProductsSchema } from "../schema";
import type { RowSelectionState } from "@tanstack/react-table";
interface IWriteDialogProps {
  form: UseFormReturn<z.infer<typeof ProductsSchema>>;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  setRowSelection: Dispatch<SetStateAction<RowSelectionState>>;
  createPackage: (packageDoc: IProduct[]) => Promise<void>;
  fetchPackages: () => Promise<void>;
}

export default function WriteDialog({ form, isOpen, setIsOpen, setRowSelection, createPackage, fetchPackages }: IWriteDialogProps) {
  const { user } = useAuthStore();

  // 환율 데이터
  const { exchangeOptions } = useExchangeRate();

  const { userData } = useUserDataStore();
  const { openGrade } = useGradeDialogStore();

  // 등록 함수
  const onClickCreate = async (data: z.infer<typeof ProductsSchema>) => {
    if (!user) {
      toast("⛔ 로그인이 되어 있지 않습니다.");
      return;
    }

    try {
      // 굳이 배열로 넣는 이유는 추후 상품들이 머지가 되면서 products가 배열 형태가 되므로 타입을 맞추기 위해 처음부터 배열값으로 넣어 설정합니다
      const packageDoc: IProduct[] = data.products.map((p) => ({
        uid: user.uid,
        _id: uuid(),
        ...p,
      }));
      // 데이터 생성 및 리패치
      await createPackage(packageDoc);
      await fetchPackages();

      // 등록 성공 후 폼 초기화 및 토스트 띄우기
      toast("✅ 상품이 성공적으로 등록되었습니다.");
      setRowSelection({});
      setIsOpen(false);
      form.reset();
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
        } else {
          setIsOpen(true);
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
              <fieldset className="flex flex-col gap-4 px-2">
                <FormField
                  control={form.control}
                  name="products.0.cost.exchange"
                  render={({ field }) => (
                    <PurchaseSelect
                      userData={userData}
                      onChange={(code) => {
                        // grade 체크
                        if (userData?.grade === "free" && (code === "USD" || code === "JPY")) {
                          openGrade();
                          return; // 선택 변경 막기
                        }

                        const selected = exchangeOptions.find((opt) => opt.code === code);
                        if (selected) {
                          field.onChange(selected);
                        }
                      }}
                      value={field.value.code}
                      label="당신이 사용한 통화를 선택해주세요."
                    />
                  )}
                />

                <FormField
                  control={form.control}
                  name="products.0.name"
                  render={({ field }) => (
                    <FormInputWrap title="제품명">
                      <Input placeholder="예) 럭비 셔츠" {...field} className="bg-white" autoComplete="off" />
                    </FormInputWrap>
                  )}
                />
                <FormField
                  control={form.control}
                  name="products.0.brand"
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
                          onWheel={(e) => e.currentTarget.blur()}
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
                      <FormInputWrap title="매입 배송료">
                        <Input
                          type="number"
                          placeholder="예) 1000"
                          className="bg-white"
                          value={field.value}
                          onChange={(e) => field.onChange(Number(e.target.valueAsNumber ?? 0))}
                          onWheel={(e) => e.currentTarget.blur()}
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
                      <FormInputWrap title="매입 수수료">
                        <Input
                          type="number"
                          placeholder="예) 1000"
                          className="bg-white"
                          value={field.value}
                          onChange={(e) => field.onChange(Number(e.target.valueAsNumber ?? 0))}
                          onWheel={(e) => e.currentTarget.blur()}
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
