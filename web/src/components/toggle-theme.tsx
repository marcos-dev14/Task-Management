import { Moon, Sun } from "lucide-react"

import { useTheme } from "../context/theme"

import { Button } from "./ui/button"

export function ToggleTheme() {
  const { theme, toggleTheme } = useTheme()

  return (
    <Button 
      variant="outline" 
      size="icon"
      onClick={toggleTheme}
    >
      {
        theme === "dark"
          ? <Sun className="w-5 h-5" />
          : <Moon className="w-5 h-5" />
      }
    </Button>
  )
}