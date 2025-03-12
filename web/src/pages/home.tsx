import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import Cookies from "js-cookie"
import { useQuery } from "@tanstack/react-query"
import { Plus } from "lucide-react"

import { getTasks } from "@/api/task"

import { Button } from "@/components/ui/button"
import { TaskCard } from "@/components/task-card"
import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import { CreateTaskForm } from "@/components/create-task-form"

export function Home() {
  const [createTaskOpen, setCreateTaskOpen] = useState(false)

  const token = Cookies.get("user_token")

  const navigate = useNavigate()

  const { data: tasks } = useQuery({
    queryKey: ['tasks'],
    queryFn: getTasks
  })

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
            <h1 className="text-4xl text-primary font-bold font-heading max-md:text-2xl">
              Suas tarefas
            </h1>

            <Dialog open={createTaskOpen} onOpenChange={setCreateTaskOpen}>
              <DialogTrigger asChild>
                <Button>
                  Nova Tarefa

                  <Plus className="w-4 h-4" />
                </Button>
              </DialogTrigger>

              <CreateTaskForm />
            </Dialog>
          </div>

          {tasks ? (
            <div className="max-w-[700px] w-full shadow bg-gray-200 px-3 py-6 rounded-sm space-y-4 s overflow-y-auto">
              {tasks?.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}	
            </div>
          ) : (
            <div className="w-full h-full flex items-start justify-center mt-20">
              <p className="text-center font-semibold text-sm text-gray-600">
                Nenhuma tarefa cadastrada. Adicione uma agora!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}