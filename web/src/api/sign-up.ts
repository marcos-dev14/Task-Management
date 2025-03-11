import { api } from "@/lib/axios"

export interface SignUpBody {
  name: string
  email: string
  password: string
}

export async function signUp(body: SignUpBody) {
  const response = await api.post('/auth/register', body)

  return response.data
}