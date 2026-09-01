import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Terms & Conditions | Zero Limit",
  description: "Zero Limit terms and conditions for using our website and services.",
}

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-3xl">
      <div className="text-center mb-12">
        <p className="text-[11px] tracking-[0.4em] uppercase text-muted-foreground mb-3">Legal</p>
        <h1 className="text-3xl md:text-4xl font-light mb-4">Terms & Conditions</h1>
        <p className="text-sm text-muted-foreground">Last updated: August 2026</p>
      </div>

      <div className="space-y-8 text-sm text-muted-foreground leading-relaxed">
        <section>
          <h2 className="text-lg font-medium text-foreground mb-3">1. Acceptance of Terms</h2>
          <p>
            By accessing and using the Zero Limit website and services, you agree to be bound by these
            Terms & Conditions. If you do not agree to these terms, please do not use our website.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-medium text-foreground mb-3">2. Products & Pricing</h2>
          <p>
            All prices are displayed in Nigerian Naira (₦) and include applicable taxes. We reserve the right
            to modify prices at any time without prior notice. Product descriptions and images are as accurate
            as possible but may vary slightly from the actual product.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-medium text-foreground mb-3">3. Orders & Payment</h2>
          <p>
            By placing an order, you are making an offer to purchase a product. All orders are subject to
            availability and confirmation. Payment is processed securely through Paystack. We do not store
            your payment card details.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-medium text-foreground mb-3">4. Shipping & Delivery</h2>
          <p>
            We aim to dispatch orders within 1-2 business days. Delivery times are estimates and not
            guaranteed. Zero Limit is not responsible for delays caused by the shipping carrier or
            circumstances beyond our control.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-medium text-foreground mb-3">5. Returns & Refunds</h2>
          <p>
            Returns are accepted within 7 days of delivery for items in original condition. Please refer
            to our Returns & Refunds policy for complete details. Refunds are processed to the original
            payment method within 5-7 business days.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-medium text-foreground mb-3">6. Intellectual Property</h2>
          <p>
            All content on this website, including logos, images, designs, and text, is the property of
            Zero Limit, owned and operated by RIIT GLOBAL TECH, and is protected by copyright laws.
            Unauthorized use or reproduction of any content
            is strictly prohibited.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-medium text-foreground mb-3">7. Limitation of Liability</h2>
          <p>
            Zero Limit shall not be liable for any indirect, incidental, or consequential damages arising
            from the use of our products or website. Our total liability shall not exceed the purchase
            price of the product in question.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-medium text-foreground mb-3">8. Changes to Terms</h2>
          <p>
            We reserve the right to update these terms at any time. Changes will be posted on this page
            with an updated effective date. Continued use of our website after changes constitutes
            acceptance of the revised terms.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-medium text-foreground mb-3">9. Contact</h2>
          <p>
            For questions about these terms, please contact us at{" "}
            <a href="mailto:zerolimitunlimited@gmail.com" className="text-foreground underline">
              zerolimitunlimited@gmail.com
            </a>
          </p>
        </section>
      </div>
    </div>
  )
}
