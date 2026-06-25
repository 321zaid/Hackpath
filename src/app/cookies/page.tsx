import Link from "next/link";
import Navbar from "@/components/Navbar";
import AnimatedLightRays from "@/components/AnimatedLightRays";

export default function CookiesPage() {
  return (
    <>
      <AnimatedLightRays />
      <Navbar />
      <main className="min-h-screen pt-28 px-4 pb-20">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-foreground font-mono mb-2">Cookie Policy</h1>
          <p className="text-xs text-[var(--color-gray-500)] font-mono mb-8">Last updated: June 2026</p>

          <div className="space-y-6 text-sm text-[var(--color-gray-300)] font-mono leading-relaxed">
            <section>
              <h2 className="text-lg font-semibold text-foreground mb-2">1. What Are Cookies</h2>
              <p>Cookies are small text files stored on your device by your web browser. CipherNest uses only essential cookies required for the Platform to function.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground mb-2">2. Cookies We Use</h2>
              <div className="overflow-x-auto mt-3">
                <table className="w-full text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-2 pr-4 text-foreground font-semibold">Cookie</th>
                      <th className="text-left py-2 pr-4 text-foreground font-semibold">Purpose</th>
                      <th className="text-left py-2 text-foreground font-semibold">Duration</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    <tr>
                      <td className="py-2 pr-4 font-mono">sb-*-auth-token</td>
                      <td className="py-2 pr-4">Supabase authentication session</td>
                      <td className="py-2">Session / Persistent</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4 font-mono">__Secure-sb-*-auth-token</td>
                      <td className="py-2 pr-4">Secure Supabase auth token (HTTPS)</td>
                      <td className="py-2">Session / Persistent</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4 font-mono">sb-*-refresh-token</td>
                      <td className="py-2 pr-4">Refresh token for session renewal</td>
                      <td className="py-2">Persistent</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="mt-3">These are strictly necessary cookies. The Platform cannot function without them.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground mb-2">3. No Tracking Cookies</h2>
              <p>We do <strong className="text-foreground">not</strong> use tracking cookies, analytics cookies, advertising cookies, or any third-party cookies for marketing purposes.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground mb-2">4. Managing Cookies</h2>
              <p>Most browsers allow you to control cookies through their settings. However, disabling essential cookies will prevent you from logging in and using the Platform.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground mb-2">5. Contact</h2>
              <p>For questions about this Cookie Policy, contact: <span className="text-accent">zaid123was@gmail.com</span></p>
            </section>
          </div>

          <div className="mt-10 pt-8 border-t border-border">
            <Link href="/privacy" className="text-accent text-sm font-mono hover:underline">Privacy Policy</Link>
            <span className="text-[var(--color-gray-600)] mx-3">|</span>
            <Link href="/terms" className="text-accent text-sm font-mono hover:underline">Terms of Service</Link>
          </div>
        </div>
      </main>
    </>
  );
}
