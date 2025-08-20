"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Github, Mail, Eye, EyeOff, CheckCircle, X } from "lucide-react"
import { useSignInEmailPassword, useSignUpEmailPassword, useNhostClient } from "@nhost/react"

// Types
interface AuthFormProps {
  onSuccess?: () => void
}

interface FormData {
  email: string
  password: string
  name?: string
}

export function AuthForm({ onSuccess }: AuthFormProps) {
  const [isSignUp, setIsSignUp] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
    name: ""
  })
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  // Password strength validation
  const passwordRequirements = {
    minLength: formData.password.length >= 8,
    hasUppercase: /[A-Z]/.test(formData.password),
    hasLowercase: /[a-z]/.test(formData.password),
    hasDigit: /\d/.test(formData.password),
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(formData.password)
  }

  const isPasswordValid = Object.values(passwordRequirements).every(Boolean)

  // NHost authentication hooks
  const { signInEmailPassword, isLoading: signInLoading, error: signInError } = useSignInEmailPassword()
  const { signUpEmailPassword, isLoading: signUpLoading, error: signUpError } = useSignUpEmailPassword()
  const nhost = useNhostClient()

  const hookIsLoading = signInLoading || signUpLoading
  const hookError = signInError || signUpError

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      setError('Please fill in all required fields')
      return false
    }
    if (isSignUp && !isPasswordValid) {
      setError('Please ensure your password meets all requirements')
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return
    setIsLoading(true)
    setError(null)
    setSuccessMessage(null)
    
    try {
      if (isSignUp) {
        const result = await signUpEmailPassword(formData.email, formData.password, {
          displayName: formData.name
        })
        
        if (result.isSuccess) {
          setShowSuccessModal(true)
          // Reset form
          setFormData({ email: "", password: "", name: "" })
          setIsSignUp(false)
        }
      } else {
        // Login mode - using the new implementation from your snippet
        const { session, error: authError } = await nhost.auth.signIn({
          email: formData.email,
          password: formData.password
        })
        
        // Custom error for user not found
        if (authError && authError.message.toLowerCase().includes('user not found')) {
          setError('User does not exist')
          return
        }
        if (authError) throw new Error(authError.message)
        
        if (session && onSuccess) {
          onSuccess()
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    try {
      const { providerUrl } = await nhost.auth.signIn({
        provider: 'google'
      })
      if (providerUrl) {
        window.location.href = providerUrl
      }
    } catch (error) {
      console.error("Google OAuth error:", error)
    }
  }

  const handleGitHubSignIn = async () => {
    try {
      const { providerUrl } = await nhost.auth.signIn({
        provider: 'github'
      })
      if (providerUrl) {
        window.location.href = providerUrl
      }
    } catch (error) {
      console.error("GitHub OAuth error:", error)
    }
  }

  // Use either custom loading state or hook loading state
  const currentIsLoading = isLoading || hookIsLoading
  // Use custom error or hook error
  const currentError = error || hookError?.message

  return (
    <>
      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-background/95 backdrop-blur-md border rounded-lg p-6 max-w-md mx-4 shadow-lg relative z-60">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-lg font-semibold">Account Created!</h3>
              </div>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setShowSuccessModal(false)}
                className="h-8 w-8"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="space-y-3">
              <p className="text-muted-foreground">
                Your account has been created successfully! Please check your email to verify your account before signing in.
              </p>
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md p-3">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  💡 <strong>Tip:</strong> Don't forget to check your spam folder if you don't see the verification email.
                </p>
              </div>
            </div>
            <div className="flex justify-end mt-6">
              <Button onClick={() => setShowSuccessModal(false)} className="px-6">
                Got it!
              </Button>
            </div>
          </div>
        </div>
      )}

      <Card className="w-full max-w-md backdrop-blur-lg bg-background/90 border border-border/50 shadow-2xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            {isSignUp ? "Create your account" : "Welcome back"}
          </CardTitle>
          <CardDescription className="text-center">
            {isSignUp 
              ? "Enter your details to create your account" 
              : "Enter your credentials to access your account"
            }
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* OAuth Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <Button 
              variant="outline" 
              onClick={handleGoogleSignIn}
              disabled={currentIsLoading}
              className="w-full"
            >
              <Mail className="mr-2 h-4 w-4" />
              Google
            </Button>
            <Button 
              variant="outline" 
              onClick={handleGitHubSignIn}
              disabled={currentIsLoading}
              className="w-full"
            >
              <Github className="mr-2 h-4 w-4" />
              GitHub
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          {/* Email/Password Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Full name
                </label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  required={isSignUp}
                  disabled={currentIsLoading}
                />
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                required
                disabled={currentIsLoading}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Password
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  required
                  disabled={currentIsLoading}
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={currentIsLoading}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
              
              {/* Password Requirements (only show during signup) */}
              {isSignUp && formData.password && (
                <div className="space-y-1 text-xs">
                  <p className="text-muted-foreground">Password must contain:</p>
                  <div className="grid grid-cols-2 gap-1">
                    <div className={`flex items-center gap-1 ${passwordRequirements.minLength ? 'text-green-600' : 'text-red-500'}`}>
                      {passwordRequirements.minLength ? '✓' : '✗'} 8+ characters
                    </div>
                    <div className={`flex items-center gap-1 ${passwordRequirements.hasUppercase ? 'text-green-600' : 'text-red-500'}`}>
                      {passwordRequirements.hasUppercase ? '✓' : '✗'} Uppercase letter
                    </div>
                    <div className={`flex items-center gap-1 ${passwordRequirements.hasLowercase ? 'text-green-600' : 'text-red-500'}`}>
                      {passwordRequirements.hasLowercase ? '✓' : '✗'} Lowercase letter
                    </div>
                    <div className={`flex items-center gap-1 ${passwordRequirements.hasDigit ? 'text-green-600' : 'text-red-500'}`}>
                      {passwordRequirements.hasDigit ? '✓' : '✗'} Number
                    </div>
                    <div className={`flex items-center gap-1 ${passwordRequirements.hasSpecialChar ? 'text-green-600' : 'text-red-500'}`}>
                      {passwordRequirements.hasSpecialChar ? '✓' : '✗'} Special character
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Success Message Display */}
            {successMessage && (
              <div className="text-sm text-green-600 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md p-3">
                {successMessage}
              </div>
            )}

            {/* Error Display */}
            {currentError && (
              <div className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-3">
                {currentError}
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={currentIsLoading || (isSignUp && !isPasswordValid)}
            >
              {currentIsLoading 
                ? (isSignUp ? "Creating account..." : "Signing in...") 
                : (isSignUp ? "Create account" : "Sign in")
              }
            </Button>
          </form>

          <div className="text-center">
            <Button
              variant="link"
              onClick={() => setIsSignUp(!isSignUp)}
              disabled={currentIsLoading}
              className="text-sm"
            >
              {isSignUp 
                ? "Already have an account? Sign in" 
                : "Don't have an account? Sign up"
              }
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  )
}