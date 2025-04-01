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
import type { Developer } from "@/lib/types"

interface AddDeveloperDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAdd: (developer: Omit<Developer, "id" | "projects" | "availability">) => void
}

export function AddDeveloperDialog({ open, onOpenChange, onAdd }: AddDeveloperDialogProps) {
  const [name, setName] = useState("")
  const [role, setRole] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name && role) {
      onAdd({ name, role })
      setName("")
      setRole("")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Developer</DialogTitle>
          <DialogDescription>Add a new developer to the tracking system.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter developer name"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="role">Role</Label>
              <Select value={role} onValueChange={setRole} required>
                <SelectTrigger id="role">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Frontend Developer">Frontend Developer</SelectItem>
                  <SelectItem value="Backend Developer">Backend Developer</SelectItem>
                  <SelectItem value="Full Stack Developer">Full Stack Developer</SelectItem>
                  <SelectItem value="DevOps Engineer">DevOps Engineer</SelectItem>
                  <SelectItem value="QA Engineer">QA Engineer</SelectItem>
                  <SelectItem value="UI/UX Designer">UI/UX Designer</SelectItem>
                  <SelectItem value="Project Manager">Project Manager</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={!name || !role}>
              Add Developer
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

