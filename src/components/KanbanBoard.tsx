"use client";

import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import { useKanbanStore } from "@/store/kanbanStore";
import { Status } from "@/types/kanban";
import { KanbanColumn } from "./KanbanColumn";
import { useState } from "react";
import { TaskModal } from "./TaskModal";

const columns: { id: Status; title: string }[] = [
  { id: "NOT_STARTED", title: "Not Started" },
  { id: "IN_PROGRESS", title: "In Progress" },
  { id: "REVIEW", title: "Review" },
  { id: "COMPLETED", title: "Completed" },
];

export function KanbanBoard() {
  const { tasks, reorderTasks, addTask } = useKanbanStore();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleDragEnd = (result: DropResult) => {
    const { destination, source } = result;
    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    reorderTasks(
      source.droppableId as Status,
      source.index,
      destination.droppableId as Status,
      destination.index
    );
  };

  return (
    <div className="bg-[#f9fafb] min-h-screen">
      <div className="mx-auto px-8 py-10 max-w-[1600px]">
        <div className="flex justify-between items-center mb-10">
          <h1 className="font-semibold text-[#101828] text-xl">Task Flow</h1>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-gray-700 hover:bg-gray-900 shadow-md px-4 py-2 rounded-lg text-white transition-colors"
          >
            Add Task
          </button>
        </div>
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="gap-8 grid grid-cols-4">
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
        onSubmit={addTask}
        mode="add"
      />
    </div>
  );
}
