"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, BriefcaseBusiness } from "lucide-react";
import { Button } from "@/components/ui/button";
import MotionSection from "@/components/landing/motion-section";

export default function FinalCTASection() {
  return (
    <MotionSection className="px-4 pb-20 pt-10">
      <div className="container mx-auto">
        <div className="relative overflow-hidden rounded-[2rem] border border-brand-orange/30 bg-[linear-gradient(115deg,rgba(255,122,24,0.18),rgba(248,250,252,0.92),rgba(255,179,71,0.2))] p-10 text-center text-slate-900 md:p-14 dark:bg-[linear-gradient(115deg,rgba(255,122,24,0.28),rgba(19,33,56,0.92),rgba(0,198,255,0.2))] dark:text-white">
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(15,23,42,0.04))] dark:bg-[linear-gradient(180deg,rgba(0,0,0,0.12),rgba(0,0,0,0.28))]" />
          <div className="relative mx-auto max-w-2xl">
            <p className="inline-flex items-center gap-2 rounded-full border border-brand-orange/35 bg-brand-orange/10 px-4 py-1 text-xs uppercase tracking-[0.2em] text-brand-orange dark:border-white/30 dark:bg-white/10 dark:text-white">
              <BriefcaseBusiness className="h-3.5 w-3.5" />
              ApexAI Career Coach
            </p>
            <h2 className="mt-5 text-3xl font-semibold md:text-5xl">Ready to accelerate your career?</h2>
            <p className="mt-3 text-sm text-slate-600 md:text-base dark:text-white/85">
              Join professionals using ApexAI to plan better, interview smarter, and land stronger roles.
            </p>
            <Link href="/sign-up">
              <motion.div whileHover={{ y: -3 }} className="mt-7 inline-block">
                <Button size="lg" className="bg-brand-gradient text-white shadow-[0_12px_28px_-14px_rgba(255,122,24,0.75)] hover:brightness-110">
                  Start Now
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </motion.div>
            </Link>
          </div>
        </div>
      </div>
    </MotionSection>
  );
}
