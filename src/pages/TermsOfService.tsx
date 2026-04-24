import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const LAST_UPDATED = "24 April 2026";

export function TermsOfService() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <Button variant="ghost" asChild className="mb-4 -ml-2">
            <Link to="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </Button>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-foreground mb-3">
            Terms of Service
          </h1>
          <p className="text-muted-foreground text-sm">Last updated: {LAST_UPDATED}</p>
        </div>

        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-300 dark:border-amber-700/60 rounded-xl p-5 mb-8">
          <p className="text-sm font-semibold text-amber-900 dark:text-amber-200 mb-1">
            DRAFT — pending legal review
          </p>
          <p className="text-sm text-amber-800 dark:text-amber-300/90">
            These terms are a reasonable default draft for WhoopGO! and have not yet been
            reviewed by qualified legal counsel. They are published here to satisfy baseline
            platform requirements (e.g. OAuth consent screens) and will be revised before
            being relied upon as a definitive legal agreement.
          </p>
        </div>

        <div className="bg-card border border-border/60 rounded-2xl shadow-sm p-8 space-y-10 text-foreground/90">
          <section>
            <h2 className="text-2xl font-bold mb-4">1. Agreement to Terms</h2>
            <p className="leading-relaxed">
              By accessing or using the WhoopGO! website, mobile application, or related
              services (collectively, the &ldquo;Services&rdquo;), you agree to be bound by these
              Terms of Service. If you do not agree, you may not use the Services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">2. About Us</h2>
            <p className="leading-relaxed">
              WhoopGO! is operated by Aurora Capital B.V., a company incorporated under the
              laws of the Netherlands (the &ldquo;Company&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;). Our
              registered office address is &lt;address TBD&gt;, Amsterdam, Netherlands. You can
              contact us at <a className="text-[#E67E3C] hover:underline" href="mailto:support@whoopgo.app">support@whoopgo.app</a>.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">3. Description of Service</h2>
            <p className="leading-relaxed mb-3">
              WhoopGO! provides mobile data connectivity for travelers via embedded SIM
              (eSIM) profiles and, where applicable, physical SIM cards. eSIM provisioning
              and network access are delivered through third-party carrier partners.
            </p>
            <p className="leading-relaxed">
              We do not operate cellular networks ourselves. Coverage, speeds, and
              availability depend on our carrier partners and local network conditions.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">4. Eligibility & Accounts</h2>
            <p className="leading-relaxed mb-3">
              You must be at least 18 years old (or the age of majority in your
              jurisdiction) to purchase a plan. When you create an account, you agree to
              provide accurate information and to keep your login credentials secure. You
              are responsible for activity under your account.
            </p>
            <p className="leading-relaxed">
              Authentication is provided by Clerk, Inc. By creating an account you also
              accept Clerk&rsquo;s applicable terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">5. Purchases, Pricing & Payment</h2>
            <p className="leading-relaxed mb-3">
              Plan prices are shown at checkout in the currency indicated. Payments are
              processed by Stripe, Inc. By completing a purchase you authorize Stripe to
              charge your chosen payment method. We do not store full payment card details
              on our systems.
            </p>
            <p className="leading-relaxed">
              Taxes may apply based on your billing address. Prices and available plans may
              change without notice; changes do not affect orders already placed.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">6. eSIM Delivery & Activation</h2>
            <p className="leading-relaxed">
              After a successful purchase you will receive activation details (typically a
              QR code and/or manual activation instructions) by email and in your WhoopGO!
              account. eSIM profiles are tied to a specific device and, once installed or
              activated, may not be transferable. It is your responsibility to confirm that
              your device is eSIM-capable and carrier-unlocked before purchasing.
            </p>
          </section>

          <section id="refunds">
            <h2 className="text-2xl font-bold mb-4">7. Refunds & Cancellations</h2>
            <p className="leading-relaxed mb-3">
              Because eSIM data plans are digital goods that begin delivery immediately on
              purchase, they are generally non-refundable once the eSIM has been installed,
              activated, or partially consumed. Where required by Dutch and EU consumer law,
              you may have a statutory right of withdrawal; where applicable you may lose
              that right by expressly consenting to immediate performance at checkout.
            </p>
            <p className="leading-relaxed">
              If your eSIM does not work due to a technical issue on our side, contact
              support@whoopgo.app within 30 days of purchase and we will work in good faith
              to provide a replacement or refund.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">8. Acceptable Use</h2>
            <p className="leading-relaxed mb-3">You agree not to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Use the Services for any unlawful purpose or in violation of carrier terms.</li>
              <li>Resell, sublicense, or redistribute eSIM profiles without our written permission.</li>
              <li>Attempt to reverse engineer, disrupt, or gain unauthorized access to the Services.</li>
              <li>Send spam, malware, or fraudulent traffic over the network.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">9. Intellectual Property</h2>
            <p className="leading-relaxed">
              The WhoopGO! name, logo, website, and all related content are owned by Aurora
              Capital B.V. or its licensors and are protected by applicable intellectual
              property laws. You are granted a limited, non-exclusive, non-transferable
              license to use the Services for personal, non-commercial purposes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">10. Disclaimers</h2>
            <p className="leading-relaxed">
              The Services are provided on an &ldquo;as is&rdquo; and &ldquo;as available&rdquo; basis. We do not
              warrant uninterrupted coverage, specific data speeds, or service availability
              in any particular location. To the maximum extent permitted by law, we
              disclaim all implied warranties, including merchantability and fitness for a
              particular purpose.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">11. Limitation of Liability</h2>
            <p className="leading-relaxed">
              To the maximum extent permitted by law, our aggregate liability for any claim
              arising out of or relating to the Services is limited to the amount you paid
              us for the specific plan giving rise to the claim in the 12 months preceding
              the event. We are not liable for indirect, incidental, consequential, or
              punitive damages, including lost profits, lost data, or loss of goodwill.
              Nothing in these terms limits liability that cannot be limited under Dutch or
              EU mandatory law.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">12. Termination</h2>
            <p className="leading-relaxed">
              You may stop using the Services at any time. We may suspend or terminate your
              account if you breach these terms, if required by a carrier partner, or if we
              reasonably believe your use poses a security, legal, or fraud risk. Unused
              plan balances may be forfeited in cases of material breach.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">13. Changes to the Services & Terms</h2>
            <p className="leading-relaxed">
              We may update the Services and these terms from time to time. Material
              changes will be communicated by updating the &ldquo;Last updated&rdquo; date above and,
              where appropriate, by notice in the product or by email. Continued use after
              changes take effect constitutes acceptance.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">14. Governing Law & Disputes</h2>
            <p className="leading-relaxed">
              These terms are governed by the laws of the Netherlands, excluding its
              conflict-of-law rules. Any dispute will be submitted to the competent courts
              of Amsterdam, the Netherlands, unless mandatory consumer-protection law grants
              you the right to bring proceedings in another forum. Consumers in the EU may
              also access the European Commission&rsquo;s Online Dispute Resolution platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">15. Contact</h2>
            <p className="leading-relaxed">
              Questions about these terms? Email{" "}
              <a className="text-[#E67E3C] hover:underline" href="mailto:support@whoopgo.app">
                support@whoopgo.app
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

export default TermsOfService;
