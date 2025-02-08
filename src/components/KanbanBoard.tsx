"use client";

import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import { useKanbanStore } from "@/store/kanbanStore";
import { useAuthStore } from "@/store/authStore";
import { Status } from "@/types/kanban";
import { KanbanColumn } from "./KanbanColumn";
import { useState, useEffect } from "react";
import { TaskModal } from "./TaskModal";
import { LoadingScreen } from "./LoadingScreen";
import { Plus } from "lucide-react";
import { api } from '@/lib/api';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const columns: { id: Status; title: string }[] = [
  { id: "NOT_STARTED", title: "Not Started" },
  { id: "IN_PROGRESS", title: "In Progress" },
  { id: "REVIEW", title: "Review" },
  { id: "COMPLETED", title: "Completed" },
];

export function KanbanBoard() {
  const { tasks, setTasks, reorderTasks } = useKanbanStore();
  const { userId, isAuthenticated } = useAuthStore();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const fetchTasks = async () => {
    try {
      const fetchedTasks = await api.getTasks();
      setTasks(fetchedTasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setError('Failed to load tasks. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && userId) {
      fetchTasks();
    }
  }, [isAuthenticated, userId]);

  const handleDragEnd = async (result: DropResult) => {
    setIsDragging(false);
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // Optimistically update the UI
    reorderTasks(
      source.droppableId as Status,
      source.index,
      destination.droppableId as Status,
      destination.index
    );

    // Update the backend
    try {
      const task = tasks.find(t => t.id === draggableId);
      if (!task) return;

      const newStatus = destination.droppableId;
      if (!newStatus) {
        throw new Error('Invalid destination status');
      }

      const updatedTask = {
        ...task,
        status: destination.droppableId as Status
      };

      const response = await axios.put(`/api/tasks/edit`, updatedTask);

      if (!response.data.task) {
        throw new Error('Failed to update task');
      }

      // Show success toast
      toast.success(`Task moved to ${destination.droppableId.replace('_', ' ').toLowerCase()}`);

    } catch (error) {
      console.error('Failed to update task status:', error);
      // Show error toast
      toast.error('Failed to update task. Changes will be reverted.');
      // Rollback the optimistic update by refetching tasks
      fetchTasks();
    }
  };

  const handleDragStart = () => {
    setIsDragging(true);
  };

  

  if (error) {
    return (
      <div className="flex justify-center items-center bg-[#f9fafb] min-h-screen">
        <div className="text-center">
          <p className="mb-4 text-red-600">{error}</p>
          <button
            onClick={() => {
              setError(null);
              fetchTasks();
            }}
            className="bg-gray-700 hover:bg-gray-900 px-4 py-2 rounded-lg text-white transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (isLoading || !isAuthenticated) {
    return <LoadingScreen />;
  }

  return (
    <div
      className={`bg-[#f9fafb] min-h-screen ${isDragging ? 'cursor-grabbing' : ''}`}
    >
      <div className="mx-auto px-8 py-10 max-w-[1600px]">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="mb-1 font-semibold text-[#101828] text-xl">
              Task Flow
            </h1>
            <p className="text-gray-500 text-sm">
              Workspace ID: {userId?.slice(0, 8)}
            </p>
          </div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-900 shadow-md px-4 py-2 rounded-lg text-white transition-colors"
          >
            <Plus size={18} />
            <span>Add Task</span>
          </button>
        </div>
        <DragDropContext onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
          <div className="gap-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            {columns.map((column) => (
              <KanbanColumn
                key={column.id}
                id={column.id}
                title={column.title}
                tasks={tasks.filter((task) => task.status === column.id)}
              />
            ))}
          </div>
        </DragDropContext>
      </div>

      <TaskModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        mode="add"
      />
    </div>
  );
}
