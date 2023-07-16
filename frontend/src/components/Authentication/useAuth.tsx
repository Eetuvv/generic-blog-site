import { useContext } from "react"
import { AuthContext } from "./AuthContext"

interface AuthContextProps {
  authenticated: boolean
  login: () => void
  logout: () => void
}

export const useAuth = (): AuthContextProps => {
  return useContext(AuthContext)
}
