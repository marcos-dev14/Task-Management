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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function Home() {
  const [status, setStatus] = useState("no_filter");
  const [createTaskOpen, setCreateTaskOpen] = useState(false)

  const token = Cookies.get("user_token")

  const navigate = useNavigate()

  const { data: tasks } = useQuery({
    queryKey: ['tasks', status],
    queryFn: () => getTasks(status)
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
          <div className="w-full flex items-start justify-between max-md:flex-col">
            <h1 className="text-4xl text-primary font-bold font-heading max-md:text-2xl">
              Suas tarefas
            </h1>

            <div className="flex items-center justify-center gap-2">
              <div className="flex flex-col gap-2">
                <p className="font-normal text-sm text-gray-600">
                  Filtra por status
                </p>

                <Select onValueChange={setStatus} defaultValue={status}>
                  <SelectTrigger className="w-[160px] h-12">
                    <SelectValue placeholder="Filtra por status" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="no_filter">Sem filtro</SelectItem>
                    <SelectItem value="pending">Pendente</SelectItem>
                    <SelectItem value="in_progress">Em andamento</SelectItem>
                    <SelectItem value="completed">Finalizada</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Dialog open={createTaskOpen} onOpenChange={setCreateTaskOpen}>
                <DialogTrigger asChild className="self-end">
                  <Button>
                    Nova Tarefa

                    <Plus className="w-4 h-4" />
                  </Button>
                </DialogTrigger>

                <CreateTaskForm />
              </Dialog>
            </div>
          </div>

          {tasks && tasks?.length >= 1 ? (
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