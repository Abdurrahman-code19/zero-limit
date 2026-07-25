"use client"

import { useState } from "react"
import { User, MapPin, CreditCard, Bell, Settings, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("personal")
  const [profile, setProfile] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
    phone: "+234 800 000 0000",
  })

  const tabs = [
    { id: "personal", label: "Personal Info", icon: User },
    { id: "addresses", label: "Addresses", icon: MapPin },
    { id: "payment", label: "Payment Methods", icon: CreditCard },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "settings", label: "Settings", icon: Settings },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Account</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar */}
        <aside className="md:col-span-1">
          <nav className="space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              )
            })}
            <Separator className="my-2" />
            <button className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors">
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </nav>
        </aside>

        {/* Content */}
        <main className="md:col-span-3">
          {activeTab === "personal" && (
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">First Name</label>
                    <Input
                      value={profile.firstName}
                      onChange={(e) =>
                        setProfile({ ...profile, firstName: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Last Name</label>
                    <Input
                      value={profile.lastName}
                      onChange={(e) =>
                        setProfile({ ...profile, lastName: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <Input
                    type="email"
                    value={profile.email}
                    onChange={(e) =>
                      setProfile({ ...profile, email: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Phone</label>
                  <Input
                    type="tel"
                    value={profile.phone}
                    onChange={(e) =>
                      setProfile({ ...profile, phone: e.target.value })
                    }
                  />
                </div>
                <Button>Save Changes</Button>
              </CardContent>
            </Card>
          )}

          {activeTab === "addresses" && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Saved Addresses</CardTitle>
                <Button size="sm">Add Address</Button>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium">Home</p>
                      <p className="text-sm text-muted-foreground">
                        123 Main Street, Lagos, Nigeria
                      </p>
                      <p className="text-sm text-muted-foreground">+234 800 000 0000</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">Edit</Button>
                      <Button variant="outline" size="sm">Delete</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "payment" && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Payment Methods</CardTitle>
                <Button size="sm">Add Card</Button>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center py-8">
                  No saved payment methods. Payments are processed securely via Paystack.
                </p>
              </CardContent>
            </Card>
          )}

          {activeTab === "notifications" && (
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { label: "Order updates", description: "Receive emails about your order status" },
                  { label: "Promotions", description: "Receive emails about new drops and sales" },
                  { label: "Newsletter", description: "Weekly style inspiration and news" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{item.label}</p>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                    <input type="checkbox" className="h-4 w-4" defaultChecked />
                  </div>
                ))}
                <Button>Save Preferences</Button>
              </CardContent>
            </Card>
          )}

          {activeTab === "settings" && (
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-medium mb-2">Change Password</h3>
                  <div className="space-y-4">
                    <Input type="password" placeholder="Current password" />
                    <Input type="password" placeholder="New password" />
                    <Input type="password" placeholder="Confirm new password" />
                    <Button>Update Password</Button>
                  </div>
                </div>
                <Separator />
                <div>
                  <h3 className="font-medium mb-2 text-destructive">Danger Zone</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Once you delete your account, there is no going back.
                  </p>
                  <Button variant="destructive">Delete Account</Button>
                </div>
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    </div>
  )
}
