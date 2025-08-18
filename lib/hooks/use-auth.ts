"use client"

import { useState, useEffect, useCallback } from "react"
import { HASURA_CONFIG, STORAGE_KEYS } from "../constants"
import type { AuthData } from "../types"

/**
 * Custom hook for managing authentication state
 * Handles login, signup, logout, and persistence via localStorage
 */
export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [authLoading, setAuthLoading] = useState(false)
  const [user, setUser] = useState<AuthData | null>(null)

  /**
   * Initialize authentication state from localStorage on mount
   */
  useEffect(() => {
    const storedAuth = localStorage.getItem(STORAGE_KEYS.CHAT_AUTH)
    if (storedAuth) {
      try {
        const authData: AuthData = JSON.parse(storedAuth)
        setUser(authData)
        setIsAuthenticated(true)
      } catch (error) {
        console.error("Failed to parse stored auth data:", error)
        localStorage.removeItem(STORAGE_KEYS.CHAT_AUTH)
      }
    }
  }, [])

  /**
   * Handles user login with email and password
   * Currently uses simple validation - in production, this would call an auth API
   *
   * @param email - User's email address
   * @param password - User's password
   * @returns Promise that resolves on successful login
   * @throws Error if login fails
   */
  const login = useCallback(async (email: string, password: string) => {
    setAuthLoading(true)

    try {
      if (!email || !password) {
        throw new Error("Please enter email and password")
      }

      // In production, this would validate against a real auth service
      const authData: AuthData = {
        email,
        userId: HASURA_CONFIG.USER_ID,
      }

      localStorage.setItem(STORAGE_KEYS.CHAT_AUTH, JSON.stringify(authData))
      setUser(authData)
      setIsAuthenticated(true)
    } catch (error) {
      console.error("Login error:", error)
      throw error
    } finally {
      setAuthLoading(false)
    }
  }, [])

  /**
   * Handles user signup with name, email, and password
   * Currently uses simple validation - in production, this would call an auth API
   *
   * @param name - User's full name
   * @param email - User's email address
   * @param password - User's password
   * @returns Promise that resolves on successful signup
   * @throws Error if signup fails
   */
  const signup = useCallback(async (name: string, email: string, password: string) => {
    setAuthLoading(true)

    try {
      if (!name || !email || !password) {
        throw new Error("Please fill in all fields")
      }

      // In production, this would create a new user account
      const authData: AuthData = {
        email,
        userId: HASURA_CONFIG.USER_ID,
        name,
      }

      localStorage.setItem(STORAGE_KEYS.CHAT_AUTH, JSON.stringify(authData))
      setUser(authData)
      setIsAuthenticated(true)
    } catch (error) {
      console.error("Signup error:", error)
      throw error
    } finally {
      setAuthLoading(false)
    }
  }, [])

  /**
   * Logs out the current user and clears all stored data
   */
  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEYS.CHAT_AUTH)
    setUser(null)
    setIsAuthenticated(false)
  }, [])

  return {
    // State
    isAuthenticated,
    authLoading,
    user,

    // Actions
    login,
    signup,
    logout,
  }
}
