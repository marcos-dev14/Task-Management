import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Cookies from "js-cookie"

export function Home() {
  const token = Cookies.get("user_token")

  const navigate = useNavigate()

  useEffect(() => {
    if (!token) {
      navigate("/sign-in", { replace: true })
    }
  },[token])

  return (
    <div className="w-full h-screen flex items-center justify-center">
      <h1>Home</h1>
    </div>
  )
}