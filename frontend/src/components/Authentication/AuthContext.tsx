import React, { createContext, useState, ReactNode } from "react"

interface AuthContextProps {
  authenticated: boolean
  token: string | null
  setAuthentication: (authenticated: boolean, token: string | null) => void
}
interface AuthProviderProps {
  children: ReactNode
}

export const AuthContext = createContext<AuthContextProps>({
  authenticated: false,
  token: null,
  setAuthentication: () => {},
})

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(false)
  const [token, setToken] = useState<string | null>(null)

  const setAuthentication = (authenticated: boolean, token: string | null) => {
    setAuthenticated(authenticated)
    setToken(token)
  }

  return (
    <AuthContext.Provider value={{ authenticated, token, setAuthentication }}>
      {children}
    </AuthContext.Provider>
  )
}
