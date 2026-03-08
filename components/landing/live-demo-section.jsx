"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import MotionSection from "@/components/landing/motion-section";

export default function LiveDemoSection() {
  const input = "Generate backend developer resume bullets";
  const output = useMemo(
    () => [
      "Built resilient REST APIs in Node.js serving 2M+ requests/day with 99.95% uptime.",
      "Optimized PostgreSQL queries and caching strategy, reducing p95 response time by 37%.",
      "Led CI/CD automation rollout with GitHub Actions, cutting release cycle from 3 days to 4 hours.",
    ],
    []
  );
  const [lines, setLines] = useState([]);

  useEffect(() => {
    let i = 0;
    const id = setInterval(() => {
      setLines((prev) => {
        if (i >= output.length) return prev;
        const next = [...prev, output[i]];
        i += 1;
        return next;
      });
      if (i >= output.length) clearInterval(id);
    }, 500);

    return () => clearInterval(id);
  }, [output]);

  return (
    <MotionSection id="live-demo" className="px-4 py-14 md:py-20">
      <div className="container mx-auto grid items-center gap-8 lg:grid-cols-2">
        <div className="space-y-4">
          <h2 className="text-3xl font-semibold md:text-4xl">Live AI generation flow</h2>
          <p className="text-muted-foreground">See how ApexAI turns a short prompt into role-specific, impact-focused outputs in seconds.</p>
        </div>
        <div className="glass-card p-6">
          <div className="rounded-2xl border border-border/80 bg-background/70 p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Prompt</p>
            <p className="mt-2 font-medium">{input}</p>
          </div>
          <div className="mt-4 rounded-2xl border border-brand-cyan/30 bg-brand-cyan/10 p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">ApexAI Output</p>
            <ul className="mt-3 space-y-2 text-sm text-foreground">
              {lines.map((line) => (
                <motion.li key={line} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 text-brand-cyan" />
                  <span className="text-muted-foreground">{line}</span>
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </MotionSection>
  );
}