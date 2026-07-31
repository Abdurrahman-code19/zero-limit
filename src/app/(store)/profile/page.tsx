"use client"

import Link from "next/link"
import { useState } from "react"
import { User, Camera, Mail, Phone, Lock, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function ProfilePage() {
  const [firstName, setFirstName] = useState("John")
  const [lastName, setLastName] = useState("Doe")
  const [email, setEmail] = useState("john@example.com")
  const [phone, setPhone] = useState("+234 800 000 0000")

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link href="/store" className="hover:text-foreground">Home</Link>
        <span>/</span>
        <span className="text-foreground">Profile</span>
      </div>

      <h1 className="text-2xl font-bold mb-8">My Profile</h1>

      <div className="max-w-2xl space-y-8">
        {/* Avatar */}
        <div className="flex items-center gap-6">
          <div className="relative">
            <Avatar className="w-20 h-20">
              <AvatarImage src="" alt="Profile" />
              <AvatarFallback><User className="h-8 w-8" /></AvatarFallback>
            </Avatar>
            <button className="absolute bottom-0 right-0 w-7 h-7 bg-foreground text-background rounded-full flex items-center justify-center">
              <Camera className="h-3.5 w-3.5" />
            </button>
          </div>
          <div>
            <p className="font-medium">Profile Photo</p>
            <p className="text-xs text-muted-foreground">Upload a new photo</p>
          </div>
        </div>

        <Separator />

        {/* Personal Info */}
        <div className="space-y-4">
          <h2 className="font-semibold">Personal Information</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">First Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} className="pl-10" />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Last Name</label>
              <Input value={lastName} onChange={(e) => setLastName(e.target.value)} />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10" />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">Phone</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input value={phone} onChange={(e) => setPhone(e.target.value)} className="pl-10" />
            </div>
          </div>

          <Button className="bg-foreground text-background hover:bg-foreground/90 text-xs tracking-widest uppercase rounded-none">
            <Save className="h-4 w-4 mr-2" /> Save Changes
          </Button>
        </div>

        <Separator />

        {/* Password */}
        <div className="space-y-4">
          <h2 className="font-semibold">Change Password</h2>
          <div>
            <label className="text-sm font-medium mb-1 block">Current Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input type="password" placeholder="Enter current password" className="pl-10" />
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">New Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input type="password" placeholder="New password" className="pl-10" />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input type="password" placeholder="Confirm password" className="pl-10" />
              </div>
            </div>
          </div>
          <Button variant="outline" className="text-xs tracking-widest uppercase rounded-none">
            Update Password
          </Button>
        </div>
      </div>
    </div>
  )
}
