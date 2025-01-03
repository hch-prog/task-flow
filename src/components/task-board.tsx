'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Pencil, PencilIcon, Plus, Search, X } from "lucide-react" // Add this import
import { SearchBar } from "./searchBar";

interface Task {
  id: string
  title: string
  ticket: string
  project: string
  tags: string[]
  assignees: { image: string; name: string }[]
}

interface Column {
  title: string
  tasks: Task[]
}

const formSchema = z.object({
  title: z.string().min(1),
  ticket: z.string().min(1),
  project: z.string().min(1),
  tags: z.string(),
})

export default function TaskBoard() {
  const [columns, setColumns] = useState<Column[]>([
    {
      title: "Backlog",
      tasks: [
        {
          id: "1",
          title: "Create Project Roadmap",
          ticket: "TICKET #101",
          project: "AURORA",
          tags: ["PLANNING", "STRATEGY"],
          assignees: [
            { image: "/placeholder.svg", name: "Sophie" },
            { image: "/placeholder.svg", name: "Liam" },
          ],
        },
        {
          id: "2",
          title: "Design App Icon",
          ticket: "TICKET #102",
          project: "VEGA",
          tags: ["DESIGN", "BRANDING"],
          assignees: [{ image: "/placeholder.svg", name: "Maya" }],
        },
        {
          id: "3",
          title: "Develop Core API",
          ticket: "TICKET #103",
          project: "NEBULA",
          tags: ["BACKEND", "API"],
          assignees: [{ image: "/placeholder.svg", name: "John" }],
        },
      ],
    },
    {
      title: "Active",
      tasks: [
        {
          id: "4",
          title: "Implement User Authentication",
          ticket: "TICKET #104",
          project: "AURORA",
          tags: ["SECURITY", "BACKEND"],
          assignees: [{ image: "/placeholder.svg", name: "Olivia" }],
        },
        {
          id: "5",
          title: "Build User Dashboard",
          ticket: "TICKET #105",
          project: "VEGA",
          tags: ["UI", "FRONTEND"],
          assignees: [{ image: "/placeholder.svg", name: "Ethan" }],
        },
        {
          id: "6",
          title: "Integrate Payment Gateway",
          ticket: "TICKET #106",
          project: "NEBULA",
          tags: ["BACKEND", "PAYMENTS"],
          assignees: [{ image: "/placeholder.svg", name: "Sophia" }],
        },
        {
          id: "7",
          title: "Develop Push Notification System",
          ticket: "TICKET #107",
          project: "AURORA",
          tags: ["BACKEND", "NOTIFICATIONS"],
          assignees: [
            { image: "/placeholder.svg", name: "Liam" },
            { image: "/placeholder.svg", name: "Maya" },
          ],
        },
      ],
    },
    {
      title: "In Review",
      tasks: [
        {
          id: "8",
          title: "Optimize Database Queries",
          ticket: "TICKET #108",
          project: "VEGA",
          tags: ["DATABASE", "OPTIMIZATION"],
          assignees: [{ image: "/placeholder.svg", name: "James" }],
        },
        {
          id: "9",
          title: "Review UI Components",
          ticket: "TICKET #109",
          project: "NEBULA",
          tags: ["UI", "REVIEW"],
          assignees: [
            { image: "/placeholder.svg", name: "Alice" },
            { image: "/placeholder.svg", name: "John" },
          ],
        },
        {
          id: "10",
          title: "Test API Endpoints",
          ticket: "TICKET #110",
          project: "AURORA",
          tags: ["API", "TESTING"],
          assignees: [{ image: "/placeholder.svg", name: "Charlie" }],
        },
      ],
    },
    {
      title: "Completed",
      tasks: [
        {
          id: "11",
          title: "Deploy to Production",
          ticket: "TICKET #111",
          project: "LUMOS",
          tags: ["DEPLOYMENT", "PRODUCTION"],
          assignees: [{ image: "/placeholder.svg", name: "Noah" }],
        },
        {
          id: "12",
          title: "Final User Testing",
          ticket: "TICKET #112",
          project: "AURORA",
          tags: ["TESTING", "USER EXPERIENCE"],
          assignees: [{ image: "/placeholder.svg", name: "Zoe" }],
        },
      ],
    },
  ]);
  const [searchQuery, setSearchQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      ticket: "",
      project: "",
      tags: "",
    },
  });

  const EditableTitle = ({
    title,
    onSave
  }: {
    title: string,
    onSave: (newTitle: string) => void
  }) => {
    const [isEditing, setIsEditing] = useState(false)
    const [value, setValue] = useState(title)

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault()
      if (value.trim()) {
        onSave(value)
        setIsEditing(false)
      }
    }

    if (isEditing) {
      return (
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <Input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="py-1 h-7 font-medium text-sm"
            autoFocus
            onBlur={() => setIsEditing(false)}
          />
        </form>
      )
    }

    return (
      <div
        className="flex justify-between items-center hover:bg-gray-100/50 px-2 py-1 rounded-md transition-colors duration-200 cursor-pointer group"
        onClick={() => setIsEditing(true)}
      >
        <h2 className="font-medium text-gray-600 text-sm">
          {title}
        </h2>
        <PencilIcon
          className="opacity-0 group-hover:opacity-100 w-3.5 h-3.5 text-gray-400 transition-all duration-200"
          strokeWidth={1.5}
        />
      </div>
    )
  }

  const filteredColumns = columns.map(column => ({
    ...column,
    tasks: column.tasks.filter(task => {
      const searchString = searchQuery.toLowerCase();
      return (
        task.title.toLowerCase().includes(searchString) ||
        task.ticket.toLowerCase().includes(searchString) ||
        task.project.toLowerCase().includes(searchString) ||
        task.tags.some(tag => tag.toLowerCase().includes(searchString))
      );
    })
  }));

  const addNewColumn = () => {
    if (columns.length >= 8) {
      return;
    }

    const newColumn: Column = {
      title: `New Column ${columns.length + 1}`,
      tasks: []
    };

    setColumns([...columns, newColumn]);
  };

  const useDebounce = (callback: Function, delay: number) => {
    const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

    return useCallback((...args: any[]) => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      const newTimeoutId = setTimeout(() => {
        callback(...args);
      }, delay);

      setTimeoutId(newTimeoutId);
    }, [callback, delay]);
  };



  const debouncedSearch = useDebounce((query: string) => {
    setSearchQuery(query.toLowerCase())
  }, 300)



  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const { source, destination } = result;

    if (source.droppableId !== destination.droppableId) {
      // Moving between columns
      const sourceColumn = columns[parseInt(source.droppableId)];
      const destColumn = columns[parseInt(destination.droppableId)];
      const sourceItems = [...sourceColumn.tasks];
      const destItems = [...destColumn.tasks];
      const [removed] = sourceItems.splice(source.index, 1);
      destItems.splice(destination.index, 0, removed);

      const newColumns = [...columns];
      newColumns[parseInt(source.droppableId)].tasks = sourceItems;
      newColumns[parseInt(destination.droppableId)].tasks = destItems;

      setColumns(newColumns);
    } else {

      const column = columns[parseInt(source.droppableId)];
      const copiedItems = [...column.tasks];
      const [removed] = copiedItems.splice(source.index, 1);
      copiedItems.splice(destination.index, 0, removed);

      const newColumns = [...columns];
      newColumns[parseInt(source.droppableId)].tasks = copiedItems;
      setColumns(newColumns);
    }
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      title: values.title,
      ticket: values.ticket,
      project: values.project,
      tags: values.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      assignees: [{ image: "/placeholder.svg", name: "User 1" }],
    };

    setColumns(prev => {
      return prev.map((columnm, index) => {
        if (index === 0) {
          return {
            ...columnm,
            tasks: [...columnm.tasks, newTask]
          }
        }
        return columnm;
      });
    });

    setIsOpen(false);
    form.reset();
  };



  return (
    <div className="relative p-8 min-h-screen">
      <div className="mx-auto max-w-7xl">
        <div className="flex justify-between items-center gap-4 mb-8">
          <div className="flex-grow">
            <SearchBar onSearch={debouncedSearch} />
          </div>
          <Button
            onClick={addNewColumn}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Column
          </Button>
          <Button onClick={() => setIsOpen(true)}>Add New Task</Button>
        </div>

        {/* Slide-over panel */}
        {isOpen && (
          <>
            <div
              className="z-40 fixed inset-0 bg-black/30 transition-opacity"
              onClick={() => setIsOpen(false)}
            />
            <div className={`
              fixed right-0 top-0 h-full w-[30%] min-w-[380px] 
              bg-background z-50 shadow-lg transform transition-transform 
              duration-300 ease-in-out p-6 border-l
              ${isOpen ? 'translate-x-0' : 'translate-x-full'}
            `}>
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-semibold text-lg">Create New Task</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Task title" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="ticket"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ticket</FormLabel>
                        <FormControl>
                          <Input placeholder="TICKET #" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="project"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Project</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select project" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="AURORA">AURORA</SelectItem>
                            <SelectItem value="VEGA">VEGA</SelectItem>
                            <SelectItem value="NEBULA">NEBULA</SelectItem>
                            <SelectItem value="LUMOS">LUMOS</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="tags"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tags</FormLabel>
                        <FormControl>
                          <Input placeholder="Comma separated tags" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full">Create Task</Button>
                </form>
              </Form>
            </div>
          </>
        )}

        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex gap-2 pb-4 overflow-x-auto">
            {filteredColumns.map((column, columnIndex) => (
              <Droppable droppableId={columnIndex.toString()} key={column.title}>
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="flex-1 min-w-[280px]"
                  >
                    <EditableTitle
                      title={column.title}
                      onSave={(newTitle) => {
                        const updatedColumns = [...columns]
                        updatedColumns[columnIndex].title = newTitle
                        setColumns(updatedColumns)
                      }}
                    />
                    <div
                      className="space-y-3 pr-2 hover:pr-1 h-[550px] transition-all duration-300 overflow-y-auto ease-in-out mask-image-gradient scroll-smooth"
                      style={{
                        scrollbarWidth: 'thin',
                        scrollbarColor: 'rgb(203 213 225) transparent'
                      }}
                    >
                      {column.tasks.map((task, index) => (
                        <Draggable
                          key={task.id}
                          draggableId={task.id}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <Card className="p-3 h-[130 px]">
                                <div className="space-y-2">
                                  <div className="flex justify-between items-center">

                                    <Badge
                                      className={`${task.project === "AURORA"
                                        ? "bg-green-100 text-green-800"
                                        : task.project === "VEGA"
                                          ? "bg-orange-100 text-orange-800"
                                          : task.project === "NEBULA"
                                            ? "bg-purple-100 text-purple-800"
                                            : "bg-yellow-100 text-yellow-800"
                                        }`}
                                      variant="secondary"
                                    >
                                      {task.project}
                                    </Badge>
                                    <span className="text-gray-500 text-xs">{task.ticket}</span>
                                  </div>
                                  <h3 className="font-medium text-sm">{task.title}</h3>
                                  {task.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-1">
                                      {task.tags.map((tag) => (
                                        <Badge key={tag} variant="secondary" className="text-xs">
                                          {tag}
                                        </Badge>
                                      ))}
                                    </div>
                                  )}
                                  <div className="flex">
                                    {task.assignees.map((assignee, i) => (
                                      <Avatar key={i} className="border-2 border-white w-6 h-6">
                                        <AvatarImage alt={assignee.name} src={assignee.image} />
                                        <AvatarFallback className="text-xs">
                                          {assignee.name
                                            .split(" ")
                                            .map((n) => n[0])
                                            .join("")}
                                        </AvatarFallback>
                                      </Avatar>
                                    ))}
                                  </div>
                                </div>
                              </Card>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  </div>
                )}
              </Droppable>
            ))}
          </div>
        </DragDropContext>
      </div>
    </div>
  );
}

