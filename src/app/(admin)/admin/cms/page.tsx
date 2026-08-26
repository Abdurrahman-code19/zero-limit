"use client"

import { useState, useEffect } from "react"
import { FileText, Save, Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

interface CMSContent {
  id: number
  page_key: string
  title: string
  content: string
}

const DEFAULT_PAGES = [
  { key: "hero_title", title: "Homepage Hero Title", content: "Beyond Limits. Beyond Style." },
  { key: "hero_subtitle", title: "Homepage Hero Subtitle", content: "Discover curated fashion pieces that define contemporary elegance." },
  { key: "about_heading", title: "About Page Heading", content: "About Zero Limit" },
  { key: "about_text", title: "About Page Text", content: "Zero Limit was born from a simple belief: fashion should be fearless." },
  { key: "size_guide", title: "Size Guide Content", content: "S: Chest 36\" | M: Chest 38\" | L: Chest 40\" | XL: Chest 42\"" },
]

export default function CMSPage() {
  const [pages, setPages] = useState<CMSContent[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => { loadContent() }, [])

  async function loadContent() {
    const supabase = createClient()
    const { data } = await supabase.from("cms_content").select("*")
    if (data && data.length > 0) {
      setPages(data)
    } else {
      setPages(DEFAULT_PAGES.map((p, i) => ({ id: i + 1, page_key: p.key, title: p.title, content: p.content })))
    }
    setLoading(false)
  }

  async function handleSave() {
    setSaving(true)
    const supabase = createClient()
    for (const page of pages) {
      await supabase.from("cms_content").upsert({
        id: page.id,
        page_key: page.page_key,
        title: page.title,
        content: page.content,
        updated_at: new Date().toISOString(),
      })
    }
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  function updateContent(pageKey: string, value: string) {
    setPages((prev) => prev.map((p) => p.page_key === pageKey ? { ...p, content: value } : p))
  }

  if (loading) {
    return <div className="space-y-6"><h1 className="text-2xl font-bold">Content Management</h1><div className="h-64 animate-pulse bg-muted rounded" /></div>
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Content Management</h1>
          <p className="text-muted-foreground">Manage site content and copy</p>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
          Save
        </Button>
      </div>

      {saved && <p className="text-sm text-green-600">Content saved!</p>}

      <div className="space-y-4">
        {pages.map((page) => (
          <Card key={page.page_key}>
            <CardHeader><CardTitle className="text-base">{page.title}</CardTitle></CardHeader>
            <CardContent>
              {page.content.length > 100 ? (
                <Textarea
                  value={page.content}
                  onChange={(e) => updateContent(page.page_key, e.target.value)}
                  rows={4}
                />
              ) : (
                <Input
                  value={page.content}
                  onChange={(e) => updateContent(page.page_key, e.target.value)}
                />
              )}
              <p className="text-xs text-muted-foreground mt-1">Key: {page.page_key}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
