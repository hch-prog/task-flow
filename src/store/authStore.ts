import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import axios from 'axios'

interface AuthState {
  userId: string | null
  isAuthenticated: boolean
  initialize: () => Promise<void>
  validateAndSetUser: (userId: string) => Promise<void>
  createNewUser: () => Promise<void>
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      userId: null,
      isAuthenticated: false,

      initialize: async () => {
        try {
          const response = await axios.post('/api/auth/new');
          const { userId } = response.data;
          
          set({
            userId,
            isAuthenticated: true
          });
        } catch (error) {
          console.error('Failed to initialize new user:', error);
          throw error;
        }
      },

      validateAndSetUser: async (userId: string) => {
        try {
          const response = await axios.post('/api/auth/validate', { userId });
          const { isValid, user } = response.data;

          if (isValid) {
            set({
              userId: user.userId,
              isAuthenticated: true
            });
          } else {
            // If user is not valid, clear state and create new user
            set({ userId: null, isAuthenticated: false });
            await useAuthStore.getState().createNewUser();
          }
        } catch (error) {
          console.error('Failed to validate user:', error);
          throw error;
        }
      },

      createNewUser: async () => {
        try {
          const response = await axios.post('/api/auth/new');
          const { userId } = response.data;
          
          set({
            userId,
            isAuthenticated: true
          });
        } catch (error) {
          console.error('Failed to create new user:', error);
          throw error;
        }
      },

      logout: () => {
        set({
          userId: null,
          isAuthenticated: false,
        });
      }
    }),
    {
      name: 'auth-storage'
    }
  )
) 