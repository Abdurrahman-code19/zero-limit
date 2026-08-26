import { Metadata } from "next"
import { ChevronDown } from "lucide-react"
import { createClient } from "@/lib/supabase/server"

export const metadata: Metadata = {
  title: "FAQs | Zero Limit",
  description: "Frequently asked questions about shopping, orders, shipping, and returns at Zero Limit.",
}

const defaultFaqs = [
  {
    question: "How long does shipping take?",
    answer: "Standard delivery within Lagos takes 1-2 business days. Delivery to other states in Nigeria takes 3-5 business days. You'll receive a tracking number once your order is dispatched.",
  },
  {
    question: "How do I track my order?",
    answer: "Once your order is shipped, you'll receive an email with a tracking number. You can also check your order status by logging into your account and visiting the Orders section.",
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major debit and credit cards through Paystack, a secure Nigerian payment processor. All transactions are encrypted and secure.",
  },
  {
    question: "Can I return or exchange an item?",
    answer: "Yes! We offer a 7-day return policy. Items must be unworn, unwashed, and in their original packaging. Contact us to initiate a return.",
  },
  {
    question: "How do I know my size?",
    answer: "Each product page includes a size guide. If you're between sizes, we generally recommend sizing up for a more comfortable fit. Feel free to contact us for personalized sizing advice.",
  },
  {
    question: "Do you ship nationwide?",
    answer: "Yes, we ship to all 36 states in Nigeria plus the FCT. Shipping fees vary by location and are calculated at checkout.",
  },
  {
    question: "Can I cancel or modify my order?",
    answer: "You can cancel or modify your order within 24 hours of placing it, as long as it hasn't been shipped yet. Contact us immediately if you need changes.",
  },
  {
    question: "Are your products authentic?",
    answer: "Absolutely. Every Zero Limit piece is an original design, crafted with premium materials. We stand behind the quality of every item we sell.",
  },
]

export default async function FAQPage() {
  const supabase = await createClient()
  const { data } = await supabase
    .from("cms_content")
    .select("sections")
    .eq("page_slug", "faq")
    .single()

  const faqs = (data?.sections as { question: string; answer: string }[] | null) ?? defaultFaqs

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
              {faq.question}
              <ChevronDown className="h-4 w-4 text-muted-foreground group-open:rotate-180 transition-transform" />
            </summary>
            <div className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed">
              {faq.answer}
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
