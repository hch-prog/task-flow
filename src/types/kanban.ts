export type Status = 'NOT_STARTED' | 'IN_PROGRESS' | 'REVIEW' | 'COMPLETED'

export interface Task {
  id: string
  title: string
  status: Status
  ticket: string
  tags: string[]
  assignees?: string[]
}

export interface Column {
  id: Status
  title: string
  tasks: Task[]
} 