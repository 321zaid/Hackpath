import Link from "next/link";
import Navbar from "@/components/Navbar";
import AnimatedLightRays from "@/components/AnimatedLightRays";

export default function TermsPage() {
  return (
    <>
      <AnimatedLightRays />
      <Navbar />
      <main className="min-h-screen pt-28 px-4 pb-20">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-foreground font-mono mb-2">Terms of Service</h1>
          <p className="text-xs text-[var(--color-gray-500)] font-mono mb-8">Last updated: June 2026</p>

          <div className="space-y-6 text-sm text-[var(--color-gray-300)] font-mono leading-relaxed">
            <section>
              <h2 className="text-lg font-semibold text-foreground mb-2">1. Acceptance of Terms</h2>
              <p>By accessing or using CipherNest ("the Platform"), you agree to be bound by these Terms of Service. If you do not agree, do not use the Platform.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground mb-2">2. Educational Purpose Only</h2>
              <p>CipherNest provides cybersecurity education for lawful, ethical purposes only. All labs, lessons, and exercises are simulated. You agree to:</p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>Only practice techniques on systems you own or have explicit written permission to test</li>
                <li>Not use any knowledge gained on the Platform for illegal activities</li>
                <li>Comply with all applicable local, national, and international laws</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground mb-2">3. User Accounts</h2>
              <p>You are responsible for maintaining the confidentiality of your account credentials. You must be at least 13 years of age to use the Platform. If you are under 18, you represent that you have parental or guardian consent.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground mb-2">4. Acceptable Use</h2>
              <p>You agree not to:</p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>Use the Platform for any illegal purpose</li>
                <li>Attempt to bypass security measures on the Platform</li>
                <li>Scrape, harvest, or collect user data without authorization</li>
                <li>Upload malicious code or attempt to compromise the Platform</li>
                <li>Impersonate any person or entity</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground mb-2">5. Limitation of Liability</h2>
              <p>CipherNest provides educational content on an &quot;as is&quot; basis. We make no warranties regarding the accuracy, completeness, or suitability of the content. In no event shall CipherNest be liable for any damages arising from the use or inability to use the Platform.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground mb-2">6. Account Termination</h2>
              <p>We reserve the right to suspend or terminate accounts that violate these Terms, engage in illegal activity, or misuse the Platform. Users may delete their own account at any time by contacting support.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground mb-2">7. Contact</h2>
              <p>For questions about these Terms, contact: <span className="text-accent">privacy@ciphernest.dev</span></p>
            </section>
          </div>

          <div className="mt-10 pt-8 border-t border-border">
            <Link href="/privacy" className="text-accent text-sm font-mono hover:underline">Privacy Policy</Link>
            <span className="text-[var(--color-gray-600)] mx-3">|</span>
            <Link href="/cookies" className="text-accent text-sm font-mono hover:underline">Cookie Policy</Link>
          </div>
        </div>
      </main>
    </>
  );
}
