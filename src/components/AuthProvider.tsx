'use client'

import { useEffect, useState } from 'react'
import { useAuthStore } from '@/store/authStore'
import { LoadingScreen } from './LoadingScreen'

export function AuthProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  const { isAuthenticated, initialize, syncExistingUser } = useAuthStore()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const handleAuth = async () => {
      try {
        const authData = localStorage.getItem('auth-storage')

        if (!authData) {
          const data = await initialize()

          const authStorageData = {
            state: {
              userId: data,
              isAuthenticated: true
            }
          }


          localStorage.setItem('auth-storage', JSON.stringify(authStorageData))
          console.log('new user', data);
          return
        } else {
          const parsedData = JSON.parse(authData);

          if (parsedData?.state?.userId) {
            console.log('userId', parsedData.state.userId)
            const data = await syncExistingUser(parsedData.state.userId)

            console.log('existing user', data)
          }
        }
      } catch (error) {
        console.error('Auth handling error:', error)
      } finally {
        setIsLoading(false)
      }
    }

    handleAuth()
  }, [isAuthenticated, initialize, syncExistingUser])

  if (isLoading) {
    return <LoadingScreen />
  }

  return <>{children}</>
} 