"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { User } from "@/types"

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (username: string, password: string) => void
  register: (username: string, password: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    // Check if user is logged in on page load
    const storedUser = localStorage.getItem("currentUser")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
      setIsAuthenticated(true)
    }
  }, [])

  const login = (username: string, password: string) => {
    const users = JSON.parse(localStorage.getItem("users") || "[]")
    const user = users.find((u: User) => u.username === username)

    if (!user) {
      throw new Error("Usuario no encontrado")
    }

    if (user.password !== password) {
      throw new Error("Contraseña incorrecta")
    }

    setUser(user)
    setIsAuthenticated(true)
    localStorage.setItem("currentUser", JSON.stringify(user))
  }

  const register = (username: string, password: string) => {
    const users = JSON.parse(localStorage.getItem("users") || "[]")

    if (users.some((u: User) => u.username === username)) {
      throw new Error("El nombre de usuario ya está en uso")
    }

    const newUser = { username, password }
    users.push(newUser)
    localStorage.setItem("users", JSON.stringify(users))

    setUser(newUser)
    setIsAuthenticated(true)
    localStorage.setItem("currentUser", JSON.stringify(newUser))
  }

  const logout = () => {
    setUser(null)
    setIsAuthenticated(false)
    localStorage.removeItem("currentUser")
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, register, logout }}>{children}</AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
