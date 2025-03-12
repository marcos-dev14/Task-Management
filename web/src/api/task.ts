import { api } from "@/lib/axios"

export interface TaskResponse {
  id: string
  title: string
  description?: string
  date: string
  status: string
  updated_at: Date
}

export interface TaskBody {
  id?: string
  title: string
  description: string
  date: string
  status: string
  userToken?: string | null
}

export async function createTask(createTask: TaskBody) {
  try {
    const response = await api.post('/tasks', createTask)
  
    return response.data
  } catch (error) {
    console.error("Error: ", error)
    throw new Error("Erro ao cadastrar a tarefa")
  }
}

export async function getTasks(filter: string) {
  if (filter === "no_filter") {
    const response = await api.get<TaskResponse[]>('/tasks')

    return response.data
  } else {
    const response = await api.get<TaskResponse[]>(`/tasks?status=${filter}`)
  
    return response.data
  }
}

export async function getTask(taskId: string) {
  const response = await api.get<TaskResponse>(`/tasks/${taskId}`)

  return response.data
}

export async function updateTask({
  title,
  description,
  date,
  status,
  id = '',
 
}: TaskBody) {
  const data = {
    title,
    description,
    date,
    status,
  }

  const response = await api.put(`/tasks/${id}`, data)

  return response.data
}

export async function deleteTask(taskId: string) {
  await api.delete(`/tasks/${taskId}`)
}