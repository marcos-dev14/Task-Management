import { describe, it, expect, vi } from "vitest"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { useMutation } from "@tanstack/react-query"

import { CreateTaskForm } from "@/components/create-task-form"
import { Dialog } from "@/components/ui/dialog"

vi.mock("@tanstack/react-query", () => {
  const mockMutation = vi.fn()
  return {
    useMutation: vi.fn((options) => ({
      mutateAsync: mockMutation.mockImplementation(async (...args) => {
        try {
          await options.mutationFn(...args);
          options.onSuccess();
        } catch (error) {
          options.onError();
          throw error;
        }
      }),
    })),
    useQueryClient: vi.fn(() => ({ invalidateQueries: vi.fn() })),
  }
})

describe("CreateTaskForm Component", () => {
  it("deve permitir que o usuário preencha e envie o formulário", async () => {
    render(
      <Dialog open>
        <CreateTaskForm />
      </Dialog>
    )

    fireEvent.change(screen.getByLabelText(/Titulo da tarefa/i), { target: { value: "Nova tarefa" } })
    fireEvent.change(screen.getByLabelText(/Descrição da tarefa/i), { target: { value: "Descrição da nova tarefa" } })
    fireEvent.change(screen.getByLabelText(/Data de inicio da tarefa/i), { target: { value: "2025-03-12T10:00" } })
    fireEvent.mouseDown(screen.getByTestId("status-select"))
    fireEvent.click(screen.getByText(/Pendente/i))

    fireEvent.click(screen.getByTestId("submit-button"))

    await waitFor(() => {
      expect(screen.getByTestId("submit-button")).toBeDisabled()
    })
  })

  it("deve lidar com erro na criação da tarefa", async () => {
    vi.mocked(useMutation).mockReturnValue({
      mutateAsync: vi.fn().mockRejectedValue(new Error("Erro")),
    })

    render(
      <Dialog open>
        <CreateTaskForm />
      </Dialog>
    )
    
    fireEvent.click(screen.getByTestId("submit-button"))
    
    await waitFor(() => {
      expect(screen.getByTestId("submit-button")).not.toBeDisabled()
    })
  })
})
