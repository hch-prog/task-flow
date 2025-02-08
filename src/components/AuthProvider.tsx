'use client'

import { useEffect, useState } from 'react'
import { useAuthStore } from '@/store/authStore'
import { LoadingScreen } from './LoadingScreen'
import { toast } from 'react-hot-toast'

export function AuthProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  const {validateAndSetUser, createNewUser } = useAuthStore()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Check localStorage for existing auth data
        const authData = localStorage.getItem('auth-storage')

        if (!authData) {
          // No existing auth - create new user
          await createNewUser()
          toast.success('Welcome to TaskFlow!')
        } else {
          // Parse stored auth data
          const parsedData = JSON.parse(authData)
          const storedUserId = parsedData?.state?.userId

          if (!storedUserId) {
            // Invalid stored data - create new user
            localStorage.removeItem('auth-storage')
            await createNewUser()
            toast.success('Welcome to TaskFlow!')
          } else {
            // Validate existing user
            await validateAndSetUser(storedUserId)
            toast.success('Welcome back!')
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error)
        toast.error('Something went wrong. Please refresh the page.')
      } finally {
        setIsLoading(false)
      }
    }

    initializeAuth()
  }, [createNewUser, validateAndSetUser])

  if (isLoading) {
    return <LoadingScreen />
  }

  return <>{children}</>
} 