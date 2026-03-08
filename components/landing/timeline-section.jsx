"use client";

import { motion } from "framer-motion";
import MotionSection from "@/components/landing/motion-section";

const steps = [
  { title: "Professional Onboarding", desc: "Set goals, role targets, and current experience." },
  { title: "Craft Your Documents", desc: "Generate resume and cover letter drafts instantly." },
  { title: "Prepare for Interviews", desc: "Practice with AI prompts and feedback loops." },
  { title: "Track Your Progress", desc: "Monitor milestones with actionable recommendations." },
];

export default function TimelineSection() {
  return (
    <MotionSection id="how-it-works" className="px-4 py-14 md:py-20">
      <div className="container mx-auto">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="text-3xl font-semibold md:text-4xl">How it works</h2>
          <p className="mt-3 text-muted-foreground">A focused 4-step workflow to move from planning to execution.</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-4">
          {steps.map((step, index) => (
            <div key={step.title} className="relative">
              <motion.div whileHover={{ y: -5 }} className="glass-card h-full p-6">
                <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-full border border-brand-cyan/35 bg-brand-cyan/10 text-sm font-semibold text-brand-cyan">
                  {index + 1}
                </div>
                <h3 className="text-lg font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{step.desc}</p>
              </motion.div>
              {index < steps.length - 1 && (
                <motion.span
                  className="section-fade-line absolute left-[calc(100%-8px)] top-9 hidden h-[2px] w-8 lg:block"
                  animate={{ opacity: [0.35, 1, 0.35] }}
                  transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </MotionSection>
  );
}