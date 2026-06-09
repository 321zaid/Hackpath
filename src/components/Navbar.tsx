"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useRef, useCallback, useEffect } from "react";
import { Menu, X, Terminal, Home, Compass, Trophy, User, LayoutDashboard, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import ThemeToggle from "./ThemeToggle";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/roadmap", label: "Roadmap", icon: Compass },
  { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
  { href: "/profile", label: "Profile", icon: User },
];

const authPages = ["/login", "/signup"];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [hoveredHref, setHoveredHref] = useState<string | null>(null);
  const [session, setSession] = useState<boolean | null>(null);
  const pathname = usePathname();
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data }) => {
      setSession(!!data.session);
    });
  }, []);

  const isAuthPage = authPages.includes(pathname);
  if (isAuthPage) return null;

  const activeHref = pathname === "/" ? "/" : `/${pathname.split("/")[1]}`;
  const pillHref = hoveredHref ?? activeHref;

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setSession(false);
    router.push("/");
  };

  const getPillRect = useCallback(() => {
    if (!pillHref || !containerRef.current) return null;
    const link = containerRef.current.querySelector<HTMLElement>(
      `[data-nav="${pillHref}"]`
    );
    if (!link) return null;
    const cr = containerRef.current.getBoundingClientRect();
    const lr = link.getBoundingClientRect();
    return {
      left: lr.left - cr.left,
      width: lr.width,
      top: lr.top - cr.top,
      height: lr.height,
    };
  }, [pillHref]);

  const pillRect = getPillRect();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 group">
            <motion.div
              whileHover={{ rotate: -10, scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Terminal className="w-6 h-6 text-white" />
            </motion.div>
            <span className="text-xl font-bold text-white font-mono tracking-wider">
              HackPath
            </span>
          </Link>

          <div
            ref={containerRef}
            className="hidden md:flex items-center relative"
            onMouseLeave={() => setHoveredHref(null)}
          >
            <AnimatePresence>
              {pillHref && pillRect && (
                <motion.div
                  key="nav-pill"
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: 1,
                    left: pillRect.left,
                    width: pillRect.width,
                    top: pillRect.top,
                    height: pillRect.height,
                  }}
                  exit={{ opacity: 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 30,
                    opacity: { duration: 0.15 },
                  }}
                  className="absolute bg-white rounded-full"
                />
              )}
            </AnimatePresence>

            {navItems.map((item) => {
              const isPillActive = pillHref === item.href;

              return (
                <Link
                  key={item.href}
                  data-nav={item.href}
                  href={item.href}
                  onMouseEnter={() => setHoveredHref(item.href)}
                  onFocus={() => setHoveredHref(item.href)}
                  className="relative px-3 py-2 text-sm font-mono outline-none z-10"
                >
                  <motion.span
                    whileTap={{ scale: 0.95 }}
                    className={cn(
                      "relative z-10 flex items-center gap-1.5 transition-colors duration-150",
                      isPillActive ? "text-black" : "text-white/80 hover:text-white"
                    )}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </motion.span>
                </Link>
              );
            })}
            {session ? (
              <button
                onClick={handleLogout}
                className="ml-2 px-3 py-2 text-sm font-mono text-white/80 hover:text-white flex items-center gap-1.5 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            ) : (
              <Link
                href="/login"
                className="ml-2 px-3 py-2 text-sm font-mono text-white/80 hover:text-white flex items-center gap-1.5 transition-colors"
              >
                <User className="w-4 h-4" />
                Login
              </Link>
            )}
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setOpen(!open)}
              className="md:hidden p-2 text-white/70 hover:text-white"
              aria-label="Toggle menu"
            >
              {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-white/10 bg-black overflow-hidden"
          >
            <div className="px-4 py-3 space-y-1">
              {navItems.map((item) => {
                const isActive = activeHref === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2 text-sm font-mono rounded-md transition-colors",
                      isActive
                        ? "bg-white text-black"
                        : "text-white/60 hover:text-white hover:bg-white/10"
                    )}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                );
              })}
              {session ? (
                <button
                  onClick={() => { setOpen(false); handleLogout(); }}
                  className="flex items-center gap-2 px-3 py-2 text-sm font-mono rounded-md text-white/60 hover:text-white hover:bg-white/10 w-full"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-sm font-mono rounded-md text-white/60 hover:text-white hover:bg-white/10"
                >
                  <User className="w-4 h-4" />
                  Login
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
