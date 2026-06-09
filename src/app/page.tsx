"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Terminal, ArrowRight, BookOpen, Beaker, Award, Shield, Users, Sparkles, Target } from "lucide-react";
import Navbar from "@/components/Navbar";
import AnimatedLightRays from "@/components/AnimatedLightRays";
import BlindsTextReveal from "@/components/BlindsTextReveal";
import CyberButton from "@/components/CyberButton";
import ParallaxSection from "@/components/ParallaxSection";
import ScrollReveal from "@/components/ScrollReveal";
import AnimatedGridBackground from "@/components/AnimatedGridBackground";

const ease = [0.16, 1, 0.3, 1] as const;

const features = [
  {
    icon: BookOpen,
    title: "12-Week Roadmap",
    description: "Structured curriculum from Linux basics to full penetration testing.",
    color: "from-[#00FF41]/20 to-transparent",
  },
  {
    icon: Beaker,
    title: "Simulated Labs",
    description: "Practice in safe, sandboxed terminal environments.",
    color: "from-[#00BFFF]/20 to-transparent",
  },
  {
    icon: Award,
    title: "XP & Badges",
    description: "Earn experience points, level up, and collect achievement badges.",
    color: "from-[#FFD700]/20 to-transparent",
  },
  {
    icon: Users,
    title: "Beginner-Friendly",
    description: "No prior experience needed. Start from zero.",
    color: "from-[#FF6B6B]/20 to-transparent",
  },
  {
    icon: Shield,
    title: "Safe Ethical Practice",
    description: "All labs are simulated. Learn without breaking the law.",
    color: "from-[#00FF88]/20 to-transparent",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12 },
  },
};

const sectionVariants = {
  hidden: { opacity: 0, y: 60, scale: 0.97, filter: "blur(4px)" },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease },
  },
};

export default function HomePage() {
  return (
    <>
      <AnimatedGridBackground />
      <Navbar />
      <main className="min-h-screen">
        <section className="relative pt-32 pb-20 px-4 overflow-hidden">
          <AnimatedLightRays />
          <ParallaxSection speed={0.08} direction="up">
            <div className="max-w-5xl mx-auto text-center relative z-10">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease }}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, filter: "blur(4px)" }}
                  animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                  transition={{ delay: 0.2, duration: 0.6, ease }}
                  className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 border border-accent/30 bg-accent-dim rounded-full"
                >
                  <Sparkles className="w-4 h-4 text-accent" />
                  <span className="text-xs text-accent font-mono tracking-widest uppercase">
                    Interactive Cybersecurity Platform
                  </span>
                </motion.div>

                <div className="mb-6">
                  <BlindsTextReveal
                    text="HackPath"
                    className="text-5xl sm:text-7xl md:text-8xl font-bold"
                    stagger={0.06}
                    delay={0.4}
                  />
                </div>

                <motion.p
                  initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{ delay: 1.2, duration: 0.7, ease }}
                  className="text-lg sm:text-xl text-[var(--color-gray-400)] font-mono mb-10 max-w-2xl mx-auto leading-relaxed"
                >
                  Master ethical hacking in{" "}
                  <span className="text-accent">12 structured weeks</span>.
                  <br />
                  Interactive lessons, simulated labs, and gamified learning.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.4, duration: 0.6, ease }}
                  className="flex items-center justify-center gap-4 flex-wrap"
                >
                  <Link href="/dashboard">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.96 }}
                      transition={{ duration: 0.6, ease }}
                    >
                      <CyberButton variant="primary" size="lg" icon={<ArrowRight className="w-4 h-4" />}>
                        Start Learning Free
                      </CyberButton>
                    </motion.div>
                  </Link>
                  <Link href="/roadmap">
                    <motion.div
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.96 }}
                      transition={{ duration: 0.6, ease }}
                    >
                      <CyberButton variant="secondary" size="lg">
                        View Roadmap
                      </CyberButton>
                    </motion.div>
                  </Link>
                </motion.div>
              </motion.div>
            </div>
          </ParallaxSection>
        </section>

        <ParallaxSection speed={0.1} direction="up">
          <section className="py-24 px-4 relative">
            <div className="max-w-5xl mx-auto">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-80px" }}
              >
                <motion.div variants={sectionVariants}>
                  <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 font-mono">
                    <span className="text-accent">Why</span>{" "}
                    <span className="text-foreground">HackPath?</span>
                  </h2>
                  <p className="text-center text-[var(--color-gray-500)] font-mono text-sm mb-12 max-w-xl mx-auto">
                    Everything you need to go from complete beginner to ethical hacker
                  </p>
                </motion.div>
              </motion.div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {features.map((feature, i) => (
                  <ScrollReveal key={feature.title} delay={i * 0.1} direction="up" blur distance={40} duration={0.6}>
                    <div className="group relative border border-border bg-surface rounded-xl p-6 hover:cyber-glow transition-all duration-300 overflow-hidden">
                      <div
                        className={`absolute inset-0 bg-gradient-to-b ${feature.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                      />
                      <div className="relative z-10">
                        <div className="w-12 h-12 rounded-lg bg-accent-dim flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                          <feature.icon className="w-6 h-6 text-accent" />
                        </div>
                        <h3 className="text-foreground font-semibold font-mono mb-2">
                          {feature.title}
                        </h3>
                        <p className="text-sm text-[var(--color-gray-500)] font-mono">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </section>
        </ParallaxSection>

        <ScrollReveal blur distance={40} duration={0.7}>
          <section className="py-20 px-4">
            <div className="max-w-3xl mx-auto">
              <div className="relative p-8 border border-border bg-surface rounded-xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-accent-dim via-transparent to-transparent opacity-30" />
                <div className="relative z-10">
                  <Target className="w-10 h-10 text-accent mx-auto mb-4" />
                  <h2 className="text-xl font-bold text-center font-mono text-foreground mb-3">
                    About <span className="text-accent">HackPath</span>
                  </h2>
                  <p className="text-sm text-[var(--color-gray-400)] font-mono leading-relaxed max-w-xl mx-auto text-center">
                    We are focused on making cyber security education accessible to everyone
                    by teaching practical cyber security skills for free.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </ScrollReveal>

        <ScrollReveal blur distance={40} duration={0.7}>
          <section className="pb-20 px-4">
            <div className="max-w-3xl mx-auto">
              <div className="relative p-8 border border-border bg-surface rounded-xl text-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-accent-dim via-transparent to-transparent opacity-50" />
                <div className="relative z-10">
                  <Terminal className="w-10 h-10 text-accent mx-auto mb-4" />
                  <p className="text-sm text-[var(--color-gray-500)] font-mono mb-2">
                    Disclaimer
                  </p>
                  <p className="text-sm text-[var(--color-gray-400)] font-mono leading-relaxed max-w-lg mx-auto">
                    Only practice on systems you own or have explicit permission to test.
                    HackPath uses simulated, sandboxed environments for educational purposes only.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </ScrollReveal>
      </main>
    </>
  );
}
