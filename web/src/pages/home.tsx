import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Cookies from "js-cookie"
import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { TaskCard } from "@/components/task-card"

export function Home() {
  const token = Cookies.get("user_token")

  const navigate = useNavigate()

  useEffect(() => {
    if (!token) {
      navigate("/sign-in", { replace: true })
    }
  },[token])

  return (
    <div className="w-full h-screen flex items-start justify-center mx-auto py-20">
      <div className="max-w-[1240px] w-full h-full flex items-start">
        <div className="w-full max-h-screen h-full flex flex-col space-y-6 items-center px-4">
          <div className="w-full flex items-center justify-between">
            <h1 className="text-4xl text-primary font-bold font-heading">
              Suas tarefas
            </h1>

            <Button>
              Nova Tarefa

              <Plus className="w-4 h-4" />
            </Button>
          </div>

          <div className="max-w-[900px] w-full shadow bg-gray-200 px-3 py-6 rounded-sm space-y-4 s overflow-y-auto">
            <TaskCard />
          </div>
        </div>
      </div>
    </div>
  )
}