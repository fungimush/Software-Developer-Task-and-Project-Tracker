"use client"

import { useState, useEffect } from "react"
import { DeveloperList } from "./developer-list"
import { DeveloperDetails } from "./developer-details"
import { Search } from "./search"
import { Button } from "@/components/ui/button"
import { PlusCircle, Download, Users, Code, Moon, Sun, BarChart3 } from "lucide-react"
import { AddDeveloperDialog } from "./add-developer-dialog"
import { AddProjectDialog } from "./add-project-dialog"
import { AddTaskDialog } from "./add-task-dialog"
import type { Developer, Project, Task } from "@/lib/types"
import { exportToExcel } from "@/lib/excel-export"
import { useTheme } from "next-themes"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { DeveloperStats } from "./developer-stats"
import Image from "next/image"

// Sample data
const initialDevelopers: Developer[] = [
  {
    id: "1",
    name: "Jane Smith",
    role: "Full Stack Developer",
    availability: "busy",
    projects: [
      {
        id: "1",
        name: "E-commerce Platform",
        currentTask: {
          id: "1",
          name: "Implement user authentication",
          type: "backend",
          dueDate: new Date("2025-04-15"),
          status: "in-progress",
        },
        pendingTasks: [
          {
            id: "2",
            name: "Create product listing page",
            type: "frontend",
            dueDate: new Date("2025-04-20"),
            status: "pending",
          },
          {
            id: "3",
            name: "Set up payment gateway",
            type: "backend",
            dueDate: new Date("2025-04-25"),
            status: "pending",
          },
        ],
      },
    ],
  },
  {
    id: "2",
    name: "John Doe",
    role: "Frontend Developer",
    availability: "busy",
    projects: [
      {
        id: "2",
        name: "Marketing Website",
        currentTask: {
          id: "4",
          name: "Design homepage layout",
          type: "frontend",
          dueDate: new Date("2025-04-10"),
          status: "in-progress",
        },
        pendingTasks: [
          {
            id: "5",
            name: "Implement responsive design",
            type: "frontend",
            dueDate: new Date("2025-04-18"),
            status: "pending",
          },
        ],
      },
      {
        id: "3",
        name: "Admin Dashboard",
        currentTask: {
          id: "6",
          name: "Create data visualization components",
          type: "frontend",
          dueDate: new Date("2025-04-12"),
          status: "in-progress",
        },
        pendingTasks: [],
      },
    ],
  },
  {
    id: "3",
    name: "Alex Johnson",
    role: "Backend Developer",
    availability: "busy",
    projects: [
      {
        id: "4",
        name: "API Gateway",
        currentTask: {
          id: "7",
          name: "Implement rate limiting",
          type: "backend",
          dueDate: new Date("2025-04-14"),
          status: "in-progress",
        },
        pendingTasks: [
          {
            id: "8",
            name: "Add authentication middleware",
            type: "backend",
            dueDate: new Date("2025-04-22"),
            status: "pending",
          },
          {
            id: "9",
            name: "Set up logging service",
            type: "backend",
            dueDate: new Date("2025-04-28"),
            status: "pending",
          },
        ],
      },
    ],
  },
  {
    id: "4",
    name: "Sarah Williams",
    role: "UI/UX Designer",
    availability: "available",
    projects: [],
  },
  {
    id: "5",
    name: "Michael Chen",
    role: "DevOps Engineer",
    availability: "available",
    projects: [],
  },
]

