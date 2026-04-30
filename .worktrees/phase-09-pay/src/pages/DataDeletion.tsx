import { ArrowLeft, Mail, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const LAST_UPDATED = "24 April 2026";
const DELETION_MAILTO =
  "mailto:support@whoopgo.app?subject=Data%20Deletion%20Request%20%E2%80%94%20%3Cyour%20email%3E&body=Hi%20WhoopGO%21%20team%2C%0A%0AI%20would%20like%20to%20request%20full%20deletion%20of%20my%20account%20and%20associated%20personal%20data.%0A%0AAccount%20email%3A%20%3Cyour%20email%3E%0A%0AThanks.";

export function DataDeletion() {
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
            Data Deletion Request
          </h1>
          <p className="text-muted-foreground text-sm">Last updated: {LAST_UPDATED}</p>
        </div>

        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-300 dark:border-amber-700/60 rounded-xl p-5 mb-8">
          <p className="text-sm font-semibold text-amber-900 dark:text-amber-200 mb-1">
            DRAFT — pending Hong Kong legal review
          </p>
          <p className="text-sm text-amber-800 dark:text-amber-300/90">
            This notice is a reasonable default draft and has not yet been reviewed by
            qualified Hong Kong legal counsel. It is published to satisfy platform
            requirements (e.g. Facebook Login&rsquo;s Data Deletion URL) and will be revised
            before being relied upon as a definitive data-processing notice.
          </p>
        </div>

        <div className="bg-card border border-border/60 rounded-2xl shadow-sm p-8 space-y-10 text-foreground/90">
          <section>
            <h2 className="text-2xl font-bold mb-4">1. How to Request Deletion</h2>
            <p className="leading-relaxed mb-4">
              You can request permanent deletion of your WhoopGO! account and the personal
              data we hold about you at any time. We offer two routes:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-6">
              <li>
                <strong>Email us</strong> at{" "}
                <a className="text-[#E67E3C] hover:underline" href="mailto:support@whoopgo.app">
                  support@whoopgo.app
                </a>{" "}
                with the subject line{" "}
                <code className="bg-muted px-1.5 py-0.5 rounded text-sm">
                  Data Deletion Request &mdash; &lt;your email&gt;
                </code>
                . Please send the email from the address associated with your account so
                we can verify ownership.
              </li>
              <li>
                <strong>Use the in-app button.</strong> If you are signed in, open your{" "}
                <Link to="/account" className="text-[#E67E3C] hover:underline">
                  Account page
                </Link>{" "}
                and press &ldquo;Delete my account&rdquo;. This triggers the same deletion
                workflow.
              </li>
            </ul>
            <Button asChild className="bg-[#E67E3C] hover:bg-[#D86E2C] text-white">
              <a href={DELETION_MAILTO}>
                <Mail className="h-4 w-4 mr-2" />
                Email a Deletion Request
              </a>
            </Button>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">2. What Gets Deleted</h2>
            <p className="leading-relaxed mb-3">
              On a verified deletion request, we will permanently delete or irreversibly
              anonymise:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Profile data</strong> &mdash; your Clerk account, name, email address,
                authentication identifiers, and any third-party login tokens (e.g. Facebook,
                Google, Apple).
              </li>
              <li>
                <strong>Order history</strong> &mdash; purchase records not required for
                statutory retention (see next section).
              </li>
              <li>
                <strong>eSIM provisioning data</strong> &mdash; activation codes, ICCID,
                device identifiers shared with us, and any supplier-side references (Airalo)
                tied to your account.
              </li>
              <li>
                <strong>Support correspondence</strong> &mdash; messages you sent us,
                subject to a short grace window for dispute resolution.
              </li>
              <li>
                <strong>Marketing &amp; analytics identifiers</strong> &mdash; Klaviyo,
                PostHog, and any cookie-based identifiers we can map back to your account.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">3. What We Must Retain</h2>
            <p className="leading-relaxed">
              Hong Kong law (the Inland Revenue Ordinance and the Companies Ordinance)
              requires us to keep certain tax, accounting, and audit records for at least
              <strong> 7 years</strong>. These records may include transaction amounts,
              invoice numbers, and the fact that a purchase occurred. Where legally
              possible we will minimise or pseudonymise the personal identifiers in these
              records. We may also retain minimal data needed to prevent fraud or to
              comply with a lawful request from a regulator or law-enforcement body.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">4. Timeline</h2>
            <p className="leading-relaxed">
              We aim to acknowledge deletion requests within <strong>7 days</strong> and
              complete them within <strong>30 days</strong> of verification. If the
              request is particularly complex we may extend this window and will tell you
              the reason. Once deletion is complete we will email you a confirmation at
              the address we previously held on file.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">5. Your Rights</h2>
            <p className="leading-relaxed mb-3">
              Under the Hong Kong Personal Data (Privacy) Ordinance (PDPO, Cap. 486) you
              have the right to request access to, and correction of, personal data we
              hold about you. If you are located in the European Economic Area or the
              United Kingdom, the GDPR and UK GDPR additionally give you the right to
              erasure (&ldquo;right to be forgotten&rdquo;), restriction of processing, data
              portability, and the right to withdraw consent at any time. These rights are
              subject to the statutory retention duties described above.
            </p>
            <p className="leading-relaxed">
              For broader detail see our{" "}
              <Link to="/privacy" className="text-[#E67E3C] hover:underline">
                Privacy Policy
              </Link>
              .
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">6. Questions</h2>
            <p className="leading-relaxed">
              <Trash2 className="inline h-4 w-4 mr-1 text-[#E67E3C]" />
              Any questions about this process? Email{" "}
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

export default DataDeletion;
