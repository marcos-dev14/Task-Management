import { describe, it, expect, vi } from "vitest"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { useMutation, useQuery } from "@tanstack/react-query"

import { UpdateTaskForm } from "@/components/update-task-form"
import { Dialog } from "@/components/ui/dialog"

vi.mock("@tanstack/react-query", () => ({
  useMutation: vi.fn(() => ({
    mutateAsync: vi.fn(),
  })),
  useQuery: vi.fn(),
  useQueryClient: vi.fn(() => ({ invalidateQueries: vi.fn() })),
}))


describe("UpdateTaskForm", () => {
  const taskData = {
    title: "Tarefa Antiga",
    description: "Descrição antiga da tarefa",
    date: "2025-03-12T10:00",
    status: "in_progress",
  }

  it("deve preencher o formulário com os dados da tarefa existente", async () => {
    useQuery.mockReturnValue({
      data: taskData,
    })

    render(
      <Dialog open>
        <UpdateTaskForm taskId="1" />
      </Dialog>
    )

    expect(screen.getByLabelText(/Titulo da tarefa/i).value).toBe(taskData.title)
    expect(screen.getByLabelText(/Descrição da tarefa/i).value).toBe(taskData.description)
    expect(screen.getByLabelText(/Data de inicio da tarefa/i).value).toBe(taskData.date)
  })

  it("deve permitir que o usuário edite e envie o formulário", async () => {
    const mockMutateAsync = vi.fn().mockResolvedValue(undefined)
  
    useMutation.mockReturnValue({
      mutateAsync: mockMutateAsync,
    })
  
    const taskData = {
      title: "Tarefa Antiga",
      description: "Descrição antiga da tarefa",
      date: "2025-03-12T10:00", 
      status: "in_progress", 
    }
  
    useQuery.mockReturnValue({
      data: taskData,
    });
  
    render(
      <Dialog open>
        <UpdateTaskForm taskId="1" />
      </Dialog>
    );
  
    fireEvent.change(screen.getByLabelText(/Titulo da tarefa/i), { target: { value: "Tarefa Atualizada" } })
    fireEvent.change(screen.getByLabelText(/Descrição da tarefa/i), { target: { value: "Descrição atualizada" } })
    fireEvent.change(screen.getByLabelText(/Data de inicio da tarefa/i), { target: { value: "2025-03-13T14:00" } })
    
  
    fireEvent.click(screen.getByTestId("submit-button"))
  
    await waitFor(() => expect(screen.getByTestId("submit-button")).toBeDisabled())
    await waitFor(() => expect(mockMutateAsync).toHaveBeenCalled())
  
    expect(mockMutateAsync).toHaveBeenCalledWith({
      id: "1",
      title: "Tarefa Atualizada",
      description: "Descrição atualizada",
      date: "2025-03-13T17:00:00.000Z", 
      status: "in_progress",
    })
  })

  it("deve lidar com erro ao editar a tarefa", async () => {
    const mockMutateAsync = vi.fn().mockRejectedValue(new Error("Erro ao editar tarefa"))

    useMutation.mockReturnValue({
      mutateAsync: mockMutateAsync,
    })

    render(
      <Dialog open>
        <UpdateTaskForm taskId="1" />
      </Dialog>
    );

    fireEvent.click(screen.getByTestId("submit-button"));

    await waitFor(() => {
      expect(screen.getByTestId("submit-button")).not.toBeDisabled();
    });
    await waitFor(() => expect(mockMutateAsync).toHaveBeenCalled());
  });
});
