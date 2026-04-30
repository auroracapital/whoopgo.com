import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const LAST_UPDATED = "24 April 2026";

export function PrivacyPolicy() {
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
            Privacy Policy
          </h1>
          <p className="text-muted-foreground text-sm">Last updated: {LAST_UPDATED}</p>
        </div>

        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-300 dark:border-amber-700/60 rounded-xl p-5 mb-8">
          <p className="text-sm font-semibold text-amber-900 dark:text-amber-200 mb-1">
            DRAFT — pending legal review
          </p>
          <p className="text-sm text-amber-800 dark:text-amber-300/90">
            This policy is a reasonable default draft for WhoopGO! and has not yet been
            reviewed by qualified legal counsel. It is published here to satisfy baseline
            platform requirements (e.g. OAuth consent screens) and will be revised before
            being relied upon as a definitive data-processing notice.
          </p>
        </div>

        <div className="bg-card border border-border/60 rounded-2xl shadow-sm p-8 space-y-10 text-foreground/90">
          <section>
            <h2 className="text-2xl font-bold mb-4">1. Who We Are</h2>
            <p className="leading-relaxed">
              WhoopGO! is operated by Aurora Capital B.V., incorporated in the Netherlands
              (the &ldquo;Company&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;). We are the data controller for personal
              data processed through our website, mobile application, and services.
              Registered office: &lt;address TBD&gt;, Amsterdam, Netherlands. Contact:{" "}
              <a className="text-[#E67E3C] hover:underline" href="mailto:support@whoopgo.app">
                support@whoopgo.app
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">2. Scope</h2>
            <p className="leading-relaxed">
              This policy explains what personal data we collect when you visit our
              website, create an account, or purchase an eSIM plan, how we use it, who we
              share it with, and the rights you have under the EU General Data Protection
              Regulation (GDPR) and the Dutch implementing legislation.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">3. Data We Collect</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Account data:</strong> name, email address, and authentication
                identifiers, provided via Clerk.
              </li>
              <li>
                <strong>Payment data:</strong> transaction metadata (amount, currency, plan
                purchased) returned by Stripe. Full card numbers are entered directly into
                Stripe and are not stored on our servers.
              </li>
              <li>
                <strong>eSIM provisioning data:</strong> activation codes, ICCID, and —
                where you choose to share them — device identifiers such as the IMEI,
                returned to us by our eSIM supplier (Airalo) so the eSIM profile can be
                delivered and supported.
              </li>
              <li>
                <strong>Support correspondence:</strong> messages you send us via the
                contact form or email.
              </li>
              <li>
                <strong>Technical data:</strong> IP address, browser and device type,
                referring URL, and basic analytics events. Used for security and product
                improvement.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">4. How We Use Data (Legal Bases)</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>To perform our contract with you</strong> — creating your account,
                processing payments, delivering your eSIM, and providing support.
              </li>
              <li>
                <strong>To comply with legal obligations</strong> — tax, accounting, and
                applicable telecoms and consumer-protection rules.
              </li>
              <li>
                <strong>For our legitimate interests</strong> — fraud prevention, network
                abuse prevention, product analytics, and securing our systems.
              </li>
              <li>
                <strong>With your consent</strong> — for optional marketing emails and
                non-essential cookies, where we ask for opt-in.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">5. Cookies & Similar Technologies</h2>
            <p className="leading-relaxed mb-3">We use a small number of cookies and local-storage items, including:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Authentication session</strong> (Clerk) — strictly necessary to keep
                you signed in.
              </li>
              <li>
                <strong>Theme preference</strong> (local storage) — remembers your light or
                dark mode selection.
              </li>
              <li>
                <strong>Analytics</strong> — if enabled, used in aggregate to understand
                product usage. We do not sell your data to advertisers.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">6. Who We Share Data With</h2>
            <p className="leading-relaxed mb-3">
              We share personal data only with service providers acting as processors on
              our behalf, bound by data-processing agreements:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Clerk, Inc.</strong> — authentication and account management.</li>
              <li><strong>Stripe, Inc.</strong> — payment processing.</li>
              <li><strong>Airalo</strong> — eSIM profile provisioning and carrier fulfilment.</li>
              <li>
                <strong>Infrastructure &amp; email providers</strong> — hosting, transactional
                email, and error monitoring services used to operate the website and
                deliver order confirmations.
              </li>
            </ul>
            <p className="leading-relaxed mt-3">
              We may also disclose data where required by law or to protect our rights.
              Some of these providers may process data outside the European Economic Area;
              where they do, we rely on appropriate safeguards such as the European
              Commission&rsquo;s Standard Contractual Clauses.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">7. Data Retention</h2>
            <p className="leading-relaxed">
              We retain account and transaction records for as long as your account is
              active and for a reasonable period afterwards to comply with tax and
              accounting obligations (typically up to 7 years under Dutch law). eSIM
              provisioning data is retained for as long as needed to support the plan and
              handle any disputes. Support correspondence is retained for up to 3 years.
              Marketing data is deleted when you unsubscribe.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">8. Your Rights</h2>
            <p className="leading-relaxed mb-3">
              Under the GDPR you have the right to:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Access the personal data we hold about you.</li>
              <li>Have inaccurate data rectified.</li>
              <li>Have your data erased (&ldquo;right to be forgotten&rdquo;), subject to legal retention duties.</li>
              <li>Restrict or object to certain processing.</li>
              <li>Receive your data in a portable, machine-readable format.</li>
              <li>Withdraw consent at any time where processing is based on consent.</li>
              <li>
                Lodge a complaint with the Dutch Data Protection Authority (Autoriteit
                Persoonsgegevens, <a className="text-[#E67E3C] hover:underline" href="https://www.autoriteitpersoonsgegevens.nl" target="_blank" rel="noreferrer">autoriteitpersoonsgegevens.nl</a>)
                or your local supervisory authority.
              </li>
            </ul>
            <p className="leading-relaxed mt-3">
              To exercise any of these rights, email{" "}
              <a className="text-[#E67E3C] hover:underline" href="mailto:support@whoopgo.app">
                support@whoopgo.app
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">9. Security</h2>
            <p className="leading-relaxed">
              We use industry-standard technical and organisational measures such as
              encryption in transit (TLS), access controls, and logging to protect personal
              data. No method of transmission or storage is perfectly secure, and we cannot
              guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">10. Children</h2>
            <p className="leading-relaxed">
              The Services are not directed to children under 16. We do not knowingly
              collect data from children. If you believe a child has provided us with data,
              contact us and we will delete it.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">11. Changes to this Policy</h2>
            <p className="leading-relaxed">
              We may update this policy from time to time. Material changes will be
              communicated by updating the &ldquo;Last updated&rdquo; date above and, where
              appropriate, by in-product or email notice.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">12. Contact</h2>
            <p className="leading-relaxed">
              Questions about this policy? Email{" "}
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

export default PrivacyPolicy;
