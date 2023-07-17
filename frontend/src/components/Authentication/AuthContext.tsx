import React, { createContext, useState, useEffect, ReactNode } from "react"

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
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  )
  const [authenticated, setAuthenticated] = useState<boolean>(!!token)

  useEffect(() => {
    const localToken = localStorage.getItem("token")
    if (localToken) {
      setToken(localToken)
      setAuthenticated(true)
    }
  }, [])

  const setAuthentication = (authenticated: boolean, token: string | null) => {
    if (authenticated && token) {
      localStorage.setItem("token", token)
    } else {
      localStorage.removeItem("token")
    }
    setAuthenticated(authenticated)
    setToken(token)
  }

  return (
    <AuthContext.Provider value={{ authenticated, token, setAuthentication }}>
      {children}
    </AuthContext.Provider>
  )
}
