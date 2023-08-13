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
    !!localStorage.getItem("authenticated")
  )

  const setAuthentication = (authenticated: boolean) => {
    if (authenticated) {
      localStorage.setItem("authenticated", "true")
    } else {
      localStorage.removeItem("authenticated")
    }
    setAuthenticated(authenticated)
  }

  return (
    <AuthContext.Provider value={{ authenticated, setAuthentication }}>
      {children}
    </AuthContext.Provider>
  )
}
