import { Metadata } from "next"
import { ChevronDown } from "lucide-react"

export const metadata: Metadata = {
  title: "FAQs | Zero Limit",
  description: "Frequently asked questions about shopping, orders, shipping, and returns at Zero Limit.",
}

const faqs = [
  {
    q: "How long does shipping take?",
    a: "Standard delivery within Lagos takes 1-2 business days. Delivery to other states in Nigeria takes 3-5 business days. You'll receive a tracking number once your order is dispatched.",
  },
  {
    q: "How do I track my order?",
    a: "Once your order is shipped, you'll receive an email with a tracking number. You can also check your order status by logging into your account and visiting the Orders section.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept all major debit and credit cards through Paystack, a secure Nigerian payment processor. All transactions are encrypted and secure.",
  },
  {
    q: "Can I return or exchange an item?",
    a: "Yes! We offer a 7-day return policy. Items must be unworn, unwashed, and in their original packaging. Contact us to initiate a return.",
  },
  {
    q: "How do I know my size?",
    a: "Each product page includes a size guide. If you're between sizes, we generally recommend sizing up for a more comfortable fit. Feel free to contact us for personalized sizing advice.",
  },
  {
    q: "Do you ship nationwide?",
    a: "Yes, we ship to all 36 states in Nigeria plus the FCT. Shipping fees vary by location and are calculated at checkout.",
  },
  {
    q: "Can I cancel or modify my order?",
    a: "You can cancel or modify your order within 24 hours of placing it, as long as it hasn't been shipped yet. Contact us immediately if you need changes.",
  },
  {
    q: "Are your products authentic?",
    a: "Absolutely. Every Zero Limit piece is an original design, crafted with premium materials. We stand behind the quality of every item we sell.",
  },
]

export default function FAQPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-3xl">
      <div className="text-center mb-12">
        <p className="text-[11px] tracking-[0.4em] uppercase text-muted-foreground mb-3">Help Center</p>
        <h1 className="text-4xl font-light mb-4">Frequently Asked Questions</h1>
        <p className="text-muted-foreground">
          Find answers to common questions about shopping with Zero Limit.
        </p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, i) => (
          <details key={i} className="group border border-border rounded-lg">
            <summary className="flex items-center justify-between p-5 cursor-pointer font-medium text-sm">
              {faq.q}
              <ChevronDown className="h-4 w-4 text-muted-foreground group-open:rotate-180 transition-transform" />
            </summary>
            <div className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed">
              {faq.a}
            </div>
          </details>
        ))}
      </div>

      <div className="mt-12 text-center">
        <p className="text-sm text-muted-foreground mb-3">Still have questions?</p>
        <a
          href="/contact"
          className="inline-flex items-center text-sm font-medium border-b border-foreground pb-0.5 hover:text-muted-foreground transition-colors"
        >
          Contact our support team
        </a>
      </div>
    </div>
  )
}
