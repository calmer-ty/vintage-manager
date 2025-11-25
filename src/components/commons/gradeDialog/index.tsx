import { useState } from "react";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import GradeSelect from "./SelectContent";
import GradeConfirm from "./CofirmContent";

import type { IUserData } from "@/types";

interface IGradeDialogProps {
  isProOpen: boolean;
  setIsProOpen: React.Dispatch<React.SetStateAction<boolean>>;
  userData: IUserData;
  upgradeGrade: () => Promise<void>;
  downgradeGrade: () => Promise<void>;
}

export default function GradeDialog({ isProOpen, setIsProOpen, userData, upgradeGrade, downgradeGrade }: IGradeDialogProps) {
  const [step, setStep] = useState<"select" | "confirm">("select");
  const [selectGrade, setSelectGrade] = useState<"free" | "pro" | null>(null);

  return (
    <Dialog open={isProOpen} onOpenChange={setIsProOpen}>
      <DialogContent className="overflow-auto w-full sm:max-w-2xl max-h-2xl sm:px-16 sm:py-10">
        <DialogHeader className="items-center px-10">
          <DialogTitle className="mb-2 text-xl">
            {selectGrade === "pro" ? "빈티지 노트 업그레이드" : selectGrade === "free" ? "빈티지 노트 다운그레이드" : "빈티지 노트 요금제"}
          </DialogTitle>
        </DialogHeader>

        {step === "select" && <GradeSelect userData={userData} setStep={setStep} setSelectGrade={setSelectGrade} />}
        {step === "confirm" && (
          <GradeConfirm
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
