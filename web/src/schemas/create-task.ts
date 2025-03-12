import { z } from "zod"

export const createTaskSchema = z.object({
  title: z
    .string()
    .min(4, { message: "O título deve ter pelo menos 4 caracteres." })
    .max(100, { message: "O título não pode ter mais de 100 caracteres." }),
  description: z.string(),
  date: z.string().min(1, { message: "A data é obrigatória." }),
  status: z.string(),
})