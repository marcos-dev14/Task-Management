import { ToggleTheme } from "./components/toggle-theme"
import "./styles/global.css"

export function App() {
  return (
    <div className="w-full h-screen bg-background flex items-center justify-center">

      <h1 className="font-sans font-bold text-2xl text-primary">
        Marcos Paulo
      </h1>

      <ToggleTheme />
    </div>
  )
}
