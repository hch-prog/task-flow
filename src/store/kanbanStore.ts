import { create } from "zustand";
import { Task, Status } from "@/types/kanban";
import axios from "axios";
import { toast } from "react-hot-toast";

interface KanbanState {
  tasks: Task[];
  isLoading: boolean;
  setTasks: (tasks: Task[]) => void;
  createTask: (task: Omit<Task, "id">, userId: string) => Promise<Task>;
  updateTask: (taskId: string, updates: Partial<Task>) => Promise<Task>;
  deleteTask: (taskId: string) => Promise<void>;
  reorderTasks: (
    sourceStatus: Status,
    sourceIndex: number,
    destinationStatus: Status,
    destinationIndex: number
  ) => void;
}

export const useKanbanStore = create<KanbanState>((set, get) => ({
  tasks: [],
  isLoading: false,
  
  setTasks: (tasks) => set({ tasks }),
  
  createTask: async (task, userId) => {
    try {
      const response = await axios.post('/api/tasks', { ...task, userId });
      const newTask = response.data.task;
      set((state) => ({ tasks: [...state.tasks, newTask] }));
      toast.success('Task created successfully');
      return newTask;
    } catch (error) {
      toast.error('Failed to create task');
      throw error;
    }
  },

  updateTask: async (taskId: string, updates: Partial<Task>) => {
    // Optimistic update
    const previousTasks = get().tasks;
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === taskId ? { ...task, ...updates } : task
      ),
    }));

    try {
      const response = await axios.put('/api/tasks', {
        id: taskId,
        ...updates,
      });
      
      if (!response.data.task) {
        throw new Error('Failed to update task');
      }

      // Update with server response
      set((state) => ({
        tasks: state.tasks.map((task) =>
          task.id === taskId ? response.data.task : task
        ),
      }));
      
      toast.success('Task updated successfully');
      return response.data.task;
    } catch (error) {
      // Rollback on error
      set({ tasks: previousTasks });
      toast.error('Failed to update task');
      throw error;
    }
  },

  deleteTask: async (taskId: string) => {
    // Optimistic delete
    const previousTasks = get().tasks;
    set((state) => ({
      tasks: state.tasks.filter((task) => task.id !== taskId),
    }));

    try {
      await axios.delete(`/api/tasks?id=${taskId}`);
      toast.success('Task deleted successfully');
    } catch (error) {
      // Rollback on error
      set({ tasks: previousTasks });
      toast.error('Failed to delete task');
      throw error;
    }
  },

  reorderTasks: async (sourceStatus, sourceIndex, destinationStatus, destinationIndex) => {
    const previousTasks = get().tasks;
    
    // Optimistic update
    set((state) => {
      const allTasks = [...state.tasks];
      const sourceTasks = allTasks.filter((task) => task.status === sourceStatus);
      const [movedTask] = sourceTasks.splice(sourceIndex, 1);
      
      if (!movedTask) return state;

      movedTask.status = destinationStatus;
      const taskIndex = allTasks.findIndex((t) => t.id === movedTask.id);
      
      if (taskIndex !== -1) {
        allTasks.splice(taskIndex, 1);
      }

      const destinationTasks = allTasks.filter((task) => task.status === destinationStatus);
      const insertIndex = destinationTasks.length >= destinationIndex 
        ? allTasks.indexOf(destinationTasks[destinationIndex])
        : allTasks.length;

      if (insertIndex === -1) {
        allTasks.push(movedTask);
      } else {
        allTasks.splice(insertIndex, 0, movedTask);
      }

      return { tasks: allTasks };
    });

    // Update the backend
    try {
      const movedTask = get().tasks.find(t => 
        t.status === destinationStatus && 
        get().tasks.filter(task => task.status === destinationStatus)
          .indexOf(t) === destinationIndex
      );

      if (movedTask) {
        await axios.put('/api/tasks', {
          id: movedTask.id,
          status: destinationStatus,
        });
      }
    } catch (error) {
      // Rollback on error
      set({ tasks: previousTasks });
      toast.error('Failed to update task position');
      console.error('Failed to update task position:', error);
    }
  },
}));
