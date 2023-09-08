import { z } from "zod";

export const NoteSchema = z.object({
  id: z.string().cuid(),
  end: z.number(),
  start: z.number(),
  text: z.string().nonempty({ message: "入力は必須です。" }),
});

export type FormSchema = z.infer<typeof NoteSchema>;
