import { z } from "zod";

export const createTaskSchema = z.object({
  name: z
    .string()
    .min(4, {
      message: "Name must be at least 4 characters",
    })
    .max(50, {
      message: "Name must be lower than 50 characters",
    }),
  dueTime: z.date().optional(),
});

export type createTaskSchemaType = z.infer<typeof createTaskSchema>;
