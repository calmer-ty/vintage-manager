import { FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

interface IFormInputProps {
  title: string;
  children: React.ReactNode;
}

export default function FormInputWrap({ title, children }: IFormInputProps) {
  return (
    <FormItem className="w-full">
      <FormLabel>{title}</FormLabel>
      <FormControl>{children}</FormControl>
      <FormMessage />
    </FormItem>
  );
}
