"use client";

import { useEffect, useRef, useState } from "react";
import { Task, Status } from "@/types/kanban";
import { X } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useKanbanStore } from "@/store/kanbanStore";

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "add" | "edit";
  initialData?: Task;
}

const statusOptions: Status[] = [
  "NOT_STARTED",
  "IN_PROGRESS",
  "REVIEW",
  "COMPLETED",
];

export function TaskModal({
  isOpen,
  onClose,
  mode,
  initialData,
}: TaskModalProps) {
  const { createTask, updateTask } = useKanbanStore();
  const { userId } = useAuthStore();
  const modalRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;
    
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.target as HTMLFormElement);
    const taskData: Omit<Task, "id"> = {
      title: formData.get("title") as string,
      status: formData.get("status") as Status,
      ticket: formData.get("ticket") as string,
      tags: formData.get("tags")?.toString().split(",").map((tag) => tag.trim()).filter(Boolean) || [],
      assignees: formData.get("assignees")?.toString().split(",").map((a) => a.trim()).filter(Boolean) || [],
    };

    try {
      if (mode === "add") {
        await createTask(taskData, userId);
      } else if (mode === "edit" && initialData) {
        await updateTask(initialData.id, taskData);
      }
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="z-50 fixed inset-0 flex justify-center items-center bg-black/60 text-black">
      <div
        ref={modalRef}
        className="relative bg-white shadow-2xl p-6 rounded-xl w-full max-w-md transform transition-all duration-200 scale-100"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-semibold text-gray-900 text-xl">
            {mode === "add" ? "Add New Task" : "Edit Task"}
          </h2>
          <button
            onClick={onClose}
            className="hover:bg-gray-100 p-1 rounded-full transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>
        {error && (
          <div className="bg-red-50 mb-4 p-3 rounded-lg text-red-600 text-sm">
            {error}
          </div>
        )}
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-1.5 font-medium text-gray-700 text-sm">
              Title
            </label>
            <input
              type="text"
              name="title"
              defaultValue={initialData?.title}
              className="border-gray-300 hover:border-gray-400 px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 w-full focus:outline-none placeholder:text-gray-400 transition-shadow"
              placeholder="Enter task title"
              required
            />
          </div>
          <div>
            <label className="block mb-1.5 font-medium text-gray-700 text-sm">
              Status
            </label>
            <select
              name="status"
              defaultValue={initialData?.status || "NOT_STARTED"}
              className="border-gray-300 hover:border-gray-400 px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 w-full focus:outline-none transition-shadow"
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status.replace("_", " ")}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-1.5 font-medium text-gray-700 text-sm">
              Ticket Number
            </label>
            <input
              type="text"
              name="ticket"
              defaultValue={initialData?.ticket}
              className="border-gray-300 hover:border-gray-400 px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 w-full focus:outline-none placeholder:text-gray-400 transition-shadow"
              placeholder="e.g., TICKET #123"
              required
            />
          </div>
          <div>
            <label className="block mb-1.5 font-medium text-gray-700 text-sm">
              Tags
            </label>
            <input
              type="text"
              name="tags"
              defaultValue={initialData?.tags.join(", ")}
              className="border-gray-300 hover:border-gray-400 px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 w-full focus:outline-none placeholder:text-gray-400 transition-shadow"
              placeholder="e.g., FRONTEND, UI, DESIGN"
            />
            <p className="mt-1 text-gray-500 text-xs">
              Separate tags with commas
            </p>
          </div>
          {/* <div>
            <label className="block mb-1.5 font-medium text-gray-700 text-sm">
              Assignees
            </label>
            <input
              type="text"
              name="assignees"
              defaultValue={initialData?.assignees.join(", ")}
              className="border-gray-300 hover:border-gray-400 px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 w-full focus:outline-none placeholder:text-gray-400 transition-shadow"
              placeholder="e.g., john@example.com, jane@example.com"
            />
            <p className="mt-1 text-gray-500 text-xs">
              Separate assignees with commas
            </p>
          </div> */}
          <div className="flex justify-end space-x-3 pt-5">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="border-gray-300 hover:bg-gray-50 disabled:opacity-50 px-4 py-2.5 border rounded-lg font-medium text-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center bg-gray-700 hover:bg-gray-900 disabled:opacity-50 px-4 py-2.5 rounded-lg font-medium text-white transition-colors"
            >
              {isSubmitting ? (
                <>
                  <span className="mr-2 animate-spin">⏳</span>
                  {mode === "add" ? "Creating..." : "Saving..."}
                </>
              ) : (
                mode === "add" ? "Create Task" : "Save Changes"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
