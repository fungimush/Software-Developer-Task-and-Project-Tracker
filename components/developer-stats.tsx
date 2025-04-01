import type { Developer } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Code, CheckCircle, Clock } from "lucide-react"

interface DeveloperStatsProps {
  developers: Developer[]
}

export function DeveloperStats({ developers }: DeveloperStatsProps) {
  // Calculate statistics
  const totalDevelopers = developers.length
  const availableDevelopers = developers.filter((dev) => dev.availability === "available").length
  const busyDevelopers = developers.filter((dev) => dev.availability === "busy").length

  const totalProjects = developers.reduce((acc, dev) => acc + dev.projects.length, 0)

  const totalTasks = developers.reduce((acc, dev) => {
    return (
      acc +
      dev.projects.reduce((projectAcc, project) => {
        return projectAcc + (project.currentTask ? 1 : 0) + project.pendingTasks.length
      }, 0)
    )
  }, 0)

  const inProgressTasks = developers.reduce((acc, dev) => {
    return (
      acc +
      dev.projects.reduce((projectAcc, project) => {
        return projectAcc + (project.currentTask ? 1 : 0)
      }, 0)
    )
  }, 0)

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="bg-white dark:bg-gray-900">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total Developers</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalDevelopers}</div>
          <p className="text-xs text-muted-foreground mt-1">
            {availableDevelopers} available, {busyDevelopers} busy
          </p>
        </CardContent>
      </Card>

      <Card className="bg-white dark:bg-gray-900">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
          <Code className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalProjects}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Across {developers.filter((dev) => dev.projects.length > 0).length} developers
          </p>
        </CardContent>
      </Card>

      <Card className="bg-white dark:bg-gray-900">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">In Progress</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{inProgressTasks}</div>
          <p className="text-xs text-muted-foreground mt-1">Tasks currently being worked on</p>
        </CardContent>
      </Card>

      <Card className="bg-white dark:bg-gray-900">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
          <CheckCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalTasks}</div>
          <p className="text-xs text-muted-foreground mt-1">{totalTasks - inProgressTasks} pending tasks</p>
        </CardContent>
      </Card>
    </div>
  )
}

