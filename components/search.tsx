"use client"

import { Input } from "@/components/ui/input"
import { SearchIcon } from "lucide-react"

interface SearchProps {
  value: string
  onChange: (value: string) => void
}

export function Search({ value, onChange }: SearchProps) {
  return (
    <div className="relative">
      <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Search developers..."
        className="pl-8"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  )
}

