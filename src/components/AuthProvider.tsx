'use client'

import { useEffect, useState } from 'react'
import { useAuthStore } from '@/store/authStore'
import { LoadingScreen } from './LoadingScreen'

export function AuthProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  const { userId, isAuthenticated, initialize, syncExistingUser } = useAuthStore()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const handleAuth = async () => {
      try {
        if (!isAuthenticated) {
          if (userId) {
         
            await syncExistingUser(userId)
          } else {
            
            await initialize()
          }
        }
      } catch (error) {
        console.error('Auth handling error:', error)
      } finally {
        setIsLoading(false)
      }
    }

    handleAuth()
  }, [isAuthenticated, userId, initialize, syncExistingUser])

  if (isLoading) {
    return <LoadingScreen />
  }

  return <>{children}</>
} 