import { create } from "zustand";
import { Task, Status } from "@/types/kanban";
import { v4 as uuidv4 } from "uuid";

interface KanbanState {
  tasks: Task[];
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

const initialTasks: Task[] = [
  {
    id: "task-1",
    title: "Inbox Design",
    status: "NOT_STARTED",
    ticket: "TICKET #1",
    tags: ["DESIGN"],
    assignees: ["1"],
  },
  {
    id: "task-2",
    title: "Setup redux structure",
    status: "IN_PROGRESS",
    ticket: "TICKET #10",
    tags: ["FRONTEND"],
    assignees: ["1"],
  },
  {
    id: "task-3",
    title: "Project table API tests",
    status: "REVIEW",
    ticket: "TICKET #6",
    tags: ["BACKEND", "SECURITY"],
    assignees: ["1"],
  },
  {
    id: "task-4",
    title: "Public view links",
    status: "COMPLETED",
    ticket: "TICKET #7",
    tags: ["FRONTEND"],
    assignees: ["1"],
  },
  {
    id: "task-5",
    title: "Create login form UI",
    status: "NOT_STARTED",
    ticket: "TICKET #5",
    tags: ["UI", "DESIGN"],
    assignees: ["2"],
  },
  {
    id: "task-6",
    title: "Set up backend for auth",
    status: "IN_PROGRESS",
    ticket: "TICKET #12",
    tags: ["BACKEND", "SECURITY"],
    assignees: ["2"],
  },
  {
    id: "task-7",
    title: "Integrate payment gateway",
    status: "IN_PROGRESS",
    ticket: "TICKET #8",
    tags: ["PAYMENT", "BACKEND"],
    assignees: ["3"],
  },
  {
    id: "task-8",
    title: "Fix API endpoints",
    status: "REVIEW",
    ticket: "TICKET #9",
    tags: ["API", "BUG"],
    assignees: ["4"],
  },
  {
    id: "task-9",
    title: "Update front-end styles",
    status: "COMPLETED",
    ticket: "TICKET #15",
    tags: ["STYLES", "UI"],
    assignees: ["1"],
  },
  {
    id: "task-10",
    title: "Refactor user authentication logic",
    status: "NOT_STARTED",
    ticket: "TICKET #20",
    tags: ["BACKEND", "REFACTOR"],
    assignees: ["3"],
  },
  {
    id: "task-11",
    title: "Create dashboard charts",
    status: "IN_PROGRESS",
    ticket: "TICKET #14",
    tags: ["DASHBOARD", "UI"],
    assignees: ["2"],
  },
  {
    id: "task-12",
    title: "Set up automated tests",
    status: "REVIEW",
    ticket: "TICKET #22",
    tags: ["TESTING", "CI/CD"],
    assignees: ["4"],
  },
  {
    id: "task-13",
    title: "Implement SEO optimizations",
    status: "COMPLETED",
    ticket: "TICKET #19",
    tags: ["SEO", "WEB"],
    assignees: ["1"],
  },
  {
    id: "task-14",
    title: "Optimize database queries",
    status: "IN_PROGRESS",
    ticket: "TICKET #16",
    tags: ["DATABASE", "PERFORMANCE"],
    assignees: ["3"],
  },
  {
    id: "task-15",
    title: "Build user profile page",
    status: "NOT_STARTED",
    ticket: "TICKET #18",
    tags: ["UI", "FRONTEND"],
    assignees: ["2"],
  },
  {
    id: "task-16",
    title: "Fix broken links on the site",
    status: "COMPLETED",
    ticket: "TICKET #21",
    tags: ["BUG", "FRONTEND"],
    assignees: ["4"],
  },
];

export const useKanbanStore = create<KanbanState>((set) => ({
  tasks: initialTasks,
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
      const filteredTasks = state.tasks.filter(
        (task) => task.status === sourceStatus
      );
      const taskToMove = filteredTasks[sourceIndex];

      if (!taskToMove) return state;

      const newTasks = state.tasks.filter((task) => task.id !== taskToMove.id);
      const destinationTasks = newTasks.filter(
        (task) => task.status === destinationStatus
      );

      const updatedTask = { ...taskToMove, status: destinationStatus };
      destinationTasks.splice(destinationIndex, 0, updatedTask);

      return {
        tasks: [
          ...newTasks.filter((task) => task.status !== destinationStatus),
          ...destinationTasks,
        ],
      };
      
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
