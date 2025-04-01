import { DeveloperDashboard } from "@/components/developer-dashboard"
import { ThemeProvider } from "@/components/theme-provider"

export default function Home() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      <main className="min-h-screen bg-gradient-to-b from-background to-slate-50 dark:from-background dark:to-slate-950">
        <DeveloperDashboard />
      </main>
    </ThemeProvider>
  )
}

