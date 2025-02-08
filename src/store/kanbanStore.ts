import { create } from "zustand";
import { Task, Status } from "@/types/kanban";
import { v4 as uuidv4 } from "uuid";

interface KanbanState {
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
  moveTask: (taskId: string, destination: Status) => void;
  reorderTasks: (
    sourceStatus: Status,
    sourceIndex: number,
    destinationStatus: Status,
    destinationIndex: number
  ) => void;
  addTask: (task: Omit<Task, "id">) => void;
  updateTask: (taskId: string, updates: Partial<Omit<Task, "id">>) => void;
  deleteTask: (taskId: string) => void;
}



export const useKanbanStore = create<KanbanState>((set) => ({
  tasks: [],
  setTasks: (tasks) => set({ tasks }),
  moveTask: (taskId: string, destination: Status) =>
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === taskId ? { ...task, status: destination } : task
      ),
    })),
  reorderTasks: (
    sourceStatus,
    sourceIndex,
    destinationStatus,
    destinationIndex
  ) =>
    set((state) => {
      const allTasks = [...state.tasks];
      const sourceTasks = allTasks.filter((task) => task.status === sourceStatus);
      const [movedTask] = sourceTasks.splice(sourceIndex, 1);
      
      if (!movedTask) return state;

      // Update the task's status
      movedTask.status = destinationStatus;

      // Remove the task from its original position
      const taskIndex = allTasks.findIndex((t) => t.id === movedTask.id);
      if (taskIndex !== -1) {
        allTasks.splice(taskIndex, 1);
      }

      // Find where to insert the task in its new status column
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
    }),
  addTask: (task) =>
    set((state) => ({
      tasks: [...state.tasks, { ...task, id: uuidv4() }],
    })),
  updateTask: (taskId, updates) =>
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === taskId ? { ...task, ...updates } : task
      ),
    })),
  deleteTask: (taskId) =>
    set((state) => ({
      tasks: state.tasks.filter((task) => task.id !== taskId),
    })),
}));
