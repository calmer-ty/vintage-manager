import { z } from "zod";

export const FormSchema = z.object({
  category: z.string().min(1, "카테고리를 선택해주세요."),
  brandName: z.string().min(1, "브랜드명은 최소 1글자 이상입니다."),
  name: z.string().min(1, "제품명은 최소 1글자 이상입니다."),
  price: z.string().min(1, "가격을 입력해주세요."),
  currencyValue: z.string().min(1, "통화를 선택해주세요."),
  priceKRW: z.string().optional(), // 필요에 따라
});
