import { Outlet } from "react-router-dom"
import { LogOut } from "lucide-react"

import { useUser } from "@/context/user"

import { Button } from "@/components/ui/button"
import { ToggleTheme } from "@/components/toggle-theme"

export function AppLayout() {
  const { removeCookie, user } = useUser()

  function handleLogout() {
    removeCookie()
    window.location.href = "/sign-in"
  }

  return (
    <main className="flex min-h-screen antialiased bg-background relative">
      {user?.token && (
        <div className="absolute top-6 right-24">
          <Button 
            variant="outline" 
            className="h-10"
            onClick={handleLogout}
          >
            Log out

            <LogOut />
          </Button>
        </div>
      )}

      <div className="absolute top-6 right-6">
        <ToggleTheme />
      </div>

      <Outlet />
    </main>
  )
}