"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Terminal, Eye, EyeOff } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import CyberButton from "@/components/CyberButton";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { username },
        },
      });

      if (error) {
        setError(error.message);
        setLoading(false);
      } else if (data.user?.identities?.length === 0) {
        setError("An account with this email already exists.");
        setLoading(false);
      } else {
        if (data.session && data.user) {
          await supabase.from("profiles").upsert({
            id: data.user.id,
            username,
          });

          await supabase.from("user_progress").upsert({
            user_id: data.user.id,
          });
        }
        router.push("/login?message=Check your email to confirm your account");
      }
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-4 bg-background">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-sm"
      >
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <Terminal className="w-6 h-6 text-accent" />
            <span className="text-xl font-bold text-foreground font-mono">HackPath</span>
          </Link>
          <h1 className="text-2xl font-bold font-mono text-foreground">Create account</h1>
          <p className="text-sm text-[var(--color-gray-500)] font-mono mt-1">Start your hacking journey</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-[var(--color-gray-400)] mb-1.5">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="cyber_ninja"
              required
              minLength={3}
              suppressHydrationWarning
              className="w-full bg-surface border border-border rounded-lg px-3 py-2.5 text-sm font-mono text-foreground outline-none focus:border-accent transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-[var(--color-gray-400)] mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              suppressHydrationWarning
              className="w-full bg-surface border border-border rounded-lg px-3 py-2.5 text-sm font-mono text-foreground outline-none focus:border-accent transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-[var(--color-gray-400)] mb-1.5">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                suppressHydrationWarning
                className="w-full bg-surface border border-border rounded-lg px-3 py-2.5 pr-10 text-sm font-mono text-foreground outline-none focus:border-accent transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                suppressHydrationWarning
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-gray-500)] hover:text-[var(--color-gray-300)]"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm text-red-400 font-mono"
            >
              {error}
            </motion.p>
          )}

          <CyberButton variant="primary" type="submit" disabled={loading} className="w-full justify-center">
            {loading ? "Creating account..." : "Create Account"}
          </CyberButton>
        </form>

        <p className="text-center text-sm text-[var(--color-gray-500)] font-mono mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-accent hover:underline">
            Sign in
          </Link>
        </p>
      </motion.div>
    </main>
  );
}
