import { z } from "zod";

const exchangeSchema = z
  .object({
    code: z.string(),
    label: z.string(),
    rate: z.number(),
    krw: z.number(),
  })
  .refine((val) => val.code !== "", { message: "통화를 선택해주세요." });

const ProductSchema = z.object({
  name: z.string().min(1, "상품명은 최소 1글자 이상입니다."),
  brand: z.string(),
  cost: z.object({
    price: z.number().min(1, "가격은 1 이상이어야 합니다."),
    shipping: z.number().min(0, "배송비는 0 이상이어야 합니다."),
    fee: z.number().min(0, "수수료는 0 이상이어야 합니다."),
    exchange: exchangeSchema,
  }),
});
// const ProductSchema = z.object({
//   name: z.string().min(1, "상품명은 최소 1글자 이상입니다."),
//   brand: z.string(),
//   costPrice: z
//     .object({
//       amount: z.number().min(1, "가격은 1 이상이어야 합니다."),
//       exchange: exchangeSchema,
//     })
//     .superRefine((val, ctx) => {
//       if (!val.amount || !val.exchange.code) {
//         ctx.addIssue({
//           code: "custom",
//           path: [],
//           message: "매입가와 사용된 통화를 모두 입력해주세요.",
//         });
//       }
//     }),
// });
export const PurchaseSchema = z.object({
  products: z.array(ProductSchema),
});
export const ShippingSchema = z.object({
  shipping: z
    .object({
      amount: z.number(),
      exchange: exchangeSchema,
    })
    .superRefine((val, ctx) => {
      // 둘 중 하나만 입력됐을 때
      if (!val.amount || !val.exchange.code) {
        ctx.addIssue({
          code: "custom",
          path: [],
          message: "배송비와 사용된 통화를 모두 입력해주세요.",
        });
      }
    }),
});
