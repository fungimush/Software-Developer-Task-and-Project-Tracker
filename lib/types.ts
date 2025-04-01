export type Developer = {
  id: string
  name: string
  role: string
  availability: "available" | "busy"
  projects: Project[]
}

export type Project = {
  id: string
  name: string
  currentTask?: Task
  pendingTasks: Task[]
}

export type Task = {
  id: string
  name: string
  type: "frontend" | "backend"
  dueDate: Date
  status: "in-progress" | "pending" | "completed"
}

