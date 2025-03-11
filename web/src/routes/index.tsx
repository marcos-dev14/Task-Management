import { createBrowserRouter } from 'react-router-dom'
import { Home } from '../pages/home'
import { SignIn } from '../pages/auth/sign-in'
import { SignUp } from '../pages/auth/sign-up'
import { AppLayout } from '../pages/_layout'
import { NotFound } from '../pages/404'

export const router = createBrowserRouter([
  { 
    path: "/", 
    element: <AppLayout />,
    children: [
      { path: '/', element: <Home /> },
    ],
  },
  { 
    path: "/", 
    element: <AppLayout />,
    children: [
      { path: '/sign-in', element: <SignIn /> },
      { path: '/sign-up', element: <SignUp /> },
    ],
  },
  {
    path: '/*',
    element: <NotFound />,
  }
])