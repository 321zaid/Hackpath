import Link from "next/link";
import Navbar from "@/components/Navbar";
import AnimatedLightRays from "@/components/AnimatedLightRays";

export default function PrivacyPage() {
  return (
    <>
      <AnimatedLightRays />
      <Navbar />
      <main className="min-h-screen pt-28 px-4 pb-20">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-foreground font-mono mb-2">Privacy Policy</h1>
          <p className="text-xs text-[var(--color-gray-500)] font-mono mb-8">Effective Date: June 25, 2025 &mdash; Last Updated: June 25, 2025</p>

          <div className="space-y-6 text-sm text-[var(--color-gray-300)] font-mono leading-relaxed">
            <section>
              <p>CipherNest (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) is an educational cybersecurity platform operated from Sri Lanka. This Privacy Policy explains what personal data we collect, how we use it, who we share it with, and what rights you have. By using CipherNest, you agree to the practices described here.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground mb-2">1. Who We Are</h2>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong className="text-foreground">Platform:</strong> CipherNest</li>
                <li><strong className="text-foreground">Website:</strong> ciphernest.ciphernest.workers.dev</li>
                <li><strong className="text-foreground">Based in:</strong> Sri Lanka</li>
                <li><strong className="text-foreground">Applicable Law:</strong> Personal Data Protection Act (PDPA) of Sri Lanka; GDPR for EU/UK users; COPPA for US users under 13.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground mb-2">2. Data We Collect</h2>
              <p>We collect only what is necessary to provide and improve the platform.</p>

              <h3 className="text-md font-semibold text-foreground mt-3 mb-1">Account Data</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Email address (required to create an account)</li>
                <li>Username / display name (chosen by you)</li>
                <li>Password (stored as a secure hash — we never see your plain-text password)</li>
              </ul>

              <h3 className="text-md font-semibold text-foreground mt-3 mb-1">Learning &amp; Progress Data</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Lessons completed, quiz scores, XP earned, and badges unlocked</li>
                <li>Lab activity and time spent in simulated environments</li>
              </ul>

              <h3 className="text-md font-semibold text-foreground mt-3 mb-1">Technical Data</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>IP address and approximate location (country/region)</li>
                <li>Browser type, device type, and operating system</li>
                <li>Pages visited, session duration, and click events</li>
              </ul>

              <h3 className="text-md font-semibold text-foreground mt-3 mb-1">Analytics &amp; Advertising Data</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Usage patterns collected via third-party analytics tools</li>
                <li>Ad interaction data collected via advertising partners (see Section 5)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground mb-2">3. How We Use Your Data</h2>
              <ul className="list-disc pl-5 space-y-1">
                <li>To create and manage your account and authenticate you securely</li>
                <li>To track and display your learning progress, XP, badges, and leaderboard rank</li>
                <li>To send transactional emails (account confirmation, password reset)</li>
                <li>To analyse platform usage and improve content and features</li>
                <li>To display relevant advertisements that help fund the free platform</li>
                <li>To detect and prevent fraud, abuse, or security threats</li>
                <li>To comply with applicable legal obligations</li>
              </ul>
              <p className="mt-2">We do <strong className="text-foreground">not</strong> sell your personal data to third parties.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground mb-2">4. Legal Basis for Processing (GDPR)</h2>
              <p>If you are located in the European Economic Area (EEA) or United Kingdom, our legal bases are:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong className="text-foreground">Contract</strong> — processing your account data to provide the service you signed up for</li>
                <li><strong className="text-foreground">Legitimate Interests</strong> — platform security, fraud prevention, and service improvement</li>
                <li><strong className="text-foreground">Consent</strong> — analytics and advertising cookies (you can withdraw at any time)</li>
                <li><strong className="text-foreground">Legal Obligation</strong> — complying with applicable laws</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground mb-2">5. Third-Party Services We Use</h2>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong className="text-foreground">Supabase</strong> (database &amp; authentication) — Stores your account data and learning progress. <Link href="https://supabase.com/privacy" className="text-accent hover:underline">Privacy Policy</Link></li>
                <li><strong className="text-foreground">Cloudflare</strong> (hosting &amp; security) — Serves the platform and provides DDoS protection. Cloudflare may process technical data such as IP addresses. <Link href="https://www.cloudflare.com/privacypolicy/" className="text-accent hover:underline">Privacy Policy</Link></li>
                <li><strong className="text-foreground">Cloudflare Analytics</strong> — We use Cloudflare Web Analytics to understand how users interact with CipherNest. This privacy-preserving analytics tool does not use cookies or track individual visitors across sessions. No personal data is collected.</li>
                <li><strong className="text-foreground">Advertising Partners</strong> — We display ads to support the free platform. Our advertising partners may use cookies, web beacons, or device identifiers to show relevant ads and measure performance. You may opt out of personalised advertising via your browser settings or industry opt-out tools such as <Link href="https://optout.aboutads.info" className="text-accent hover:underline">optout.aboutads.info</Link>.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground mb-2">6. Cookies &amp; Tracking</h2>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong className="text-foreground">Essential Cookies</strong> — required for authentication and session management. Cannot be disabled.</li>
                <li><strong className="text-foreground">Analytics Cookies</strong> — help us understand platform usage. You can opt out via your browser settings.</li>
                <li><strong className="text-foreground">Advertising Cookies</strong> — set by our ad partners to show relevant ads and measure performance.</li>
              </ul>
              <p className="mt-2">For EU/UK users, we will request your consent before placing non-essential cookies.</p>
              <p className="mt-1">See our <Link href="/cookies" className="text-accent hover:underline">Cookie Policy</Link> for more details.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground mb-2">7. Data Retention</h2>
              <ul className="list-disc pl-5 space-y-1">
                <li>Account and progress data is retained for as long as your account is active</li>
                <li>When you delete your account, your personal data is permanently deleted within 30 days</li>
                <li>Server logs (IP addresses, access records) are retained for up to 90 days for security purposes</li>
                <li>Anonymised, aggregated analytics data may be retained indefinitely</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground mb-2">8. Minimum Age</h2>
              <p>CipherNest is intended for users aged 13 and above. We do not knowingly collect personal data from children under 13. If we become aware that a child under 13 has created an account, we will delete the account and associated data promptly.</p>
              <p className="mt-2">If you are under 18, please ensure a parent or guardian has reviewed this policy and consents to your use of the platform.</p>
              <p className="mt-2"><strong className="text-foreground">COPPA Notice (US users):</strong> If you are a US resident under 13, you may not use CipherNest. Parents who believe their child has registered should contact us immediately at <span className="text-accent">privacy@ciphernest.dev</span>.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground mb-2">9. Your Rights</h2>
              <p>Depending on your location, you may have the following rights:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong className="text-foreground">Access</strong> — request a copy of the personal data we hold about you</li>
                <li><strong className="text-foreground">Correction</strong> — request that inaccurate data be corrected</li>
                <li><strong className="text-foreground">Deletion</strong> — delete your account directly in the app under Profile &gt; Settings, or contact us</li>
                <li><strong className="text-foreground">Portability</strong> — request your data in a machine-readable format (EU/UK users)</li>
                <li><strong className="text-foreground">Objection</strong> — object to processing based on legitimate interests</li>
                <li><strong className="text-foreground">Withdraw Consent</strong> — withdraw consent for analytics or advertising cookies at any time</li>
              </ul>
              <p className="mt-2">To exercise any right, contact us at <span className="text-accent">privacy@ciphernest.dev</span>. We will respond within 30 days.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground mb-2">10. Data Security</h2>
              <p>We take reasonable technical and organisational measures to protect your data, including:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>All data in transit is encrypted via HTTPS/TLS</li>
                <li>Passwords are stored using industry-standard hashing (handled by Supabase Auth)</li>
                <li>Database access is restricted using Row Level Security (RLS) policies</li>
                <li>Cloudflare provides DDoS protection and edge security</li>
              </ul>
              <p className="mt-2">No system is 100% secure. In the event of a data breach affecting your rights, we will notify affected users and relevant authorities as required by law.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground mb-2">11. International Data Transfers</h2>
              <p>CipherNest is operated from Sri Lanka. Your data may be processed by our service providers (Supabase, Cloudflare) in data centres located outside Sri Lanka, including in the United States and European Union. Where required by law, we ensure appropriate safeguards are in place for such transfers.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground mb-2">12. Changes to This Policy</h2>
              <p>We may update this Privacy Policy from time to time. When we make material changes, we will update the &quot;Last Updated&quot; date at the top of this page and, where appropriate, notify you by email. Continued use of CipherNest after changes are posted constitutes acceptance of the revised policy.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground mb-2">Contact Us</h2>
              <p>For privacy requests, questions, or concerns about this policy, please contact us:</p>
              <p className="mt-1">Email: <span className="text-accent">privacy@ciphernest.dev</span></p>
              <p>We aim to respond to all privacy requests within 30 days.</p>
            </section>
          </div>

          <div className="mt-10 pt-8 border-t border-border">
            <p className="text-xs text-[var(--color-gray-600)] font-mono">&copy; 2025 CipherNest. All rights reserved.</p>
            <div className="mt-3">
              <Link href="/terms" className="text-accent text-sm font-mono hover:underline">Terms of Service</Link>
              <span className="text-[var(--color-gray-600)] mx-3">|</span>
              <Link href="/cookies" className="text-accent text-sm font-mono hover:underline">Cookie Policy</Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
