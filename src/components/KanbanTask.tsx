"use client";

import { Draggable } from "@hello-pangea/dnd";
import { Task } from "@/types/kanban";

interface KanbanTaskProps {
  task: Task;
  index: number;
}

export function KanbanTask({ task, index }: Readonly<KanbanTaskProps>) {
  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`bg-white p-4 rounded-xl border border-[#E4E7EC] mb-3
            ${snapshot.isDragging 
              ? "shadow-lg ring-1 ring-[#E4E7EC]" 
              : "shadow-task hover:shadow-md transition-shadow duration-200"}`}
        >
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
  );
}
