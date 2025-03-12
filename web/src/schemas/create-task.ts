import { z } from "zod"

export const createTaskSchema = z.object({
  title: z.string().min(4).max(100),
  description: z.string().min(1).max(500),
  date: z.string(),
  status: z.string()
})