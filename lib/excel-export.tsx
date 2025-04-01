import type { Developer } from "./types"

export function exportToExcel(developers: Developer[]) {
  // Create a flat structure for Excel export
  const rows: any[] = []

  developers.forEach((developer) => {
    if (developer.projects.length === 0) {
      // Developer with no projects
      rows.push({
        "Developer Name": developer.name,
        Role: developer.role,
        Status: developer.availability === "available" ? "Available" : "Busy",
        Project: "",
        "Current Task": "",
        "Task Type": "",
        "Due Date": "",
        "Pending Tasks": 0,
      })
    } else {
      // Developer with projects
      developer.projects.forEach((project) => {
        if (project.currentTask) {
          // Project with current task
          rows.push({
            "Developer Name": developer.name,
            Role: developer.role,
            Status: developer.availability === "available" ? "Available" : "Busy",
            Project: project.name,
            "Current Task": project.currentTask.name,
            "Task Type": project.currentTask.type,
            "Due Date": formatExcelDate(project.currentTask.dueDate),
            "Pending Tasks": project.pendingTasks.length,
          })

          // Add pending tasks as separate rows
          project.pendingTasks.forEach((task) => {
            rows.push({
              "Developer Name": "",
              Role: "",
              Status: "",
              Project: "",
              "Current Task": `(Pending) ${task.name}`,
              "Task Type": task.type,
              "Due Date": formatExcelDate(task.dueDate),
              "Pending Tasks": "",
            })
          })
        } else if (project.pendingTasks.length > 0) {
          // Project with only pending tasks
          const firstTask = project.pendingTasks[0]
          rows.push({
            "Developer Name": developer.name,
            Role: developer.role,
            Status: developer.availability === "available" ? "Available" : "Busy",
            Project: project.name,
            "Current Task": `(Pending) ${firstTask.name}`,
            "Task Type": firstTask.type,
            "Due Date": formatExcelDate(firstTask.dueDate),
            "Pending Tasks": project.pendingTasks.length - 1,
          })

          // Add remaining pending tasks as separate rows
          project.pendingTasks.slice(1).forEach((task) => {
            rows.push({
              "Developer Name": "",
              Role: "",
              Status: "",
              Project: "",
              "Current Task": `(Pending) ${task.name}`,
              "Task Type": task.type,
              "Due Date": formatExcelDate(task.dueDate),
              "Pending Tasks": "",
            })
          })
        } else {
          // Project with no tasks
          rows.push({
            "Developer Name": developer.name,
            Role: developer.role,
            Status: developer.availability === "available" ? "Available" : "Busy",
            Project: project.name,
            "Current Task": "",
            "Task Type": "",
            "Due Date": "",
            "Pending Tasks": 0,
          })
        }
      })
    }
  })

  // Convert data to CSV format
  const headers = [
    "Developer Name",
    "Role",
    "Status",
    "Project",
    "Current Task",
    "Task Type",
    "Due Date",
    "Pending Tasks",
  ]

  // Create CSV content
  let csvContent = headers.join(",") + "\n"

  rows.forEach((row) => {
    const values = headers.map((header) => {
      const value = row[header] !== undefined ? row[header] : ""
      // Escape commas and quotes in values
      return `"${String(value).replace(/"/g, '""')}"`
    })
    csvContent += values.join(",") + "\n"
  })

  // Create a blob and download link
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)

  // Create a temporary link and trigger download
  const link = document.createElement("a")
  link.href = url
  link.setAttribute("download", "developer-tasks.csv")
  document.body.appendChild(link)
  link.click()

  // Clean up
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

function formatExcelDate(date: Date): string {
  return new Date(date).toLocaleDateString()
}

