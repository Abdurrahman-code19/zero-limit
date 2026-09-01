import { Metadata } from "next"
import { Truck, Package, MapPin } from "lucide-react"
import { createClient } from "@/lib/supabase/server"

export const metadata: Metadata = {
  title: "Shipping Information | Zero Limit",
  description: "Learn about Zero Limit shipping rates, delivery times, and policies.",
}

const shippingZones = [
  { zone: "Lagos (Intra-city)", time: "1-2 business days", fee: "₦1,500" },
  { zone: "South-West Nigeria", time: "2-3 business days", fee: "₦2,000" },
  { zone: "South-South & South-East", time: "3-5 business days", fee: "₦2,500" },
  { zone: "North-Central", time: "3-5 business days", fee: "₦2,500" },
  { zone: "North-West & North-East", time: "4-6 business days", fee: "₦3,000" },
]

export default async function ShippingPage() {
  const supabase = await createClient()
  const { data } = await supabase
    .from("store_settings")
    .select("shipping_fee, free_shipping_threshold")
    .single()

  const shippingFee = data?.shipping_fee ?? 2000
  const freeShippingThreshold = data?.free_shipping_threshold ?? 50000

  return (
    <div className="container mx-auto px-4 py-16 max-w-3xl">
      <div className="text-center mb-12">
        <p className="text-[11px] tracking-[0.4em] uppercase text-muted-foreground mb-3">Delivery</p>
        <h1 className="text-3xl md:text-4xl font-light mb-4">Shipping Information</h1>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-12">
        {[
          { icon: Truck, title: "Fast Delivery", desc: "Orders dispatched within 24 hours" },
          { icon: Package, title: "Secure Packaging", desc: "Carefully packed to protect your items" },
          { icon: MapPin, title: "Nationwide", desc: "We deliver to all 36 states + FCT" },
        ].map((item) => (
          <div key={item.title} className="text-center p-6 border border-border rounded-lg">
            <item.icon className="h-6 w-6 mx-auto mb-3 text-muted-foreground" />
            <h3 className="font-medium text-sm mb-1">{item.title}</h3>
            <p className="text-xs text-muted-foreground">{item.desc}</p>
          </div>
        ))}
      </div>

      <div className="space-y-8">
        <section>
          <h2 className="text-xl font-medium mb-4">Shipping Rates & Delivery Times</h2>
          <div className="border border-border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left p-3 font-medium">Zone</th>
                  <th className="text-left p-3 font-medium">Delivery Time</th>
                  <th className="text-right p-3 font-medium">Shipping Fee</th>
                </tr>
              </thead>
              <tbody>
                {shippingZones.map((zone) => (
                  <tr key={zone.zone} className="border-b last:border-0">
                    <td className="p-3">{zone.zone}</td>
                    <td className="p-3 text-muted-foreground">{zone.time}</td>
                    <td className="p-3 text-right font-medium">{zone.fee}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            Shipping fee is a flat ₦{shippingFee.toLocaleString()} added at checkout for standard delivery. Free shipping on orders over ₦{freeShippingThreshold.toLocaleString()}.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-medium mb-4">Order Processing</h2>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>Orders placed before 2PM WAT are dispatched same day (Lagos).</li>
            <li>Orders placed after 2PM or on weekends are dispatched the next business day.</li>
            <li>You&apos;ll receive a confirmation email with tracking details once your order ships.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-medium mb-4">Important Notes</h2>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>Delivery times are estimates and may vary due to public holidays or unforeseen circumstances.</li>
            <li>Please ensure your delivery address and phone number are accurate to avoid delays.</li>
            <li>If you&apos;re not available at delivery, the courier will attempt redelivery or hold at a pickup point.</li>
          </ul>
        </section>
      </div>
    </div>
  )
}
