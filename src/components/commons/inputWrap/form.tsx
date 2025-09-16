import { FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface IFormInputProps {
  title: string;
  children: React.ReactNode;
  tooltip?: string;
}

export default function FormInputWrap({ title, children, tooltip }: IFormInputProps) {
  return (
    <FormItem className="w-full">
      <FormLabel className="gap-0.5">
        {title}
        {tooltip && (
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="text-red-700 cursor-help">*</span>
            </TooltipTrigger>
            <TooltipContent>
              <p>{tooltip}</p>
            </TooltipContent>
          </Tooltip>
        )}
      </FormLabel>

      <FormControl>{children}</FormControl>
      <FormMessage />
    </FormItem>
  );
}
