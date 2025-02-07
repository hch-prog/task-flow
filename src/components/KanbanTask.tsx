"use client";

import { Draggable } from "@hello-pangea/dnd";
import { Task } from "@/types/kanban";
import { useState } from "react";
import { TaskModal } from "./TaskModal";
import { useKanbanStore } from "@/store/kanbanStore";
import { Pencil, Trash2 } from "lucide-react";

interface KanbanTaskProps {
  task: Task;
  index: number;
}

export function KanbanTask({ task, index }: Readonly<KanbanTaskProps>) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { updateTask, deleteTask } = useKanbanStore();
  const [showActions, setShowActions] = useState(false);

  // Ensure we have a valid draggableId
  const draggableId = task.id || `task-${index}`;

  return (
    <>
      <Draggable draggableId={draggableId} index={index}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className={`bg-white p-4 rounded-xl border border-[#E4E7EC] mb-3 relative group
              ${
                snapshot.isDragging
                  ? "shadow-lg ring-1 ring-[#E4E7EC]"
                  : "shadow-task hover:shadow-md transition-all duration-200"
              }`}
            onMouseEnter={() => setShowActions(true)}
            onMouseLeave={() => setShowActions(false)}
          >
            <div
              className={`absolute top-2 right-2 flex space-x-1 transition-opacity duration-200
              ${showActions ? "opacity-100" : "opacity-0"}`}
            >
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="hover:bg-gray-100 p-1.5 rounded-md text-gray-500 hover:text-gray-700 transition-colors duration-200"
                title="Edit task"
              >
                <Pencil size={14} />
              </button>
              <button
                onClick={() => {
                  if (
                    window.confirm("Are you sure you want to delete this task?")
                  ) {
                    deleteTask(task.id);
                  }
                }}
                className="hover:bg-red-50 p-1.5 rounded-md text-gray-500 hover:text-red-600 transition-colors duration-200"
                title="Delete task"
              >
                <Trash2 size={14} />
              </button>
            </div>
            <div className="space-y-3 mb-3">
              <div className="flex items-center space-x-2">
                {task.tags.slice(0, 1).map((tag) => (
                  <span key={tag} className="task-tag">
                    {tag}
                  </span>
                ))}
              </div>
              <h3 className="line-clamp-2 font-medium text-[#101828]">
                {task.title}
              </h3>
              <div className="ticket-number">{task.ticket}</div>
            </div>
            <div className="flex flex-wrap gap-2">
              {task.tags.slice(1).map((tag) => (
                <span key={tag} className="task-tag">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </Draggable>

      <TaskModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={(updates) => updateTask(task.id, updates)}
        initialData={task}
        mode="edit"
      />
    </>
  );
}
