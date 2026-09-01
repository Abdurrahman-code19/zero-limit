"use client"

import { useState, useEffect } from "react"
import { ShieldCheck, Search, UserPlus, Trash2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"

interface AdminUser {
  id: string
  email: string
  full_name: string
  role: string
  created_at: string
}

export default function AdminsPage() {
  const [admins, setAdmins] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [confirmTarget, setConfirmTarget] = useState<{ id: string; name: string } | null>(null)

  useEffect(() => { loadAdmins() }, [])

  async function loadAdmins() {
    const supabase = createClient()
    const { data } = await supabase
      .from("profiles")
      .select("id, email, full_name, role, created_at")
      .in("role", ["admin", "super_admin"])
      .order("created_at")

    if (data) setAdmins(data)
    setLoading(false)
  }

  async function removeAdmin(id: string, name: string) {
    await fetch("/api/admin/admins", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: id, role: "customer" }),
    })
    setConfirmTarget(null)
    loadAdmins()
  }

  const filtered = admins.filter((a) =>
    a.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    a.email.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) {
    return <div className="space-y-6"><h1 className="text-2xl font-bold">Admins</h1><div className="h-64 animate-pulse bg-muted rounded" /></div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Admin Users</h1>
          <p className="text-muted-foreground">{admins.length} admin(s)</p>
        </div>
        <p className="text-xs text-muted-foreground">
          To add admins, promote users from the Customers page
        </p>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search admins..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
            <thead><tr className="border-b">
              <th className="text-left p-4 font-medium">Admin</th>
              <th className="text-left p-4 font-medium">Role</th>
              <th className="text-left p-4 font-medium">Joined</th>
              <th className="text-right p-4 font-medium">Actions</th>
            </tr></thead>
            <tbody>
              {filtered.map((admin) => (
                <tr key={admin.id} className="border-b last:border-0 hover:bg-muted/50">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <ShieldCheck className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{admin.full_name || "No Name"}</p>
                        <p className="text-xs text-muted-foreground">{admin.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <Badge variant={admin.role === "super_admin" ? "default" : "secondary"}>
                      {admin.role.replace("_", " ")}
                    </Badge>
                  </td>
                  <td className="p-4 text-sm text-muted-foreground">{new Date(admin.created_at).toLocaleDateString()}</td>
                  <td className="p-4 text-right">
                    {admin.role !== "super_admin" && (
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => setConfirmTarget({ id: admin.id, name: admin.full_name || admin.email })}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <ConfirmDialog
        open={confirmTarget !== null}
        onOpenChange={(open) => { if (!open) setConfirmTarget(null) }}
        title="Remove admin"
        description={`Are you sure you want to remove admin role from "${confirmTarget?.name}"? They will become a customer. This cannot be recovered.`}
        confirmLabel="Remove"
        onConfirm={() => confirmTarget && removeAdmin(confirmTarget.id, confirmTarget.name)}
      />
    </div>
  )
}
