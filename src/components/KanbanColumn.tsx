'use client'

import { Droppable } from '@hello-pangea/dnd'
import { Task as TaskType, Status } from '@/types/kanban'
import { KanbanTask } from './KanbanTask'

interface KanbanColumnProps {
  id: Status
  title: string
  tasks: TaskType[]
}

export function KanbanColumn({ id, title, tasks }: Readonly<KanbanColumnProps>) {
  return (
    <div className="min-w-[320px]">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-medium text-[#344054]">{title}</h2>
        <span className="bg-[#F2F4F7] px-2.5 py-0.5 rounded-full font-medium text-[#475467] text-xs">
          {tasks.length}
        </span>
      </div>
      <Droppable droppableId={id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            data-column-id={id}
            className={`min-h-[calc(100vh-220px)] rounded-lg p-2 transition-colors
              ${snapshot.isDraggingOver ? 'bg-[#F9FAFB] ring-2 ring-gray-200' : ''}`}
          >
            {tasks.map((task, index) => (
              <KanbanTask key={task.id} task={task} index={index} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  )
} 