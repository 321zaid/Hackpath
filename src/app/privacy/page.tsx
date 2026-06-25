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
          <p className="text-xs text-[var(--color-gray-500)] font-mono mb-8">Last updated: June 2026</p>

          <div className="space-y-6 text-sm text-[var(--color-gray-300)] font-mono leading-relaxed">
            <section>
              <h2 className="text-lg font-semibold text-foreground mb-2">1. Information We Collect</h2>
              <p>We collect the following information when you use CipherNest:</p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li><strong className="text-foreground">Account Information:</strong> Email address, username, and password (processed securely via Supabase Auth)</li>
                <li><strong className="text-foreground">Progress Data:</strong> Completed lessons, labs, quizzes, XP, level, badges, and streak information</li>
                <li><strong className="text-foreground">Technical Data:</strong> IP address, browser type, and device information (collected automatically)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground mb-2">2. How We Store Your Data</h2>
              <p>Your data is stored securely using:</p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li><strong className="text-foreground">Supabase</strong> — PostgreSQL database with Row-Level Security. Your password is hashed and never stored in plaintext. The database is encrypted at rest.</li>
                <li><strong className="text-foreground">Cloudflare Workers</strong> — Serverless compute platform. No persistent data is stored on Cloudflare.</li>
                <li><strong className="text-foreground">Cloudflare CDN</strong> — Static assets are cached at edge locations for performance.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground mb-2">3. How We Use Your Data</h2>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>To provide and maintain your account and progress tracking</li>
                <li>To display the leaderboard (username and XP only)</li>
                <li>To improve the Platform and content</li>
                <li>To communicate account-related notices</li>
                <li>We do <strong className="text-foreground">not</strong> sell, rent, or share your personal data with third parties</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground mb-2">4. Cookies</h2>
              <p>We use essential cookies for authentication and session management via Supabase Auth. These cookies are necessary for the Platform to function. We do not use tracking cookies or third-party analytics cookies.</p>
              <p className="mt-2">See our <Link href="/cookies" className="text-accent hover:underline">Cookie Policy</Link> for more details.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground mb-2">5. Data Retention</h2>
              <p>We retain your account data for as long as your account is active. You may request deletion of your account and associated data at any time by contacting <span className="text-accent">zaid123was@gmail.com</span>. Data will be deleted within 30 days of a verified request.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground mb-2">6. Your Rights (GDPR / CCPA)</h2>
              <p>Depending on your jurisdiction, you may have the right to:</p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>Access the personal data we hold about you</li>
                <li>Request correction of inaccurate data</li>
                <li>Request deletion of your data</li>
                <li>Object to or restrict processing of your data</li>
                <li>Data portability</li>
              </ul>
              <p className="mt-2">To exercise these rights, contact <span className="text-accent">zaid123was@gmail.com</span>.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground mb-2">7. Third-Party Services</h2>
              <p>We use the following third-party services. Each has its own privacy policy:</p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li><Link href="https://supabase.com/privacy" className="text-accent hover:underline">Supabase Privacy Policy</Link> — database and authentication</li>
                <li><Link href="https://www.cloudflare.com/privacypolicy/" className="text-accent hover:underline">Cloudflare Privacy Policy</Link> — CDN and edge compute</li>
                <li><Link href="https://ai.google.dev/" className="text-accent hover:underline">Google AI (Gemini)</Link> — AI tutor feature (no personal data shared)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground mb-2">8. Children's Privacy</h2>
              <p>The Platform is not directed at children under 13. We do not knowingly collect personal information from children under 13. If you believe a child has provided us with personal data, contact us to have it removed.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground mb-2">9. Changes to This Policy</h2>
              <p>We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated date. Continued use of the Platform after changes constitutes acceptance of the updated policy.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground mb-2">10. Contact</h2>
              <p>For privacy-related inquiries, contact the data controller at: <span className="text-accent">zaid123was@gmail.com</span></p>
            </section>
          </div>

          <div className="mt-10 pt-8 border-t border-border">
            <Link href="/terms" className="text-accent text-sm font-mono hover:underline">Terms of Service</Link>
            <span className="text-[var(--color-gray-600)] mx-3">|</span>
            <Link href="/cookies" className="text-accent text-sm font-mono hover:underline">Cookie Policy</Link>
          </div>
        </div>
      </main>
    </>
  );
}
