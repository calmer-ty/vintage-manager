import { z } from "zod";

const ProductSchema = z.object({
  name: z.string().min(1, "제품명은 최소 1글자 이상입니다."),
  brand: z.string().min(1, "브랜드명은 최소 1글자 이상입니다."),
  costPrice: z
    .object({
      amount: z.string(),
      currency: z.string(),
    })
    .superRefine((val, ctx) => {
      if (!val.amount || !val.currency) {
        ctx.addIssue({
          code: "custom",
          path: [],
          message: "매입가와 통화를 모두 입력해주세요.",
        });
      }
    }),
});
export const PackageSchema = z.object({
  // shipping: z
  //   .object({
  //     amount: z.string(),
  //     currency: z.string(),
  //   })
  //   .superRefine((val, ctx) => {
  //     // 둘 중 하나만 입력됐을 때
  //     if ((val.amount && !val.currency) || (!val.amount && val.currency)) {
  //       ctx.addIssue({
  //         code: "custom",
  //         path: [],
  //         message: "배송비와 통화를 모두 입력해주세요.",
  //       });
  //     }
  //   }),
  products: z.array(ProductSchema).min(1, "상품을 최소 1개 입력해주세요."),
});
