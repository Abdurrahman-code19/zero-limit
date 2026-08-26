import { Metadata } from "next"
import { Mail, Phone, MapPin, Clock } from "lucide-react"

export const metadata: Metadata = {
  title: "Contact Us | Zero Limit",
  description: "Get in touch with Zero Limit. We're here to help with orders, returns, and inquiries.",
}

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <div className="text-center mb-12">
        <p className="text-[11px] tracking-[0.4em] uppercase text-muted-foreground mb-3">Get In Touch</p>
        <h1 className="text-4xl font-light mb-4">Contact Us</h1>
        <p className="text-muted-foreground max-w-md mx-auto">
          Have a question about your order, need help with a return, or just want to say hello? We&apos;d love to hear from you.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-12">
        <div className="space-y-8">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 border border-border flex items-center justify-center shrink-0">
              <Mail className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-medium mb-1">Email</h3>
              <p className="text-sm text-muted-foreground">support@zerolimit.store</p>
              <p className="text-sm text-muted-foreground">orders@zerolimit.store</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-10 h-10 border border-border flex items-center justify-center shrink-0">
              <Phone className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-medium mb-1">Phone</h3>
              <p className="text-sm text-muted-foreground">+234 (0) 800 ZERO LIMIT</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-10 h-10 border border-border flex items-center justify-center shrink-0">
              <MapPin className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-medium mb-1">Address</h3>
              <p className="text-sm text-muted-foreground">
                Zero Limit Fashion<br />
                Lagos, Nigeria
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-10 h-10 border border-border flex items-center justify-center shrink-0">
              <Clock className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-medium mb-1">Business Hours</h3>
              <p className="text-sm text-muted-foreground">Monday - Friday: 9AM - 6PM WAT</p>
              <p className="text-sm text-muted-foreground">Saturday: 10AM - 4PM WAT</p>
            </div>
          </div>
        </div>

        <div>
          <form className="space-y-4" action="mailto:support@zerolimit.store" encType="text/plain">
            <div>
              <label className="text-sm font-medium">Name</label>
              <input
                type="text"
                className="mt-1 w-full rounded-md border border-input bg-background px-4 py-2.5 text-sm"
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Email</label>
              <input
                type="email"
                className="mt-1 w-full rounded-md border border-input bg-background px-4 py-2.5 text-sm"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Subject</label>
              <input
                type="text"
                className="mt-1 w-full rounded-md border border-input bg-background px-4 py-2.5 text-sm"
                placeholder="How can we help?"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Message</label>
              <textarea
                rows={5}
                className="mt-1 w-full rounded-md border border-input bg-background px-4 py-2.5 text-sm"
                placeholder="Tell us more..."
              />
            </div>
            <button
              type="submit"
              className="w-full bg-foreground text-background hover:bg-foreground/80 py-2.5 text-sm font-medium transition-colors"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
