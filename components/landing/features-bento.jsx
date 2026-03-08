"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Compass, FileText, MessageSquare, TrendingUp } from "lucide-react";
import MotionSection from "@/components/landing/motion-section";

const items = [
  {
    icon: FileText,
    title: "AI Resume Builder",
    description: "Generate ATS-ready resumes with impact-focused bullets tailored to each role.",
    className: "md:col-span-2",
  },
  {
    icon: MessageSquare,
    title: "Interview Preparation AI",
    description: "Practice with role-specific prompts and instant feedback on structure and delivery.",
    className: "",
  },
  {
    icon: Compass,
    title: "Career Roadmap Generator",
    description: "Map next-role milestones with personalized skill and project recommendations.",
    className: "",
  },
  {
    icon: TrendingUp,
    title: "Industry Insights",
    description: "Track hiring trends, salary bands, and in-demand skills by domain, then apply them directly in your toolkit workflows.",
    connectedFeatures: [
      { label: "Resume Builder", href: "/resume" },
      { label: "Cover Letters", href: "/ai-cover-letter" },
      { label: "Interview Prep", href: "/interview" },
      { label: "Skill Roadmap", href: "/skill-roadmap" },
    ],
    className: "md:col-span-2",
  },
];

export default function FeaturesBento() {
  return (
    <MotionSection id="features" className="px-4 py-14 md:py-20">
      <div className="container mx-auto">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <h2 className="text-3xl font-semibold md:text-4xl">Built to accelerate career outcomes</h2>
          <p className="mt-3 text-muted-foreground">A modern AI workspace for resumes, interview prep, and growth planning.</p>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {items.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                className={`glass-card p-6 ${item.className}`}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: index * 0.08 }}
                whileHover={{ y: -8 }}
              >
                <div className="w-fit rounded-2xl border border-brand-orange/30 bg-brand-orange/10 p-3 text-brand-orange">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-xl font-semibold">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
                {item.connectedFeatures ? (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {item.connectedFeatures.map((feature) => (
                      <Link
                        key={feature.label}
                        href={feature.href}
                        className="rounded-full border border-brand-cyan/30 bg-brand-cyan/10 px-3 py-1 text-xs font-medium text-brand-cyan transition-colors hover:bg-brand-cyan/20"
                      >
                        {feature.label}
                      </Link>
                    ))}
                  </div>
                ) : null}
              </motion.div>
            );
          })}
        </div>
      </div>
    </MotionSection>
  );
}
