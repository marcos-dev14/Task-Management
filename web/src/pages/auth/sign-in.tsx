import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useMutation } from "@tanstack/react-query"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "sonner"
import Cookies from "js-cookie"

import { useUser } from "@/context/user"

import { signIn } from "@/api/sign-in"
import type { signInForm } from "@/schemas/sign-in"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type SignInForm = z.infer<typeof signInForm>

export function SignIn() {
  const { loginUser } = useUser()

  const navigate = useNavigate()

  const token = Cookies.get("user_token")

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<SignInForm>()

  const { mutateAsync: LoginUser } = useMutation({
    mutationFn: signIn,
    onSuccess: async (data) => {
      toast.success('Login realizado com sucesso!')

      loginUser(data.access_token,)
      navigate("/") 
    },
    onError: (error) => {
      toast.error('Ocorreu um erro ao realizar o login')
      console.log(error)
    }
  })

  async function handleSingIn(data: SignInForm) {
    try {
      LoginUser({
        email: data.email,
        password: data.password
      })

    } catch (error) {
      toast.error('Credenciais inválidas')
      console.log(error)
    }
  }

  useEffect(() => {
    if (token) {
      navigate("/", { replace: true })
    }
  },[token])

  return (
    <div className="w-full h-screen flex items-center justify-center lg: px-4">
      <div className="max-w-[740px] w-full flex flex-col px-4 py-8 rounded-xl border border-accent">
        <h3 className="text-2xl text-primary font-bold font-heading">
          Faça seu login
        </h3>

        <p className="text-sm text-primary font-sans my-5">
          Digite eu e-mail e senha para fazer o login
        </p>

        <form onSubmit={handleSubmit(handleSingIn)} className="w-full flex flex-col gap-4 mt-6">
          <div className="space-y-2">
            <Label htmlFor="email">Seu e-mail</Label>

            <Input 
              id="email" 
              placeholder="Digite seu e-mail" 
              type="email" 
              {...register("email")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Sua senha</Label>

            <Input 
              id="password" 
              placeholder="Digite sua senha" 
              type="password" 
              {...register("password")}
            />
          </div>
          
          <Button type="submit" disabled={isSubmitting} className="mt-6 font-heading font-semibold text-lg">
            Entrar
          </Button>

          <p className="text-sm text-center mt-4">
            Ainda não possui uma conta?{' '} 
            <Link to="/sign-up" className="text-primary font-heading font-semibold">
              Crie uma agora
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}