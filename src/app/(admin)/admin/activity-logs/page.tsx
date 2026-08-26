"use client"

import { useState, useEffect } from "react"
import { ScrollText, Search } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

interface LogEntry {
  id: string
  action: string
  entity_type: string | null
  entity_id: string | null
  details: Record<string, unknown> | null
  created_at: string
  user_email: string
}

const ACTION_COLORS: Record<string, string> = {
  create: "bg-green-100 text-green-800",
  update: "bg-blue-100 text-blue-800",
  delete: "bg-red-100 text-red-800",
  login: "bg-purple-100 text-purple-800",
  logout: "bg-gray-100 text-gray-800",
}

export default function ActivityLogsPage() {
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  useEffect(() => { loadLogs() }, [])

  async function loadLogs() {
    const supabase = createClient()
    const { data } = await supabase
      .from("activity_logs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100)

    if (data) {
      const userIds = [...new Set(data.map((l) => l.user_id).filter(Boolean))]
      let userMap: Record<string, any> = {}
      if (userIds.length > 0) {
        const { data: users } = await supabase.from("profiles").select("id, email").in("id", userIds)
        userMap = Object.fromEntries((users ?? []).map((u) => [u.id, u]))
      }

      setLogs(data.map((l) => ({
        ...l,
        user_email: userMap[l.user_id]?.email ?? "System",
      })))
    }
    setLoading(false)
  }

  const filtered = logs.filter((l) =>
    l.action.toLowerCase().includes(search.toLowerCase()) ||
    l.entity_type?.toLowerCase().includes(search.toLowerCase()) ||
    l.user_email.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) {
    return <div className="space-y-6"><h1 className="text-2xl font-bold">Activity Logs</h1><div className="h-64 animate-pulse bg-muted rounded" /></div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Activity Logs</h1>
        <p className="text-muted-foreground">{logs.length} recent activities</p>
      </div>
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search logs..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
      </div>
      <Card>
        <CardContent className="p-0">
          <table className="w-full">
            <thead><tr className="border-b">
              <th className="text-left p-4 font-medium">Action</th>
              <th className="text-left p-4 font-medium">Entity</th>
              <th className="text-left p-4 font-medium">User</th>
              <th className="text-left p-4 font-medium">Time</th>
            </tr></thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={4} className="p-8 text-center text-muted-foreground">No activity logs found</td></tr>
              ) : filtered.map((log) => {
                const actionKey = log.action.split(".")[0]
                return (
                  <tr key={log.id} className="border-b last:border-0 hover:bg-muted/50">
                    <td className="p-4">
                      <Badge className={ACTION_COLORS[actionKey] ?? "bg-gray-100 text-gray-800"}>
                        {log.action}
                      </Badge>
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">{log.entity_type ?? "—"}</td>
                    <td className="p-4 text-sm">{log.user_email}</td>
                    <td className="p-4 text-sm text-muted-foreground">{new Date(log.created_at).toLocaleString()}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}
