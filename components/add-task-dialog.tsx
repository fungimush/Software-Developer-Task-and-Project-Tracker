"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import type { Project, Task } from "@/lib/types"

interface AddTaskDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAdd: (projectId: string, task: Omit<Task, "id">) => void
  projects: Project[]
}

export function AddTaskDialog({ open, onOpenChange, onAdd, projects }: AddTaskDialogProps) {
  const [projectId, setProjectId] = useState("")
  const [name, setName] = useState("")
  const [type, setType] = useState<"frontend" | "backend">("frontend")
  const [dueDate, setDueDate] = useState("")
  const [status, setStatus] = useState<"in-progress" | "pending">("pending")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (projectId && name && dueDate) {
      onAdd(projectId, {
        name,
        type,
        dueDate: new Date(dueDate),
        status,
      })
      resetForm()
    }
  }

  const resetForm = () => {
    setProjectId("")
    setName("")
    setType("frontend")
    setDueDate("")
    setStatus("pending")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Task</DialogTitle>
          <DialogDescription>Add a new task to a project.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="project">Project</Label>
              <Select value={projectId} onValueChange={setProjectId} required>
                <SelectTrigger id="project">
                  <SelectValue placeholder="Select project" />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="task-name">Task Name</Label>
              <Input
                id="task-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter task name"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="task-type">Task Type</Label>
              <RadioGroup
                value={type}
                onValueChange={(value) => setType(value as "frontend" | "backend")}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="frontend" id="frontend" />
                  <Label htmlFor="frontend">Frontend</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="backend" id="backend" />
                  <Label htmlFor="backend">Backend</Label>
                </div>
              </RadioGroup>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="due-date">Due Date</Label>
              <Input id="due-date" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="task-status">Task Status</Label>
              <RadioGroup
                value={status}
                onValueChange={(value) => setStatus(value as "in-progress" | "pending")}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="in-progress" id="in-progress" />
                  <Label htmlFor="in-progress">In Progress</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="pending" id="pending" />
                  <Label htmlFor="pending">Pending</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={!projectId || !name || !dueDate}>
              Add Task
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

