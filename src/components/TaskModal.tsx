"use client";

import { useEffect, useRef } from "react";
import { Task, Status } from "@/types/kanban";
import { X } from "lucide-react";

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (task: Omit<Task, "id">) => void;
  initialData?: Task;
  mode: "add" | "edit";
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
  onSubmit,
  initialData,
  mode,
}: TaskModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);

    const task: Omit<Task, "id"> = {
      title: formData.get("title") as string,
      status: formData.get("status") as Status,
      ticket: formData.get("ticket") as string,
      tags:
        formData
          .get("tags")
          ?.toString()
          .split(",")
          .map((tag) => tag.trim()) || [],
      assignees:
        formData
          .get("assignees")
          ?.toString()
          .split(",")
          .map((a) => a.trim()) || [],
    };

    onSubmit(task);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="z-50 fixed inset-0 flex justify-center items-center bg-black/60">
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
              className="border-gray-300 hover:bg-gray-50 px-4 py-2.5 border rounded-lg font-medium text-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-gray-700 hover:bg-gray-900 px-4 py-2.5 rounded-lg font-medium text-white transition-colors"
            >
              {mode === "add" ? "Create Task" : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
