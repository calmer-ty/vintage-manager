import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

import { BarChart, CreditCard, DollarSign, Layout } from "lucide-react";

import type { IUserData } from "@/types";
import type { Dispatch, SetStateAction } from "react";
interface IGradeSelectProps {
  setStep: Dispatch<SetStateAction<"select" | "confirm">>;
  setSelectGrade: Dispatch<SetStateAction<"free" | "pro" | null>>;
  userData: IUserData | null;
}

const plans = [
  {
    title: "free",
    desc: "국내 거래 내역을 쉽게.",
    price: "무료",
    recommend: "국내 제품을구입하거나 가볍게 사용하시는 분에게 적합합니다.",
    features: [
      { icon: <CreditCard className="inline-block w-4 h-4 mr-1 align-middle text-green-600" />, desc: "원화 매입 · 판매 데이터 제공" },
      { icon: <Layout className="inline-block w-4 h-4 mr-1 align-middle text-green-600" />, desc: "기본 거래내역 대시보드 제공" },
    ],
  },
  {
    title: "pro",
    desc: "다양한 통화로 거래 내역을 한눈에.",
    price: "기간 한정 무료",
    recommend: "다양한 국가에서 제품을 구매하여 관리하시는 분에게 적합합니다.",
    features: [
      {
        icon: <DollarSign className="inline-block w-4 h-4 mr-1 align-middle text-green-600" />,
        desc: "원화 + 외화(달러 · 엔) 매입 · 판매 데이터",
      },
      {
        icon: <BarChart className="inline-block w-4 h-4 mr-1 align-middle text-green-600" />,
        desc: "기본 + 그래프 거래내역 대시보드 제공",
      },
    ],
  },
];

export default function GradeSelect({ setStep, setSelectGrade, userData }: IGradeSelectProps) {
  return (
    <div className="flex flex-col gap-6 sm:flex-row">
      {plans.map((plan) => {
        const grade = plan.title as "free" | "pro";

        return (
          <Card key={plan.title} className="px-8 py-8 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800">
            <CardHeader className="px-0">
              <CardTitle className="capitalize">{plan.title}</CardTitle>
              <CardDescription>{plan.desc}</CardDescription>
            </CardHeader>
            <CardContent className="px-0 pb-6 border-b border-muted-foreground/20 text-center">
              <p className="mb-2 text-2xl font-bold">{plan.price}</p>
              <p className="mb-4 text-muted-foreground text-sm break-keep leading-6">{plan.recommend}</p>
              <Button
                variant={userData?.grade === plan.title ? "outline" : "confirm"}
                size="lg"
                onClick={() => {
                  setSelectGrade(grade);
                  setStep("confirm");
                }}
                className={userData?.grade === plan.title ? "pointer-events-none text-muted-foreground" : "text-white"}
              >
                <span className="">{userData?.grade === plan.title ? "현재 이용중" : "요금제 선택"}</span>
              </Button>
            </CardContent>
            <CardFooter className="block px-0">
              <ul className="space-y-3 text-sm">
                {plan.features.map((feature) => (
                  <li key={feature.desc}>
                    {feature.icon} {feature.desc}
                  </li>
                ))}
              </ul>
              {plan.title === "pro" && (
                <p className="mt-4 text-sm text-blue-600 font-medium">지금 업그레이드하고 모든 통화를 바로 사용하세요.</p>
              )}
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
