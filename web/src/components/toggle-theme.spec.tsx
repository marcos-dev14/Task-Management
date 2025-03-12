import { describe, it, expect, vi } from "vitest"
import { screen, render, fireEvent } from "@testing-library/react"


import { useTheme } from "@/context/theme"

import { ToggleTheme } from "@/components/toggle-theme"


vi.mock('../context/theme', () => ({
  useTheme: vi.fn(),
}))

describe("ToggleTheme Component", () => {
  it("deve renderizar o ícone correto de acordo com o tema", () => {
    useTheme.mockReturnValue({ theme: "dark", toggleTheme: vi.fn() });
    render(<ToggleTheme />)

    expect(screen.getByRole("button")).toContainElement(screen.getByTestId("sun-icon"))
  })

  it("deve chamar toggleTheme ao clicar no botão", () => {
    const toggleThemeMock = vi.fn()

    useTheme.mockReturnValue({ theme: "light", toggleTheme: toggleThemeMock });

    render(<ToggleTheme />)

    fireEvent.click(screen.getByRole("button"))
    expect(toggleThemeMock).toHaveBeenCalled()
  })
})
