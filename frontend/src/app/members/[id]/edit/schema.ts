import { z } from "zod";

export const ParliamentaryGroupSchema = z
  .union([
    z.literal("JIMIN"),
    z.literal("RIKKEN"),
    z.literal("KOMEI"),
    z.literal("KYOSAN"),
    z.literal("ISHIN"),
    z.literal("KOKUMIN"),
    z.literal("REIWA"),
    z.literal(""),
  ])
  .transform((val) => (val === "" ? null : val));
export const HouseSchema = z.enum(["REPRESENTATIVES", "COUNCILLORS"]);

export const MemberSchema = z.object({
  groupId: ParliamentaryGroupSchema.nullable(),
  house: HouseSchema.nullable(),
  id: z.string().cuid(),
  name: z
    .string()
    .nonempty({ message: "入力は必須です。" })
    .max(20, "20文字以内で入力してください。"),
  firstName: z.string().nullable(),
  lastName: z.string().nullable(),
  firstNameHira: z.string().nullable(),
  lastNameHira: z.string().nullable(),
  description: z.string().nullable(),
  website: z
    .union([
      z.literal(""),
      z
        .string()
        .trim()
        .url({ message: "httpから始まる正しいURLを入力してください" }),
    ])
    .transform((val) => (val === "" ? null : val)),
  twitter: z
    .union([
      z.literal(""),
      z
        .string()
        .min(1, "ハンドルネームは1文字以上でなければなりません。")
        .max(15, "ハンドルネームは15文字以上にはできません。")
        .refine((handle) => /^[A-Za-z0-9_]+$/.test(handle), {
          message:
            "ハンドルネームには、英数字またはアンダースコアのみを使用できます。",
        }),
    ])
    .transform((val) => (val === "" ? null : val)),
});

export type FormSchema = z.infer<typeof MemberSchema>;
