import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Privacy Policy | Zero Limit",
  description: "Zero Limit privacy policy — how we collect, use, and protect your personal data.",
}

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-3xl">
      <div className="text-center mb-12">
        <p className="text-[11px] tracking-[0.4em] uppercase text-muted-foreground mb-3">Legal</p>
        <h1 className="text-4xl font-light mb-4">Privacy Policy</h1>
        <p className="text-sm text-muted-foreground">Last updated: August 2026</p>
      </div>

      <div className="space-y-8 text-sm text-muted-foreground leading-relaxed">
        <section>
          <h2 className="text-lg font-medium text-foreground mb-3">1. Information We Collect</h2>
          <p>We collect information you provide directly:</p>
          <ul className="mt-2 space-y-1">
            <li>Name, email address, and phone number when you create an account</li>
            <li>Shipping and billing addresses when you place an order</li>
            <li>Payment information (processed securely by Paystack — we never store card details)</li>
            <li>Reviews and feedback you submit</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-medium text-foreground mb-3">2. How We Use Your Information</h2>
          <p>We use your information to:</p>
          <ul className="mt-2 space-y-1">
            <li>Process and fulfill your orders</li>
            <li>Send order updates and delivery notifications</li>
            <li>Provide customer support</li>
            <li>Improve our products and services</li>
            <li>Send marketing communications (with your consent)</li>
            <li>Detect and prevent fraud</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-medium text-foreground mb-3">3. Data Sharing</h2>
          <p>
            We do not sell your personal information. We share data only with trusted service providers
            who help us operate our business:
          </p>
          <ul className="mt-2 space-y-1">
            <li>Supabase — for secure data storage and authentication</li>
            <li>Paystack — for payment processing</li>
            <li>Vercel — for website hosting</li>
            <li>Shipping carriers — to deliver your orders</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-medium text-foreground mb-3">4. Data Security</h2>
          <p>
            We implement industry-standard security measures to protect your personal data, including
            SSL encryption, secure authentication, and access controls. However, no method of
            transmission over the internet is 100% secure.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-medium text-foreground mb-3">5. Your Rights</h2>
          <p>You have the right to:</p>
          <ul className="mt-2 space-y-1">
            <li>Access the personal data we hold about you</li>
            <li>Request correction of inaccurate data</li>
            <li>Request deletion of your data</li>
            <li>Opt out of marketing communications</li>
            <li>Export your data in a portable format</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-medium text-foreground mb-3">6. Cookies</h2>
          <p>
            We use essential cookies to maintain your session and authentication. We do not use
            third-party tracking cookies. You can manage cookie preferences through your browser settings.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-medium text-foreground mb-3">7. Data Retention</h2>
          <p>
            We retain your personal data for as long as your account is active or as needed to provide
            services. Order data is retained for 7 years for legal and tax compliance.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-medium text-foreground mb-3">8. Contact Us</h2>
          <p>
            For privacy-related inquiries, contact us at{" "}
            <a href="mailto:zerolimitunlimited@gmail.com" className="text-foreground underline">
              zerolimitunlimited@gmail.com
            </a>
          </p>
        </section>
      </div>
    </div>
  )
}
