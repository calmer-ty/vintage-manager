import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface IBasicTooltipProps {
  children: React.ReactNode;
  content?: string;
}

export default function ChildrenTooltip({ children, content }: IBasicTooltipProps) {
  // content가 없으면 Tooltip 자체를 렌더링하지 않음
  if (!content) return <>{children}</>;

  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>

      <TooltipContent>
        <p>{content}</p>
      </TooltipContent>
    </Tooltip>
  );
}
