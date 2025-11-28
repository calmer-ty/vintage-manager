import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

import { BarChart, CreditCard, DollarSign, Layout } from "lucide-react";

import type { IUserData } from "@/types";
import type { Dispatch, SetStateAction } from "react";
interface IGradeSelectProps {
  userData: IUserData | undefined;
  setSelectGrade: Dispatch<SetStateAction<"free" | "pro" | null>>;
  setStep: Dispatch<SetStateAction<"select" | "confirm">>;
}

export default function GradeSelect({ userData, setSelectGrade, setStep }: IGradeSelectProps) {
  return (
    <div className="flex flex-col gap-6 sm:flex-row">
      {/* Free Plan */}
      <Card className="px-8 py-8 transition-colors hover:bg-gray-50">
        <CardHeader className="px-0">
          <CardTitle>Free</CardTitle>
          <CardDescription>국내 거래 내역을 쉽게.</CardDescription>
        </CardHeader>
        <CardContent className="px-0 pb-6 border-b border-muted-foreground/20 text-center">
          <p className="mb-2 text-2xl font-bold">무료</p>
          <p className="mb-4 text-muted-foreground text-sm break-keep leading-6">
            국내 제품을구입하거나 가볍게 사용하시는 분에게 적합합니다.
          </p>
          <Button
            variant={userData?.grade === "free" ? "outline" : "confirm"}
            size="lg"
            onClick={() => {
              setSelectGrade("free");
              setStep("confirm");
            }}
            className={userData?.grade === "free" ? "pointer-events-none text-muted-foreground" : ""}
          >
            {userData?.grade === "free" ? "현재 이용중" : "요금제 선택"}
          </Button>
        </CardContent>
        <CardFooter className="block px-0">
          <ul className="space-y-3 text-sm">
            <li>
              <CreditCard className="inline-block w-4 h-4 mr-1 align-middle text-green-600" /> 원화 매입 · 판매 데이터 제공
            </li>
            <li>
              <Layout className="inline-block w-4 h-4 mr-1 align-middle text-green-600" /> 기본 거래내역 대시보드 제공
            </li>
          </ul>
        </CardFooter>
      </Card>

      {/* Pro Plan */}
      <Card className="relative px-8 py-8 transition-colors hover:bg-gray-50">
        <span className="absolute top-4 right-4 px-2 py-1 bg-blue-100 text-blue-600 rounded-full text-xs font-medium">추천</span>
        <CardHeader className="px-0">
          <CardTitle>Pro</CardTitle>
          <CardDescription>다양한 통화로 거래 내역을 한눈에.</CardDescription>
        </CardHeader>
        <CardContent className="px-0 pb-6 border-b border-muted-foreground/20 text-center">
          <p className="mb-2 text-2xl font-bold">기간 한정 무료</p>
          <p className="mb-4 text-muted-foreground text-sm break-keep leading-6">
            다양한 국가에서 제품을 구매하여 관리하시는 분에게 적합합니다.
          </p>
          <Button
            variant={userData?.grade === "pro" ? "outline" : "confirm"}
            size="lg"
            onClick={() => {
              setSelectGrade("pro");
              setStep("confirm");
            }}
            className={userData?.grade === "pro" ? "pointer-events-none text-muted-foreground" : ""}
          >
            {userData?.grade === "pro" ? "현재 이용중" : "요금제 선택"}
          </Button>
        </CardContent>
        <CardFooter className="block px-0">
          <ul className="space-y-3 text-sm">
            <li>
              <DollarSign className="inline-block w-4 h-4 mr-1 align-middle text-green-600" /> 원화 + 외화(달러 · 엔) 매입 · 판매 데이터
              제공
            </li>
            <li>
              <BarChart className="inline-block w-4 h-4 mr-1 align-middle text-green-600" /> 기본 + 그래프 거래내역 대시보드 제공
            </li>
          </ul>
          {/* 행동 유도 멘트 */}
          <p className="mt-4 text-sm text-blue-600 font-medium">지금 업그레이드하고 모든 통화를 바로 사용하세요.</p>
        </CardFooter>
      </Card>
    </div>
  );
}
