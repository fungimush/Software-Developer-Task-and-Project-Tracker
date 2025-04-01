"use client"

import type { Developer } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PlusCircle, CheckCircle, PlayCircle, Calendar, Clock, Code, Cpu } from "lucide-react"
import { formatDate, getDaysRemaining } from "@/lib/utils"
import { Progress } from "@/components/ui/progress"

interface DeveloperDetailsProps {
  developer: Developer
  onAddProject: () => void
  onAddTask: () => void
  onCompleteTask: (developerId: string, projectId: string, taskId: string, isCurrentTask: boolean) => void
  onStartTask: (developerId: string, projectId: string, taskId: string) => void
}

export function DeveloperDetails({
  developer,
  onAddProject,
  onAddTask,
  onCompleteTask,
  onStartTask,
}: DeveloperDetailsProps) {
  return (
    <div className="space-y-6">
      <Card className="bg-white dark:bg-gray-900 overflow-hidden border-border">
        <div className="h-12 bg-gradient-to-r from-blue-600 to-cyan-500"></div>
        <CardHeader className="pb-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <CardTitle className="text-2xl">{developer.name}</CardTitle>
                <Badge
                  variant={developer.availability === "available" ? "success" : "default"}
                  className={developer.availability === "available" ? "bg-green-500" : ""}
                >
                  {developer.availability === "available" ? "Available" : "Busy"}
                </Badge>
              </div>
              <CardDescription className="text-base">{developer.role}</CardDescription>
            </div>
            <Button onClick={onAddProject} className="shrink-0">
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Project
            </Button>
          </div>
        </CardHeader>
      </Card>

      {developer.projects.length === 0 ? (
        <Card className="bg-white dark:bg-gray-900 border-border">
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <Code className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No projects yet. Add a project to get started.</p>
              <Button onClick={onAddProject} className="mt-4">
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Project
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        developer.projects.map((project) => (
          <Card key={project.id} className="bg-white dark:bg-gray-900 border-border">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-5 w-5 text-blue-500" />
                  {project.name}
                </CardTitle>
                <Button size="sm" variant="outline" onClick={onAddTask}>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add Task
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Current Task */}
                <div>
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <Clock className="h-4 w-4 text-blue-500" />
                    Current Task
                  </h4>
                  {project.currentTask ? (
                    <div className="bg-accent/50 p-4 rounded-lg border border-border">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            {project.currentTask.type === "frontend" ? (
                              <Code className="h-4 w-4 text-blue-500" />
                            ) : (
                              <Cpu className="h-4 w-4 text-purple-500" />
                            )}
                            <p className="font-medium">{project.currentTask.name}</p>
                          </div>
                          <div className="flex flex-wrap items-center gap-2 mt-2">
                            <Badge variant={project.currentTask.type === "frontend" ? "default" : "secondary"}>
                              {project.currentTask.type}
                            </Badge>
                            <span className="text-sm text-muted-foreground flex items-center gap-1">
                              <Calendar className="h-3.5 w-3.5" />
                              Due: {formatDate(project.currentTask.dueDate)}
                            </span>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => onCompleteTask(developer.id, project.id, project.currentTask!.id, true)}
                          className="shrink-0"
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Complete
                        </Button>
                      </div>

                      <div className="mt-3">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span>Progress</span>
                          <span>
                            {getDaysRemaining(project.currentTask.dueDate) <= 0
                              ? "Overdue"
                              : `${getDaysRemaining(project.currentTask.dueDate)} days left`}
                          </span>
                        </div>
                        <Progress
                          value={Math.max(0, Math.min(100, 100 - getDaysRemaining(project.currentTask.dueDate) * 10))}
                          className="h-2"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="bg-muted/50 p-4 rounded-lg border border-border text-center">
                      <p className="text-muted-foreground">No current task</p>
                      <Button size="sm" variant="outline" onClick={onAddTask} className="mt-2">
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Add Task
                      </Button>
                    </div>
                  )}
                </div>

                {/* Pending Tasks */}
                <div>
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-blue-500" />
                    Pending Tasks
                  </h4>
                  {project.pendingTasks.length === 0 ? (
                    <div className="bg-muted/50 p-4 rounded-lg border border-border text-center">
                      <p className="text-muted-foreground">No pending tasks</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {project.pendingTasks.map((task) => (
                        <div key={task.id} className="border border-border p-4 rounded-lg bg-white dark:bg-gray-800">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div>
                              <div className="flex items-center gap-2">
                                {task.type === "frontend" ? (
                                  <Code className="h-4 w-4 text-blue-500" />
                                ) : (
                                  <Cpu className="h-4 w-4 text-purple-500" />
                                )}
                                <p className="font-medium">{task.name}</p>
                              </div>
                              <div className="flex flex-wrap items-center gap-2 mt-2">
                                <Badge variant={task.type === "frontend" ? "default" : "secondary"}>{task.type}</Badge>
                                <span className="text-sm text-muted-foreground flex items-center gap-1">
                                  <Calendar className="h-3.5 w-3.5" />
                                  Due: {formatDate(task.dueDate)}
                                </span>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="default"
                                onClick={() => onStartTask(developer.id, project.id, task.id)}
                              >
                                <PlayCircle className="h-4 w-4 mr-2" />
                                Start
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => onCompleteTask(developer.id, project.id, task.id, false)}
                              >
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Complete
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  )
}

