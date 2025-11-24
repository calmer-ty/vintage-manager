// 외부 요소
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface IProDialogProps {
  isProOpen: boolean;
  setIsProOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ProDialog({ isProOpen, setIsProOpen }: IProDialogProps) {
  return (
    <Dialog open={isProOpen} onOpenChange={setIsProOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="items-center px-10">
          <DialogTitle className="mb-2 text-xl">Pro 등급으로 업그레이드</DialogTitle>
          <DialogDescription>
            해외 상품을 관리할 수 있도록 업그레이드하세요. 지금 업그레이드하면 최신 환율과 해외 통화를 바로 사용할 수 있습니다.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="sm:justify-center">
          <Button variant="confirm">지금 Pro 업그레이드</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
