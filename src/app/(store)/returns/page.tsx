import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Returns & Refunds | Zero Limit",
  description: "Learn about Zero Limit's return and refund policy.",
}

export default function ReturnsPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-3xl">
      <div className="text-center mb-12">
        <p className="text-[11px] tracking-[0.4em] uppercase text-muted-foreground mb-3">Policy</p>
        <h1 className="text-4xl font-light mb-4">Returns & Refunds</h1>
      </div>

      <div className="space-y-8 text-sm text-muted-foreground leading-relaxed">
        <section>
          <h2 className="text-xl font-medium text-foreground mb-3">7-Day Return Policy</h2>
          <p>
            We want you to love your Zero Limit purchase. If you&apos;re not completely satisfied,
            you can return most items within <strong className="text-foreground">7 days</strong> of delivery for a full refund or exchange.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-medium text-foreground mb-3">Eligibility</h2>
          <ul className="space-y-2">
            <li>Items must be unworn, unwashed, and in original condition</li>
            <li>Items must have all original tags attached</li>
            <li>Items must be in their original packaging</li>
            <li>Proof of purchase (order number or receipt) is required</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-medium text-foreground mb-3">Non-Returnable Items</h2>
          <ul className="space-y-2">
            <li>Items worn, washed, or altered after delivery</li>
            <li>Items without original tags or packaging</li>
            <li>Sale or clearance items (unless defective)</li>
            <li>Items purchased with promotional discounts (eligible for exchange only)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-medium text-foreground mb-3">How to Start a Return</h2>
          <ol className="space-y-2">
            <li>1. Log into your account and go to your Orders page</li>
            <li>2. Find the order with the item you want to return</li>
            <li>3. Click &quot;Request Return&quot; and select the reason</li>
            <li>4. Our team will review your request within 24 hours</li>
            <li>5. Once approved, you&apos;ll receive instructions for shipping the item back</li>
          </ol>
        </section>

        <section>
          <h2 className="text-xl font-medium text-foreground mb-3">Refund Processing</h2>
          <p>
            Refunds are processed within 5-7 business days after we receive and inspect the returned item.
            The refund will be credited to your original payment method. You&apos;ll receive an email confirmation
            once the refund has been processed.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-medium text-foreground mb-3">Exchanges</h2>
          <p>
            Need a different size or color? We offer free exchanges within 7 days of delivery.
            Contact us to arrange an exchange and we&apos;ll ship the new item as soon as we receive the original.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-medium text-foreground mb-3">Damaged or Defective Items</h2>
          <p>
            If you received a damaged or defective item, please contact us within 48 hours of delivery
            with photos of the issue. We&apos;ll arrange a replacement or full refund immediately — no need to
            return the damaged item.
          </p>
        </section>
      </div>
    </div>
  )
}
