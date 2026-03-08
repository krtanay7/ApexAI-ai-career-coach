"use client";

import { motion } from "framer-motion";
import MotionSection from "@/components/landing/motion-section";

export default function TrustBar() {
  const logos = ["Notion", "Linear", "Vercel", "Atlassian", "Stripe", "GitHub"];

  return (
    <MotionSection className="px-4 py-8">
      <div className="container mx-auto relative overflow-hidden rounded-3xl border border-border/80 bg-card/85 px-6 py-7 shadow-[0_20px_50px_-35px_rgba(15,23,42,0.25)] backdrop-blur-xl dark:border-white/10 dark:bg-[#0f172a]/85 dark:shadow-[0_20px_50px_-35px_rgba(0,0,0,0.8)]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,122,24,0.12),transparent_38%),radial-gradient(circle_at_80%_80%,rgba(0,198,255,0.12),transparent_36%)]" />
        <p className="relative text-center text-sm font-semibold tracking-wide text-foreground/80 md:text-[28px] md:tracking-tight dark:text-slate-200/85">
          Trusted by professionals across <span className="text-brand-orange">50+ industries</span>
        </p>
        <div className="relative mt-5 overflow-hidden">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-card to-transparent dark:from-[#0f172a]" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-card to-transparent dark:from-[#0f172a]" />
          <motion.div
            className="flex min-w-max items-center gap-5"
            animate={{ x: [0, -460] }}
            transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
          >
            {[...logos, ...logos].map((logo, idx) => (
              <div
                key={`${logo}-${idx}`}
                className="rounded-2xl border border-border/80 bg-background/75 px-6 py-2.5 text-base font-medium text-foreground/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.35)] transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-orange/55 hover:text-foreground hover:shadow-[0_0_26px_rgba(255,122,24,0.2)] dark:border-white/20 dark:bg-white/[0.03] dark:text-slate-200/90 dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] dark:hover:text-white dark:hover:shadow-[0_0_26px_rgba(255,122,24,0.22)]"
              >
                {logo}
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </MotionSection>
  );
}
