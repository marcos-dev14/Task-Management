import "./styles/global.css"

import { RouterProvider } from "react-router-dom"
import { QueryClientProvider } from "@tanstack/react-query"
import { Toaster } from "sonner"

import { UserProvider } from "@/context/user.tsx"
import { ThemeProvider } from "@/context/theme"
import { router } from "@/routes/index.tsx"
import { queryClient } from "@/lib/react-query.ts"

export function App() {
  return (
    <ThemeProvider>
      <UserProvider>
        <QueryClientProvider client={queryClient}>

          <Toaster richColors />
          <RouterProvider router={router} />
        </QueryClientProvider>
      </UserProvider>
    </ThemeProvider>
  )
}