export function DeveloperDashboard() {
  const [developers, setDevelopers] = useState<Developer[]>(initialDevelopers)
  const [selectedDeveloper, setSelectedDeveloper] = useState<Developer | null>(initialDevelopers[0])
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddDeveloperOpen, setIsAddDeveloperOpen] = useState(false)
  const [isAddProjectOpen, setIsAddProjectOpen] = useState(false)
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false)
  const [availabilityFilter, setAvailabilityFilter] = useState<"all" | "available" | "busy">("all")
  const { theme, setTheme } = useTheme()

  // Filter developers based on search query and availability
  const filteredDevelopers = developers.filter((developer) => {
    const matchesSearch = developer.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesAvailability = availabilityFilter === "all" || developer.availability === availabilityFilter
    return matchesSearch && matchesAvailability
  })

  // Update developer availability based on projects
  useEffect(() => {
    const updatedDevelopers = developers.map((developer) => {
      const hasActiveProjects = developer.projects.some(
        (project) => project.currentTask || project.pendingTasks.length > 0,
      )
      return {
        ...developer,
        availability: hasActiveProjects ? "busy" : "available",
      }
    })
    setDevelopers(updatedDevelopers)
  }, [])

  // Add a new developer
  const handleAddDeveloper = (newDeveloper: Omit<Developer, "id" | "projects" | "availability">) => {
    const developer: Developer = {
      id: (developers.length + 1).toString(),
      name: newDeveloper.name,
      role: newDeveloper.role,
      availability: "available",
      projects: [],
    }
    setDevelopers([...developers, developer])
    setIsAddDeveloperOpen(false)
  }

  // Add a new project to a developer
  const handleAddProject = (developerId: string, newProject: Omit<Project, "id" | "pendingTasks">) => {
    const updatedDevelopers = developers.map((developer) => {
      if (developer.id === developerId) {
        const updatedDeveloper = {
          ...developer,
          projects: [
            ...developer.projects,
            {
              id: (developer.projects.length + 1).toString(),
              name: newProject.name,
              currentTask: newProject.currentTask,
              pendingTasks: [],
            },
          ],
          availability: "busy", // Update availability when adding a project
        }
        return updatedDeveloper
      }
      return developer
    })
    setDevelopers(updatedDevelopers)
    setSelectedDeveloper(updatedDevelopers.find((dev) => dev.id === developerId) || null)
    setIsAddProjectOpen(false)
  }

  // Add a new task to a project
  const handleAddTask = (developerId: string, projectId: string, newTask: Omit<Task, "id">) => {
    const updatedDevelopers = developers.map((developer) => {
      if (developer.id === developerId) {
        return {
          ...developer,
          availability: "busy", // Update availability when adding a task
          projects: developer.projects.map((project) => {
            if (project.id === projectId) {
              if (newTask.status === "in-progress") {
                // If the new task is in-progress, move the current task to pending if it exists
                const pendingTasks = [...project.pendingTasks]
                if (project.currentTask) {
                  pendingTasks.push({
                    ...project.currentTask,
                    status: "pending",
                  })
                }
                return {
                  ...project,
                  currentTask: {
                    id: (project.pendingTasks.length + 1).toString(),
                    ...newTask,
                  },
                  pendingTasks,
                }
              } else {
                // If the new task is pending, add it to pending tasks
                return {
                  ...project,
                  pendingTasks: [
                    ...project.pendingTasks,
                    {
                      id: (project.pendingTasks.length + 1).toString(),
                      ...newTask,
                    },
                  ],
                }
              }
            }
            return project
          }),
        }
      }
      return developer
    })
    setDevelopers(updatedDevelopers)
    setSelectedDeveloper(updatedDevelopers.find((dev) => dev.id === developerId) || null)
    setIsAddTaskOpen(false)
  }

  // Complete a task
  const handleCompleteTask = (developerId: string, projectId: string, taskId: string, isCurrentTask: boolean) => {
    const updatedDevelopers = developers.map((developer) => {
      if (developer.id === developerId) {
        const updatedProjects = developer.projects.map((project) => {
          if (project.id === projectId) {
            if (isCurrentTask && project.currentTask?.id === taskId) {
              return {
                ...project,
                currentTask: undefined,
              }
            } else {
              return {
                ...project,
                pendingTasks: project.pendingTasks.filter((task) => task.id !== taskId),
              }
            }
          }
          return project
        })

        // Check if developer has any active projects after task completion
        const hasActiveProjects = updatedProjects.some(
          (project) => project.currentTask || project.pendingTasks.length > 0,
        )

        return {
          ...developer,
          projects: updatedProjects,
          availability: hasActiveProjects ? "busy" : "available",
        }
      }
      return developer
    })
    setDevelopers(updatedDevelopers)
    setSelectedDeveloper(updatedDevelopers.find((dev) => dev.id === developerId) || null)
  }

  // Start a pending task
  const handleStartTask = (developerId: string, projectId: string, taskId: string) => {
    const updatedDevelopers = developers.map((developer) => {
      if (developer.id === developerId) {
        return {
          ...developer,
          availability: "busy", // Update availability when starting a task
          projects: developer.projects.map((project) => {
            if (project.id === projectId) {
              const taskToStart = project.pendingTasks.find((task) => task.id === taskId)
              if (taskToStart) {
                const pendingTasks = project.pendingTasks.filter((task) => task.id !== taskId)
                // If there's already a current task, move it to pending
                if (project.currentTask) {
                  pendingTasks.push({
                    ...project.currentTask,
                    status: "pending",
                  })
                }
                return {
                  ...project,
                  currentTask: {
                    ...taskToStart,
                    status: "in-progress",
                  },
                  pendingTasks,
                }
              }
            }
            return project
          }),
        }
      }
      return developer
    })
    setDevelopers(updatedDevelopers)
    setSelectedDeveloper(updatedDevelopers.find((dev) => dev.id === developerId) || null)
  }

  // Export developers data to Excel
  const handleExportToExcel = () => {
    exportToExcel(developers)
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 border-b border-border shadow-sm">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image
              src="/images/escrow-logo.png"
              alt="Escrow Systems Logo"
              width={120}
              height={40}
              className="h-10 w-auto"
            />
            <div className="hidden md:block h-6 w-px bg-border mx-2"></div>
            <h1 className="hidden md:block text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
              Developer Task Tracker
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="rounded-full"
            >
              {theme === "dark" ? (
                <Sun className="h-[1.2rem] w-[1.2rem]" />
              ) : (
                <Moon className="h-[1.2rem] w-[1.2rem]" />
              )}
            </Button>
            <Button onClick={handleExportToExcel} variant="outline" className="gap-1.5">
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Export to Excel</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <Tabs defaultValue="dashboard" className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <TabsList className="bg-white dark:bg-gray-900 border border-border">
              <TabsTrigger value="dashboard" className="gap-1.5">
                <BarChart3 className="h-4 w-4" />
                <span>Dashboard</span>
              </TabsTrigger>
              <TabsTrigger value="developers" className="gap-1.5">
                <Users className="h-4 w-4" />
                <span>Developers</span>
              </TabsTrigger>
              <TabsTrigger value="projects" className="gap-1.5">
                <Code className="h-4 w-4" />
                <span>Projects</span>
              </TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Button
                onClick={() => setAvailabilityFilter("all")}
                variant={availabilityFilter === "all" ? "default" : "outline"}
                size="sm"
                className="flex-1 sm:flex-none"
              >
                All
              </Button>
              <Button
                onClick={() => setAvailabilityFilter("available")}
                variant={availabilityFilter === "available" ? "default" : "outline"}
                size="sm"
                className={`flex-1 sm:flex-none ${availabilityFilter === "available" ? "bg-green-500 hover:bg-green-600" : ""}`}
              >
                Available
              </Button>
              <Button
                onClick={() => setAvailabilityFilter("busy")}
                variant={availabilityFilter === "busy" ? "default" : "outline"}
                size="sm"
                className={`flex-1 sm:flex-none ${availabilityFilter === "busy" ? "bg-amber-500 hover:bg-amber-600" : ""}`}
              >
                Busy
              </Button>
            </div>
          </div>

          <TabsContent value="dashboard" className="space-y-6 mt-0">
            <DeveloperStats developers={developers} />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1 space-y-4">
                <Card className="overflow-hidden border-border bg-white dark:bg-gray-900">
                  <CardContent className="p-0">
                    <div className="p-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white">
                      <h2 className="text-xl font-semibold flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        Developers
                      </h2>
                    </div>
                    <div className="p-4 space-y-4">
                      <Search value={searchQuery} onChange={setSearchQuery} />
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">
                          {filteredDevelopers.length} developers found
                        </span>
                        <Button size="sm" onClick={() => setIsAddDeveloperOpen(true)}>
                          <PlusCircle className="h-4 w-4 mr-2" />
                          Add
                        </Button>
                      </div>
                      <DeveloperList
                        developers={filteredDevelopers}
                        selectedDeveloper={selectedDeveloper}
                        onSelectDeveloper={setSelectedDeveloper}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div className="md:col-span-2">
                {selectedDeveloper ? (
                  <DeveloperDetails
                    developer={selectedDeveloper}
                    onAddProject={() => setIsAddProjectOpen(true)}
                    onAddTask={() => setIsAddTaskOpen(true)}
                    onCompleteTask={handleCompleteTask}
                    onStartTask={handleStartTask}
                  />
                ) : (
                  <Card className="h-full flex items-center justify-center p-6 bg-white dark:bg-gray-900">
                    <div className="text-center">
                      <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium">No Developer Selected</h3>
                      <p className="text-muted-foreground mt-2">
                        Select a developer from the list to view their details
                      </p>
                    </div>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="developers" className="mt-0">
            <Card className="bg-white dark:bg-gray-900">
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">All Developers</h2>
                  <Button onClick={() => setIsAddDeveloperOpen(true)}>
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add Developer
                  </Button>
                </div>
                <div className="overflow-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4">Name</th>
                        <th className="text-left py-3 px-4">Role</th>
                        <th className="text-left py-3 px-4">Status</th>
                        <th className="text-left py-3 px-4">Projects</th>
                        <th className="text-left py-3 px-4">Current Task</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredDevelopers.map((developer) => (
                        <tr
                          key={developer.id}
                          className="border-b border-border hover:bg-muted/50 cursor-pointer"
                          onClick={() => setSelectedDeveloper(developer)}
                        >
                          <td className="py-3 px-4 font-medium">{developer.name}</td>
                          <td className="py-3 px-4">{developer.role}</td>
                          <td className="py-3 px-4">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                developer.availability === "available"
                                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                  : "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300"
                              }`}
                            >
                              {developer.availability === "available" ? "Available" : "Busy"}
                            </span>
                          </td>
                          <td className="py-3 px-4">{developer.projects.length}</td>
                          <td className="py-3 px-4">
                            {developer.projects.find((p) => p.currentTask)?.currentTask?.name || "-"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="projects" className="mt-0">
            <Card className="bg-white dark:bg-gray-900">
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">All Projects</h2>
                  {selectedDeveloper && (
                    <Button onClick={() => setIsAddProjectOpen(true)}>
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Add Project
                    </Button>
                  )}
                </div>
                <div className="overflow-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4">Project Name</th>
                        <th className="text-left py-3 px-4">Developer</th>
                        <th className="text-left py-3 px-4">Current Task</th>
                        <th className="text-left py-3 px-4">Due Date</th>
                        <th className="text-left py-3 px-4">Pending Tasks</th>
                      </tr>
                    </thead>
                    <tbody>
                      {developers.flatMap((developer) =>
                        developer.projects.map((project) => (
                          <tr
                            key={`${developer.id}-${project.id}`}
                            className="border-b border-border hover:bg-muted/50 cursor-pointer"
                            onClick={() => setSelectedDeveloper(developer)}
                          >
                            <td className="py-3 px-4 font-medium">{project.name}</td>
                            <td className="py-3 px-4">{developer.name}</td>
                            <td className="py-3 px-4">{project.currentTask?.name || "-"}</td>
                            <td className="py-3 px-4">
                              {project.currentTask ? new Date(project.currentTask.dueDate).toLocaleDateString() : "-"}
                            </td>
                            <td className="py-3 px-4">{project.pendingTasks.length}</td>
                          </tr>
                        )),
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Dialogs */}
      <AddDeveloperDialog open={isAddDeveloperOpen} onOpenChange={setIsAddDeveloperOpen} onAdd={handleAddDeveloper} />
      <AddProjectDialog
        open={isAddProjectOpen}
        onOpenChange={setIsAddProjectOpen}
        onAdd={(project) => selectedDeveloper && handleAddProject(selectedDeveloper.id, project)}
      />
      <AddTaskDialog
        open={isAddTaskOpen}
        onOpenChange={setIsAddTaskOpen}
        onAdd={(projectId, task) => selectedDeveloper && handleAddTask(selectedDeveloper.id, projectId, task)}
        projects={selectedDeveloper?.projects || []}
      />
    </div>
  )
}

