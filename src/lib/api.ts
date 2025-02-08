import { Task } from '@/types/kanban';
import { useAuthStore } from '@/store/authStore';

export const api = {
  getTasks: async (): Promise<Task[]> => {
    const userId = useAuthStore.getState().userId;
    const response = await fetch(`/api/tasks?userId=${userId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch tasks');
    }
    const data = await response.json();
    return data.tasks;
  },
  syncAuth: async (userId: string, isNewUser: boolean) => {
    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, isNewUser }),
      });

      if (!response.ok) {
        throw new Error('Failed to sync auth');
      }

      const data = await response.json();
      return data.user;
    } catch (error) {
      console.error('Error syncing auth:', error);
      throw error;
    }
  },
}; 