import { CollectionCollors } from "@/constant";
import { z } from "zod";

export const createCollectionSchema = z.object({
  name: z.string().min(4, {
    message: "Name must be at least 4 characters",
  }),
  color: z
    .string()
    .refine((color) => Object.keys(CollectionCollors).includes(color)),
});

export type createCollectionSchemaType = z.infer<typeof createCollectionSchema>;
