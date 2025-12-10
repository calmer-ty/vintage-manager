import { toast } from "sonner";
import clsx from "clsx";

import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import type { Dispatch, SetStateAction } from "react";
import type { User } from "firebase/auth";
import { useAuthStore } from "@/store/useAuthStore";

interface IGradeConfirmProps {
  selectGrade: "free" | "pro" | null;
  setStep: Dispatch<SetStateAction<"select" | "confirm">>;
  setGrade: (user: User, grade: "free" | "pro") => Promise<void>;
  setSelectGrade: Dispatch<SetStateAction<"free" | "pro" | null>>;
  closeDialog: () => void;
}
const features = [
  {
    head: "원화 거래",
    freeIcon: "✔",
    proIcon: "✔",
    freeColor: "",
    proColor: "",
    selectedColor: "bg-blue-300",
  },
  {
    head: "외화(달러 · 엔) 거래",
    freeIcon: "✖",
    proIcon: "✔",
    freeColor: "text-red-600",
    proColor: "text-green-600",
    selectedColor: "bg-blue-300",
  },
  {
    head: "기본 대시보드",
    freeIcon: "✔",
    proIcon: "✔",
    freeColor: "",
    proColor: "",
    selectedColor: "bg-blue-300",
  },
  {
    head: "그래프 대시보드",
    freeIcon: "✖",
    proIcon: "✔",
    freeColor: "text-red-600",
    proColor: "text-green-600",
    selectedColor: "bg-blue-300",
  },
];

export default function GradeConfirm({ selectGrade, setStep, setSelectGrade, closeDialog, setGrade }: IGradeConfirmProps) {
  const { user } = useAuthStore();

  return (
    <>
      <Button variant="outline" size="icon" className="absolute left-4 top-4 border-none shadow-none" onClick={() => setStep("select")}>
        <ArrowLeft />
      </Button>
      <Card className="mt-6 px-8 py-8">
        <CardHeader className="px-0">
          <CardTitle>{selectGrade === "pro" ? "Pro 요금제로 업그레이드하시겠어요?" : "Free 요금제로 전환하시겠어요?"}</CardTitle>
          <CardDescription>아래 표에서 현재 요금제와 선택 요금제의 차이를 확인해보세요.</CardDescription>
        </CardHeader>

        <CardContent className="px-0 pb-6 border-b border-muted-foreground/20 text-left">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>기능</TableHead>
                <TableHead className={selectGrade === "free" ? "bg-blue-100 dark:bg-blue-900/40 text-center" : "text-center"}>
                  Free
                </TableHead>
                <TableHead className={selectGrade === "pro" ? "bg-blue-100 dark:bg-blue-900/40 text-center" : "text-center"}>Pro</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {features.map((feature) => (
                <TableRow key={feature.head} className="border-none">
                  <TableCell>{feature.head}</TableCell>
                  <TableCell
                    className={clsx("text-center", feature.freeColor, selectGrade === "free" && "bg-blue-100 dark:bg-blue-900/40")}
                  >
                    {feature.freeIcon}
                  </TableCell>
                  <TableCell className={clsx("text-center", feature.proColor, selectGrade === "pro" && "bg-blue-100 dark:bg-blue-900/40")}>
                    {feature.proIcon}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>

        <CardFooter className="px-0 pt-4 flex flex-col gap-3">
          <Button
            size="lg"
            variant="confirm"
            onClick={() => {
              if (user) {
                if (selectGrade === "pro") setGrade(user, "pro");
                else setGrade(user, "free");
              } else {
                toast.error("로그인이 필요합니다.");
                return;
              }
              closeDialog();
              toast(
                <p>
                  ✅ <strong className="capitalize">{selectGrade}</strong> 요금제가 성공적으로 변경되었습니다.
                </p>
              );

              setTimeout(() => {
                setStep("select");
                setSelectGrade(null);
              }, 500);
            }}
            className="text-white"
          >
            {selectGrade === "pro" ? "업그레이드 확정하기" : "변경 확정하기"}
          </Button>

          <Button
            variant="link"
            className="text-sm text-muted-foreground"
            onClick={() => {
              setStep("select");
              setSelectGrade(null);
            }}
          >
            취소하고 돌아가기
          </Button>
        </CardFooter>
      </Card>
    </>
  );
}
