import { useForm, Controller } from "react-hook-form"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"

import { createTask } from "@/api/task"

import { createTaskSchema } from "@/schemas/create-task"
import { formatSendDate } from "@/utils/format-date"

import { Button } from "./ui/button"
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Textarea } from "./ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { useUser } from "@/context/user"

type CreateTaskForm = z.infer<typeof createTaskSchema>

export function CreateTaskForm() {
  const { setOpenModal } = useUser()

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors },
  } = useForm<CreateTaskForm>({
    resolver: zodResolver(createTaskSchema),
  })

  const queryClient = useQueryClient()

  const { mutateAsync: createTaskFc } = useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      toast.success("Tarefa criada com sucesso!")
      queryClient.invalidateQueries(['tasks'])

      reset()
      setOpenModal(false)
    },
    onError: () => toast.error("Erro ao criar a tarefa"),
  })

  async function handleCreateTaskForm(data: CreateTaskForm) {
    try {
      const formattingData = {
        title: data.title,
        description: data.description,
        date: formatSendDate(data.date),
        status: data.status,
      }

      createTaskFc(formattingData)
    } catch (error) {
      console.error("Erro ao criar tarefa:", error)
    }
  }

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>
          Criar Nova Tarefa
        </DialogTitle>

        <DialogDescription>
          Adicione uma nova tarefa para organizar seu dia.
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit(handleCreateTaskForm)} className="w-full flex flex-col gap-6 mt-6">
        <div className="space-y-2">
          <Label htmlFor="title">Titulo da tarefa</Label>

          <Input 
            id="title" 
            type="text" 
            {...register("title")}
            className={errors.title && 'border-red-400'}
          />

          {errors.title && (
            <p className="text-sm text-red-500">{errors.title.message}</p>
          )}
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
            id="date" 
            type="datetime-local" 
            {...register("date")}
            className={errors.title ? 'border-red-400 w-[200px] max-md:w-auto' : 'w-[200px] max-md:w-auto'}
          />

          {errors.date && (
            <p className="text-sm text-red-500">{errors.date.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status da tarefa</Label>

          <Controller 
            name="status"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger data-testid="status-select" className="w-full h-12">
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
        
        <Button 
          type="submit" 
          disabled={isSubmitting} 
          className="mt-6 font-heading font-semibold"
          data-testid="submit-button"
        >
          Criar tarefa
        </Button>
      </form>
    </DialogContent>
  )
}