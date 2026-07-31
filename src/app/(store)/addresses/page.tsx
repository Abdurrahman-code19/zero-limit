"use client"

import Link from "next/link"
import { MapPin, Plus, Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const ADDRESSES = [
  { id: 1, label: "Home", street: "123 Main Street, Apt 4B", city: "Lagos", state: "Lagos", zip: "100001", country: "Nigeria", isDefault: true },
  { id: 2, label: "Office", street: "45 Business Avenue, Suite 200", city: "Abuja", state: "FCT", zip: "900001", country: "Nigeria", isDefault: false },
]

export default function AddressesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link href="/store" className="hover:text-foreground">Home</Link>
        <span>/</span>
        <span className="text-foreground">Addresses</span>
      </div>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">My Addresses</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your delivery addresses</p>
        </div>
        <Button className="bg-foreground text-background hover:bg-foreground/90 text-xs tracking-widest uppercase rounded-none">
          <Plus className="h-4 w-4 mr-2" /> Add Address
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {ADDRESSES.map((addr) => (
          <div key={addr.id} className="border rounded-lg p-6 relative">
            {addr.isDefault && (
              <Badge variant="secondary" className="absolute top-3 right-3 text-[9px] uppercase tracking-wider">
                Default
              </Badge>
            )}
            <div className="flex items-start gap-3 mb-4">
              <MapPin className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
              <div>
                <p className="font-medium mb-1">{addr.label}</p>
                <p className="text-sm text-muted-foreground">{addr.street}</p>
                <p className="text-sm text-muted-foreground">{addr.city}, {addr.state} {addr.zip}</p>
                <p className="text-sm text-muted-foreground">{addr.country}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="h-8 text-xs">
                <Pencil className="h-3 w-3 mr-1" /> Edit
              </Button>
              <Button variant="ghost" size="sm" className="h-8 text-xs text-destructive">
                <Trash2 className="h-3 w-3 mr-1" /> Delete
              </Button>
            </div>
          </div>
        ))}

        {/* Add new card */}
        <button className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center gap-2 text-muted-foreground hover:text-foreground hover:border-foreground/50 transition-colors min-h-[200px]">
          <Plus className="h-8 w-8" />
          <span className="text-sm">Add New Address</span>
        </button>
      </div>
    </div>
  )
}
