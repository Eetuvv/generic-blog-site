import React, { createContext, useState, ReactNode } from "react"

interface AuthContextProps {
  authenticated: boolean
  login: () => void
  logout: () => void
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthContext = createContext<AuthContextProps>({
  authenticated: false,
  login: () => {},
  logout: () => {},
})

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(false)

  const login = () => {
    setAuthenticated(true)
  }

  const logout = () => {
    setAuthenticated(false)
  }

  return (
    <AuthContext.Provider value={{ authenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
