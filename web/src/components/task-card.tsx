import { Edit2, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { useMutation, useQueryClient } from "@tanstack/react-query"

import { useUser } from "@/context/user"

import { deleteTask } from "@/api/task"

import { formatDateTime } from "@/utils/format-date"

import { Button } from "./ui/button"
import { Dialog, DialogTrigger } from "./ui/dialog"
import { UpdateTaskForm } from "./update-task-form"

interface TaskCardProps {
  task: {
    id: string;
    title: string;
    description?: string;
    date: string;
    status: string;
    updated_at: Date;
  }
}

export function TaskCard({ task }: TaskCardProps) {
  const { openModal, setOpenModal } = useUser()

  const queryClient = useQueryClient()

  const { mutateAsync: deleteTaskFc } = useMutation({
    mutationFn: deleteTask,
    onSuccess: () => {
      toast.success("Tarefa excluída com sucesso!")

      queryClient.invalidateQueries(['tasks'])
    },
    onError: () => toast.error("Erro ao excluir a tarefa"),
  })

  async function handleDeleteTasks(taskId: string) {
    try {
      await deleteTaskFc(taskId)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="w-full border border-gray-500 rounded-sm p-3 space-y-6 md:h-auto">
      <div className="w-full flex items-center justify-between max-md:flex-col max-md:items-start gap-1">
        <span className="font-heading font-semibold text-lg text-gray-900">
          {task.title}
        </span>

        <div className="flex items-center gap-3 max-md:w-full justify-between">
          <span className="text-xs text-gray-600">
            Início: {formatDateTime(task.date)}
          </span>
        
          <div className="flex items-center gap-2">
            {task.status === "pending" && (
              <>
                <span className="text-xs text-gray-600">
                  Status: Pendente
                </span>

                <div className="w-4 h-4 rounded-full bg-gray-500" />
              </>
            )}

            {task.status === "in_progress" && (
              <>
                <span className="text-xs text-gray-600">
                  Status: Em andamento
                </span>

                <div className="w-4 h-4 rounded-full bg-blue-500" />
              </>
            )}

            {task.status === "completed" && (
              <>
                <span className="text-xs text-gray-600">
                  Status: Completo
                </span>

                <div className="w-4 h-4 rounded-full bg-green-500" />
              </>
            )}
          </div>
        </div>
      </div>

      <div className="w-full flex items-center justify-between gap-4">
        <p className="font-sans font-normal text-sm text-gray-600 md:text-xs">
          {task.description}
        </p>

        <div className="flex items-center gap-3">
          <Dialog open={openModal} onOpenChange={setOpenModal}>
            <DialogTrigger asChild>
              <Button className="w-10 h-10">
                <Edit2 className="w-4 h-4" />
              </Button>
            </DialogTrigger>

            <UpdateTaskForm taskId={task.id} />
          </Dialog>

          <Button className="w-10 h-10" onClick={() => handleDeleteTasks(task.id)}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}