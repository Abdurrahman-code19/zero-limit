"use client"

import Link from "next/link"
import { Bell, ShoppingBag, Tag, Truck, Megaphone, Package, CheckCheck, Trash2 } from "lucide-react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { createClient } from "@/lib/supabase/client"

interface Notification {
  id: string
  type: string
  title: string
  message: string
  read: boolean
  created_at: string
}

const icons: Record<string, React.ComponentType<{ className?: string }>> = {
  order: ShoppingBag,
  promo: Megaphone,
  coupon: Tag,
  stock: Package,
  shipping: Truck,
}

function timeAgo(date: string): string {
  const diff = Date.now() - new Date(date).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return "just now"
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  if (days < 7) return `${days}d ago`
  return new Date(date).toLocaleDateString()
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [confirmClear, setConfirmClear] = useState(false)

  useEffect(() => {
    const supabase = createClient()

    fetch("/api/notifications")
      .then((r) => r.json())
      .then((data) => {
        setNotifications(data.notifications ?? [])
        setLoading(false)
      })
      .catch(() => setLoading(false))

    let channel: ReturnType<ReturnType<typeof createClient>["channel"]> | null = null

    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return

      channel = supabase
        .channel("notifications-changes")
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "notifications", filter: `user_id=eq.${user.id}` },
          (payload) => {
            if (payload.eventType === "INSERT") {
              setNotifications((prev) => [payload.new as Notification, ...prev])
            } else if (payload.eventType === "UPDATE") {
              setNotifications((prev) =>
                prev.map((n) => (n.id === payload.new.id ? (payload.new as Notification) : n))
              )
            } else if (payload.eventType === "DELETE") {
              setNotifications((prev) => prev.filter((n) => n.id !== payload.old.id))
            }
          }
        )
        .subscribe()
    })

    return () => {
      if (channel) supabase.removeChannel(channel)
    }
  }, [])

  const unreadCount = notifications.filter((n) => !n.read).length

  const markAllRead = async () => {
    await fetch("/api/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mark_all_read: true }),
    })
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const clearAll = async () => {
    await fetch("/api/notifications", { method: "DELETE" })
    setConfirmClear(false)
    setNotifications([])
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link href="/store" className="hover:text-foreground">Home</Link>
        <span>/</span>
        <span className="text-foreground">Notifications</span>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
        <div>
          <h1 className="text-2xl font-bold">Notifications</h1>
          <p className="text-sm text-muted-foreground mt-1">{unreadCount} unread</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" className="text-xs text-muted-foreground" onClick={markAllRead}>
              <CheckCheck className="h-4 w-4 mr-1" />
              Mark All Read
            </Button>
          )}
          {notifications.length > 0 && (
            <Button variant="ghost" size="sm" className="text-xs text-destructive" onClick={() => setConfirmClear(true)}>
              <Trash2 className="h-4 w-4 mr-1" />
              Clear All
            </Button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="space-y-2 max-w-2xl">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 animate-pulse bg-muted rounded-lg" />
          ))}
        </div>
      ) : notifications.length === 0 ? (
        <div className="text-center py-20">
          <Bell className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-lg font-medium mb-2">No notifications</h2>
          <p className="text-sm text-muted-foreground">You&apos;re all caught up!</p>
        </div>
      ) : (
        <div className="space-y-2 max-w-2xl">
          {notifications.map((notif) => {
            const Icon = icons[notif.type] || Bell
            return (
              <div
                key={notif.id}
                className={`flex items-start gap-4 p-4 rounded-lg border transition-colors ${
                  !notif.read ? "bg-muted/50 border-primary/20" : ""
                }`}
              >
                <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                  !notif.read ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                }`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className={`text-sm ${!notif.read ? "font-medium" : ""}`}>{notif.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{notif.message}</p>
                    </div>
                    <span className="text-[10px] text-muted-foreground shrink-0">{timeAgo(notif.created_at)}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <ConfirmDialog
        open={confirmClear}
        onOpenChange={setConfirmClear}
        title="Clear all notifications"
        description="Are you sure you want to clear all notifications? This cannot be recovered."
        confirmLabel="Clear All"
        onConfirm={clearAll}
      />
    </div>
  )
}
