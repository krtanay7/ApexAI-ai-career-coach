"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Bot,
  ClipboardList,
  MessageCircleQuestion,
  Sparkles,
  WandSparkles,
  Workflow,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import MotionSection from "@/components/landing/motion-section";

export default function HeroSection() {
  const prompt = "How do I prepare for a product manager interview?";
  const result =
    "Start with company + product research, build STAR stories for product decisions, and practice metric-driven tradeoff answers.";
  const [typed, setTyped] = useState("");

  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      index += 1;
      setTyped(result.slice(0, index));
      if (index >= result.length) clearInterval(timer);
    }, 18);
    return () => clearInterval(timer);
  }, [result]);

  return (
    <MotionSection id="hero" className="relative overflow-hidden px-4 pb-16 pt-32 md:pt-40">
      <div className="absolute inset-0 -z-20 bg-gradient-to-b from-[#f8fafc] to-[#e2e8f0] dark:from-[#0b0f19] dark:to-[#111827]" />
      <motion.div
        className="absolute inset-0 -z-10 dark:hidden"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 20%, rgba(255,122,24,0.16), transparent 40%), radial-gradient(circle at 80% 70%, rgba(0,198,255,0.14), transparent 40%)",
          backgroundSize: "130% 130%",
        }}
        animate={{ backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"] }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute inset-0 -z-10 hidden dark:block"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 20%, rgba(255,122,24,0.28), transparent 40%), radial-gradient(circle at 80% 70%, rgba(0,198,255,0.2), transparent 40%)",
          backgroundSize: "130% 130%",
        }}
        animate={{ backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"] }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
      />

      <div className="container mx-auto grid items-center gap-12 lg:grid-cols-2">
        <div className="space-y-7">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5 text-brand-orange" />
            Career Growth Platform
          </div>
          <h1 className="text-4xl font-semibold leading-tight md:text-6xl">
            Build your next role with a <span className="brand-gradient-text">smarter AI coach</span>
          </h1>
          <p className="max-w-xl text-base text-muted-foreground md:text-lg">
            Personalized learning paths, interview practice, resume guidance, and market insights in one focused workspace.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href="/dashboard">
              <motion.div whileHover={{ y: -3, scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button size="lg" className="w-full bg-brand-gradient text-white shadow-[0_0_35px_rgba(255,122,24,0.3)] sm:w-auto hover:shadow-[0_0_40px_rgba(255,122,24,0.35)]">
                  Launch Dashboard <ArrowRight className="h-4 w-4" />
                </Button>
              </motion.div>
            </Link>
            <Link href="/interview">
              <motion.div whileHover={{ y: -3, scale: 1.01 }} whileTap={{ scale: 0.98 }}>
                <Button size="lg" variant="outline" className="w-full border-border/90 bg-card/80 sm:w-auto dark:border-white/15 dark:bg-white/[0.02] dark:hover:bg-white/[0.05]">
                  Try Interview Prep
                </Button>
              </motion.div>
            </Link>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative rounded-3xl border border-border/80 bg-card/90 p-5 shadow-soft backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.03] dark:shadow-[0_0_30px_rgba(255,122,24,0.14)]"
        >
          <div className="pointer-events-none absolute inset-0 rounded-3xl border border-black/5 dark:border-white/5" />
          <div className="relative space-y-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Bot className="h-4 w-4 text-brand-cyan" />
              Interactive AI Career Assistant
            </div>
            <div className="rounded-2xl border border-border/80 bg-background/80 p-4 text-sm dark:border-white/10 dark:bg-[#0f172a]/85">
              <p className="font-medium text-foreground">You</p>
              <p className="mt-1 text-muted-foreground">{prompt}</p>
            </div>
            <div className="rounded-2xl border border-brand-orange/30 bg-brand-orange/10 p-4 text-sm">
              <p className="font-medium text-foreground">ApexAI</p>
              <p className="mt-1 min-h-12 text-muted-foreground">
                {typed}
                <span className="animate-pulse">|</span>
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Interview question bank", icon: MessageCircleQuestion },
                { label: "Role-specific checklist", icon: ClipboardList },
                { label: "STAR response coach", icon: WandSparkles },
                { label: "Mock interview mode", icon: Workflow },
              ].map((line) => (
                <motion.button
                  key={line.label}
                  type="button"
                  whileHover={{ y: -3, scale: 1.02 }}
                  className="flex items-center gap-2 rounded-xl border border-border/80 bg-background/70 px-3 py-2 text-xs text-muted-foreground transition-colors hover:border-brand-orange/35 hover:shadow-[0_0_22px_rgba(255,122,24,0.2)] dark:border-white/10 dark:bg-[#0f172a]/80"
                >
                  <line.icon className="h-3.5 w-3.5 text-brand-orange" />
                  {line.label}
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </MotionSection>
  );
}
