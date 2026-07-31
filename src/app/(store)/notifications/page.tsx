"use client"

import Link from "next/link"
import { Bell, ShoppingBag, Tag, Truck, Megaphone, Package, X } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"

const NOTIFICATIONS = [
  { id: 1, type: "order", title: "Order Shipped!", desc: "Your order #ORD-002 has been shipped.", time: "2 hours ago", read: false },
  { id: 2, type: "promo", title: "Flash Sale!", desc: "Get 30% off on all streetwear. Limited time offer.", time: "1 day ago", read: false },
  { id: 3, type: "coupon", title: "New Coupon Available", desc: "Use code WELCOME10 for 10% off your next order.", time: "3 days ago", read: true },
  { id: 4, type: "order", title: "Order Delivered", desc: "Your order #ORD-001 has been delivered.", time: "5 days ago", read: true },
  { id: 5, type: "stock", title: "Back in Stock", desc: "Urban Classic Sneakers are back in stock!", time: "1 week ago", read: true },
]

const icons = {
  order: ShoppingBag,
  promo: Megaphone,
  coupon: Tag,
  stock: Package,
  shipping: Truck,
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(NOTIFICATIONS)

  const clearAll = () => setNotifications([])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link href="/store" className="hover:text-foreground">Home</Link>
        <span>/</span>
        <span className="text-foreground">Notifications</span>
      </div>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Notifications</h1>
          <p className="text-sm text-muted-foreground mt-1">{notifications.filter(n => !n.read).length} unread</p>
        </div>
        {notifications.length > 0 && (
          <Button variant="ghost" size="sm" className="text-xs text-muted-foreground" onClick={clearAll}>
            Clear All
          </Button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="text-center py-20">
          <Bell className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-lg font-medium mb-2">No notifications</h2>
          <p className="text-sm text-muted-foreground">You're all caught up!</p>
        </div>
      ) : (
        <div className="space-y-2 max-w-2xl">
          {notifications.map((notif) => {
            const Icon = icons[notif.type as keyof typeof icons] || Bell
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
                      <p className="text-xs text-muted-foreground mt-0.5">{notif.desc}</p>
                    </div>
                    <span className="text-[10px] text-muted-foreground shrink-0">{notif.time}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
