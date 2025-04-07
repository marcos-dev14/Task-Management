import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import Cookies from "js-cookie"

interface UserProps {
  token: string | null
}

interface UserContextType {
  user: UserProps | null
  setUser: (user: UserProps | null) => void
  loginUser: (token: string) => void
  removeCookie: () => void
  openModal: boolean
  setOpenModal: (openModal: boolean) => void
}

interface UserProviderProps {
  children: ReactNode;
}

const UserContext = createContext<UserContextType>({} as UserContextType)

export function UserProvider({ children }: UserProviderProps) {
  const [user, setUser] = useState<UserProps | null>(null)
  const [openModal, setOpenModal] = useState(false)

  function loginUser(token: string) {
    const expirationDate = new Date();
    expirationDate.setTime(expirationDate.getTime() + 2 * 60 * 60 * 1000) // 2 horas

    Cookies.set("user_token", token, { expires: expirationDate }) // Expira em 2 horas
    setUser({ token })
  }

  function removeCookie() {
    Cookies.remove("user_token")
    setUser(null)
  }

  useEffect(() => {
    const token = Cookies.get("user_token")
    if (token) {
      setUser({ token })
    }
  }, [])

  return (
    <UserContext.Provider value={{ 
      user, 
      setUser, 
      loginUser, 
      removeCookie,
      openModal,
      setOpenModal 
    }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext)
  
  return context
}
