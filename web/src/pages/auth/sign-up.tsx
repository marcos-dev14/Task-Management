import { useForm } from "react-hook-form"
import { Link, useNavigate } from "react-router-dom"
import { useMutation } from "@tanstack/react-query"
import { z } from "zod"
import { toast } from "sonner"
import Cookies from "js-cookie"

import { signUp } from "@/api/sign-up"

import type { signUpForm } from "@/schemas/sign-up"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useEffect } from "react"

type SignUpForm = z.infer<typeof signUpForm>

export function SignUp() {
  const navigate = useNavigate()

  const token = Cookies.get("user_token")

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<SignUpForm>()

  const { mutateAsync: registerUser } = useMutation({
    mutationFn: signUp
  })

  async function handleSingUp(data: SignUpForm) {
    try {
      await registerUser({
        name: data.name,
        email: data.email,
        password: data.password
      })

      toast.success('Usuário registrado com sucesso')

      navigate("/sign-in")
    } catch (error) {
      toast.error("Erro ao cadastrar o usuário")

      console.error(error)
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
          Faça seu registro
        </h3>

        <p className="text-sm text-primary font-sans my-5">
          Preencha os dados para fazer o registro
        </p>

        <form onSubmit={handleSubmit(handleSingUp)} className="w-full flex flex-col gap-4 mt-6">
          <div className="space-y-2">
            <Label htmlFor="email">Seu nome</Label>

            <Input 
              id="name" 
              placeholder="Digite seu nome" 
              type="name" 
              {...register("name")}
            />
          </div>

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
              placeholder="digite sua senha" 
              type="password" 
              {...register("password")}
            />
          </div>
          
          <Button type="submit" disabled={isSubmitting} className="mt-6 font-heading font-semibold text-lg">
            Cadastrar
          </Button>

          <p className="text-sm text-center mt-4">
            Já possui uma conta?{' '} 
            <Link to="/sign-in" className="text-primary hover:text-primary-dark font-semibold">
              Faça login
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}