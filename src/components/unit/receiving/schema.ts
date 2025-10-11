import { z } from "zod";

const currencySchema = z.object({
  code: z.string(),
  label: z.string(),
  rate: z.number(),
  krw: z.number(),
});

const ProductSchema = z.object({
  name: z.string().min(1, "상품명은 최소 1글자 이상입니다."),
  brand: z.string(),
  costPrice: z
    .object({
      amount: z.number(),
      currency: currencySchema,
    })
    .superRefine((val, ctx) => {
      if (!val.amount || !val.currency) {
        ctx.addIssue({
          code: "custom",
          path: [],
          message: "매입가와 사용된 통화를 모두 입력해주세요.",
        });
      }
    }),
});
export const PackageSchema = z.object({
  products: z.array(ProductSchema).min(1, "상품을 최소 1개 입력해주세요."),
});
export const ShippingSchema = z.object({
  shipping: z
    .object({
      amount: z.string(),
      currency: z.string(),
    })
    .superRefine((val, ctx) => {
      // 둘 중 하나만 입력됐을 때
      if (!val.amount || !val.currency) {
        ctx.addIssue({
          code: "custom",
          path: [],
          message: "배송비와 사용된 통화를 모두 입력해주세요.",
        });
      }
    }),
  fee: z
    .object({
      amount: z.string(),
      currency: z.string(),
    })
    .superRefine((val, ctx) => {
      // 둘 중 하나만 입력됐을 때
      if (!val.amount || !val.currency) {
        ctx.addIssue({
          code: "custom",
          path: [],
          message: "수수료와 사용된 통화를 모두 입력해주세요.",
        });
      }
    }),
});
