"use client";

import { useState } from "react";

import { useGradeDialog } from "@/contexts/gradeModalContext";
import { useUserData } from "@/contexts/userDataContext";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import GradeSelect from "./SelectContent";
import GradeConfirm from "./CofirmContent";

export default function GradeDialog() {
  const [step, setStep] = useState<"select" | "confirm">("select");
  const [selectGrade, setSelectGrade] = useState<"free" | "pro" | null>(null);

  const { isOpenGrade, setIsOpenGrade, closeGrade } = useGradeDialog();
  const { userData, upgradeGrade, downgradeGrade } = useUserData();

  return (
    <Dialog
      open={isOpenGrade}
      onOpenChange={(open) => {
        setIsOpenGrade(open); // open = 모달이 열려있는지 boolean

        if (!open) {
          setTimeout(() => {
            setStep("select");
          }, 500);
        }
      }}
    >
      <DialogContent className="overflow-auto w-full sm:max-w-2xl sm:px-16 sm:py-10">
        <DialogHeader className="items-center px-10">
          <DialogTitle className="mb-2 text-xl">
            {selectGrade === "pro" ? "빈티지 노트 업그레이드" : selectGrade === "free" ? "빈티지 노트 다운그레이드" : "빈티지 노트 요금제"}
          </DialogTitle>
        </DialogHeader>

        {step === "select" && <GradeSelect userData={userData} setStep={setStep} setSelectGrade={setSelectGrade} />}
        {step === "confirm" && (
          <GradeConfirm
            closeGrade={closeGrade}
            setStep={setStep}
            selectGrade={selectGrade}
            setSelectGrade={setSelectGrade}
            upgradeGrade={upgradeGrade}
            downgradeGrade={downgradeGrade}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
