"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Search, X, TrendingUp } from "lucide-react"
import { Input } from "@/components/ui/input"

interface SearchOverlayProps {
  open: boolean
  onClose: () => void
}

const TRENDING_SEARCHES = [
  "Bernie",
  "Checkers Shirt",
  "Polo",
  "Quarter Zip",
  "Tank Top",
  "Lightning",
]

export function SearchOverlay({ open, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  useEffect(() => {
    if (open) {
      setQuery("")
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [open])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        if (open) onClose()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [open, onClose])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/shop?q=${encodeURIComponent(query.trim())}`)
      onClose()
    }
  }

  const handleTrendingClick = (term: string) => {
    router.push(`/shop?q=${encodeURIComponent(term)}`)
    onClose()
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[80]">
      {/* Overlay */}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />

      {/* Search Panel */}
      <div className="relative max-w-2xl mx-auto mt-24 px-4">
        <div className="bg-background border rounded-xl shadow-2xl overflow-hidden">
          <form onSubmit={handleSearch} className="flex items-center border-b">
            <Search className="h-5 w-5 ml-4 text-muted-foreground shrink-0" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search products..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 px-4 py-4 bg-transparent outline-none text-lg"
            />
            <button
              type="button"
              onClick={onClose}
              className="mr-4 p-1 hover:bg-muted rounded-md text-muted-foreground"
            >
              <X className="h-5 w-5" />
            </button>
          </form>

          <div className="p-4">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
              Trending
            </p>
            <div className="flex flex-wrap gap-2">
              {TRENDING_SEARCHES.map((term) => (
                <button
                  key={term}
                  onClick={() => handleTrendingClick(term)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm border rounded-full hover:bg-muted transition-colors"
                >
                  <TrendingUp className="h-3 w-3 text-muted-foreground" />
                  {term}
                </button>
              ))}
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-3">
          Press <kbd className="px-1.5 py-0.5 border rounded text-[10px]">ESC</kbd> to close
        </p>
      </div>
    </div>
  )
}
