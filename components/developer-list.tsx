"use client"

import type { Developer } from "@/lib/types"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Code, Cpu } from "lucide-react"

interface DeveloperListProps {
  developers: Developer[]
  selectedDeveloper: Developer | null
  onSelectDeveloper: (developer: Developer) => void
}

export function DeveloperList({ developers, selectedDeveloper, onSelectDeveloper }: DeveloperListProps) {
  return (
    <ScrollArea className="h-[calc(100vh-320px)]">
      <div className="space-y-2">
        {developers.length === 0 ? (
          <p className="text-center text-muted-foreground py-4">No developers found</p>
        ) : (
          developers.map((developer) => (
            <div
              key={developer.id}
              className={cn(
                "p-3 rounded-md cursor-pointer hover:bg-accent transition-colors border border-transparent",
                selectedDeveloper?.id === developer.id ? "bg-accent border-border" : "",
              )}
              onClick={() => onSelectDeveloper(developer)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {developer.role.includes("Frontend") ? (
                    <Code className="h-4 w-4 text-blue-500" />
                  ) : developer.role.includes("Backend") ? (
                    <Cpu className="h-4 w-4 text-purple-500" />
                  ) : (
                    <Code className="h-4 w-4 text-cyan-500" />
                  )}
                  <h3 className="font-medium">{developer.name}</h3>
                </div>
                <Badge
                  variant={developer.availability === "available" ? "success" : "default"}
                  className={developer.availability === "available" ? "bg-green-500" : ""}
                >
                  {developer.availability === "available" ? "Available" : "Busy"}
                </Badge>
              </div>
              <div className="flex items-center justify-between mt-1">
                <p className="text-sm text-muted-foreground">{developer.role}</p>
                <p className="text-xs text-muted-foreground">
                  {developer.projects.length} {developer.projects.length === 1 ? "project" : "projects"}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </ScrollArea>
  )
}

