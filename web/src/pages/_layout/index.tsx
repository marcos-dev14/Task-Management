import { Outlet } from "react-router-dom";
import { ToggleTheme } from "../../components/toggle-theme";

export function AppLayout() {
  return (
    <main className="flex min-h-screen antialiased bg-background relative">
      <div className="absolute top-6 right-6">
        <ToggleTheme />
      </div>

      <Outlet />
    </main>
  )
}