import { useRouter } from "next/navigation";
// 외부 요소
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

interface IProDialogProps {
  isProOpen: boolean;
  setIsProOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ProDialog({ isProOpen, setIsProOpen }: IProDialogProps) {
  const router = useRouter();

  return (
    <Dialog open={isProOpen} onOpenChange={setIsProOpen}>
      <DialogContent className="overflow-auto w-full sm:max-w-2xl max-h-180">
        <DialogHeader className="items-center px-10">
          <DialogTitle className="mb-2 text-xl">빈티지 노트 요금제</DialogTitle>
          <DialogDescription>
            해외 상품을 관리할 수 있도록 업그레이드하세요. 지금 업그레이드하면 최신 환율과 해외 통화를 바로 사용할 수 있습니다.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-6 sm:flex-row">
          {/* Free Plan */}
          <Card className="px-8 py-8 transition-colors hover:bg-gray-50">
            <CardHeader className="px-0">
              <CardTitle>Free</CardTitle>
              <CardDescription>국내 거래 내역을 쉽게.</CardDescription>
            </CardHeader>
            <CardContent className="px-0 pb-6 border-b border-muted-foreground/20 text-center">
              <p className="mb-2 text-2xl font-bold">무료</p>
              <p className="mb-4 text-muted-foreground text-sm break-keep">국내 제품을구입하거나 가볍게 사용하시는 분에게 적합합니다.</p>
              <Button variant="outline" size="lg" disabled>
                현재 이용중
              </Button>
            </CardContent>
            <CardFooter className="block">
              <ul className="space-y-3">
                <li>• 원화 매입 · 판매 데이터 제공</li>
                <li>• 기본 거래내역 대시보드 제공</li>
              </ul>
            </CardFooter>
          </Card>

          {/* Pro Plan */}
          <Card className="relative px-8 py-8 transition-colors hover:bg-gray-50">
            <span className="absolute top-4 right-4 px-2 py-1 bg-blue-100 text-blue-600 rounded-full text-xs font-medium">추천</span>
            <CardHeader className="px-0">
              {/* <div className="flex items-center justify-between"> */}
              <CardTitle>Pro</CardTitle>
              {/* </div> */}
              <CardDescription>다양한 통화로 거래 내역을 한눈에.</CardDescription>
            </CardHeader>
            <CardContent className="px-0 pb-6 border-b border-muted-foreground/20 text-center">
              <p className="mb-2 text-2xl font-bold">기간 한정 무료</p>
              <p className="mb-4 text-muted-foreground text-sm break-keep">다양한 국가에서 제품을 구매하여 관리하시는 분에게 적합합니다.</p>
              <Button variant="confirm" size="lg" onClick={() => console.log("Upgrade Click:")}>
                Pro 업그레이드하기
              </Button>
            </CardContent>
            <CardFooter className="block">
              <ul className="space-y-3">
                <li>• 외화(달러 · 엔) 매입 · 판매 데이터 제공</li>
                <li>• 그래프 거래내역 대시보드 제공</li>
                <li>• 외화 데이터 보기 제공</li>
              </ul>
              {/* 행동 유도 멘트 */}
              <p className="mt-4 text-sm text-blue-600 font-medium">지금 업그레이드하고 모든 통화를 바로 사용하세요.</p>
            </CardFooter>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
