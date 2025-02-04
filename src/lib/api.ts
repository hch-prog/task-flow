import { Task } from '@/types/kanban';

export const api = {
  getTasks: async (): Promise<Task[]> => {
    const response = await fetch('/api/tasks');
    const data = await response.json();
    return data.tasks;
  },

  createTask: async (task: Omit<Task, 'id'>): Promise<Task> => {
    const response = await fetch('/api/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(task),
    });
    const data = await response.json();
    return data.task;
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
        throw new Error('Auth sync failed')
      }
      
      const data = await response.json();
      return data.user;
    } catch (error) {
      console.error('Error syncing auth:', error);
      throw error;
    }
  },
}; 