import { useEffect } from "react"
import { useForm, Controller } from "react-hook-form"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { z } from "zod"
import { toast } from "sonner"

import { getTask, updateTask } from "@/api/task"

import { formatSendDate } from "@/utils/format-date"
import { updateTaskSchema } from "@/schemas/update-task"

import { Button } from "./ui/button"
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Textarea } from "./ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"

type UpdateTaskForm = z.infer<typeof updateTaskSchema>

interface UpdateTaskFormProps {
  taskId: string;
}

export function UpdateTaskForm({ taskId }: UpdateTaskFormProps) {
  const queryClient = useQueryClient()

  const { data: task } = useQuery({
    queryKey: ['task', taskId],
    queryFn: () => getTask(taskId),
  })

  const { mutateAsync: updateTaskFc } = useMutation({
    mutationFn: updateTask,
    onSuccess: () => {
      toast.success("Tarefa editada com sucesso!")
      queryClient.invalidateQueries(['tasks'])

      reset();
    },
    onError: () => toast.error("Erro ao editar a tarefa"),
  })

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<UpdateTaskForm>({
    defaultValues: {
      title: "",
      description: "",
      date: "",
      status: "",
    },
  })


  async function handleUpdateTaskForm(data: UpdateTaskForm) {
    try {
      const formattingData = {
        id: taskId,
        title: data.title,
        description: data.description,
        date: formatSendDate(data.date),
        status: data.status,
      }

      updateTaskFc(formattingData)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    if (task) {
      reset({
        ...task,
        date: task.date.slice(0, 16), // Ajusta para o formato "YYYY-MM-DDTHH:MM"
      });
    }
  }, [task, reset]);

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>
          Editar Tarefa
        </DialogTitle>

        <DialogDescription>
          Edite as informações da tarefa para organizar seu dia.
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit(handleUpdateTaskForm)} className="w-full flex flex-col gap-6 mt-6">
        <div className="space-y-2">
          <Label htmlFor="title">Titulo da tarefa</Label>

          <Input 
            id="title" 
            type="text" 
            {...register("title")}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Descrição da tarefa</Label>

          <Textarea 
            id="description" 
            {...register("description")}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="date">Data de inicio da tarefa</Label>

          <Input 
            className="w-auto"
            id="date" 
            type="datetime-local" 
            {...register("date")}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status da tarefa</Label>

          <Controller 
            name="status"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger className="w-full h-12">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="pending">Pendente</SelectItem>
                  <SelectItem value="in_progress">Em andamento</SelectItem>
                  <SelectItem value="completed">Finalizada</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>
        
        <Button type="submit" disabled={isSubmitting} className="mt-6 font-heading font-semibold">
          Editar tarefa
        </Button>
      </form>
    </DialogContent>
  )
}