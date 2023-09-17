import React, { createContext, useState, ReactNode } from "react"

interface AuthContextProps {
  authenticated: boolean
  setAuthentication: (authenticated: boolean) => void
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthContext = createContext<AuthContextProps>({
  authenticated: false,
  setAuthentication: () => {},
})

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authenticated, setAuthenticated] = useState<boolean>(
    !!localStorage.getItem("token")
  )

  const setAuthentication = (authenticated: boolean) => {
    setAuthenticated(authenticated)
  }

  return (
    <AuthContext.Provider value={{ authenticated, setAuthentication }}>
      {children}
    </AuthContext.Provider>
  )
}
