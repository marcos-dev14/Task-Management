import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function SignIn() {
  return (
    <main className="w-full h-screen flex items-center justify-center lg: px-4">
      <div className="max-w-[740px] w-full flex flex-col px-4 py-8 rounded-xl border border-accent">
        <h3 className="text-2xl text-primary font-bold font-heading">
          Sign In
        </h3>

        <p className="text-sm text-primary font-sans my-5">
          Digite eu e-mail e senha para fazer o login
        </p>

        <form className="w-full flex flex-col gap-4 mt-6">
          <div className="space-y-2">
            <Label htmlFor="email">Seu e-mail</Label>

            <Input id="email" placeholder="Digite o seu e-mail" type="email" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Sua senha</Label>

            <Input id="password" placeholder="digite a sua senha" type="password" />
          </div>
          
          <Button className="mt-6 font-heading font-semibold text-lg">
            Entrar
          </Button>
        </form>
      </div>
    </main>
  )
}