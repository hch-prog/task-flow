import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { api } from '@/lib/api'

interface AuthState {
  userId: string | null
  isAuthenticated: boolean
  initialize: () => Promise<void>
  syncExistingUser: (userId: string) => Promise<void>
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      userId: null,
      isAuthenticated: false,
      initialize: async () => {

        try {
          //return await api.syncAuth('', true)
          const userData = await api.syncAuth('', true)
          set({
            userId: userData.userId,
            isAuthenticated: true
          })
          return userData.userId

        } catch (error) {
          console.error('Failed to sync new user with database:', error)
        }
      },
      syncExistingUser: async (userId: string) => {
        try {
          await api.syncAuth(userId, false)
          console.log('Existing user synced with database')
        } catch (error) {
          console.error('Failed to sync existing user with database:', error)
        }
      },
      logout: () => {
        set({
          userId: null,
          isAuthenticated: false,
        })
      }
    }),
    {
      name: 'auth-storage'
    }
  )
) 