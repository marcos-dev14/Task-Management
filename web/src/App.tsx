import "./styles/global.css"

import { ThemeProvider } from "./context/theme"
import { RouterProvider } from 'react-router-dom'
import { router } from './routes/index.tsx'

export function App() {
  return (
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  )
}
