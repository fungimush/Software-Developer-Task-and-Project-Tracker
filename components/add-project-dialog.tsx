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
import type { Project } from "@/lib/types"

interface AddProjectDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAdd: (project: Omit<Project, "id" | "pendingTasks">) => void
}

export function AddProjectDialog({ open, onOpenChange, onAdd }: AddProjectDialogProps) {
  const [name, setName] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name) {
      onAdd({ name })
      setName("")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Project</DialogTitle>
          <DialogDescription>Add a new project for the selected developer.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="project-name">Project Name</Label>
              <Input
                id="project-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter project name"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={!name}>
              Add Project
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

