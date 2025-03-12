import { z } from "zod"

export const signInForm = z.object({
  email: z
    .string()
    .email('Digite um e-mail valido')
    .nonempty('O e-mail é obrigatório.'),

  password: z
    .string()
    .min(6, 'A senha deve ter pelo menos 6 caracteres.')
    .max(20)
    .nonempty('A senha é obrigatória.'),
})