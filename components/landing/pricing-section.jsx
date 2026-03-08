"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import MotionSection from "@/components/landing/motion-section";

const plans = [
  {
    tier: "Free",
    price: "$0",
    features: ["Basic resume generation", "3 AI interview sessions/month", "Core roadmap templates"],
    cta: "Start Free",
  },
  {
    tier: "Pro",
    price: "$19/mo",
    features: ["Unlimited resume + cover letters", "Unlimited mock interviews", "Advanced analytics and ATS scoring"],
    cta: "Choose Pro",
    highlight: true,
  },
  {
    tier: "Team",
    price: "$79/mo",
    features: ["Shared talent workspace", "Role libraries + team templates", "Priority support and onboarding"],
    cta: "Contact Sales",
  },
];

export default function PricingSection() {
  return (
    <MotionSection id="pricing" className="px-4 py-14 md:py-20">
      <div className="container mx-auto">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <h2 className="text-3xl font-semibold md:text-4xl">Pricing for every stage</h2>
          <p className="mt-3 text-muted-foreground">Choose a plan that fits your growth pace.</p>
        </div>
        <div className="grid gap-5 lg:grid-cols-3">
          {plans.map((plan) => (
            <motion.div
              key={plan.tier}
              className={`glass-card p-6 ${plan.highlight ? "border-brand-orange/40 shadow-glow" : ""}`}
              whileHover={{ y: -8 }}
            >
              {plan.highlight && (
                <span className="inline-flex rounded-full border border-brand-orange/40 bg-brand-orange/10 px-3 py-1 text-xs font-semibold text-brand-orange">
                  Most Popular
                </span>
              )}
              <h3 className="mt-4 text-xl font-semibold">{plan.tier}</h3>
              <p className="mt-2 text-3xl font-semibold">{plan.price}</p>
              <ul className="mt-5 space-y-3 text-sm text-muted-foreground">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 text-brand-cyan" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button className={`mt-6 w-full ${plan.highlight ? "bg-brand-gradient text-white" : ""}`} variant={plan.highlight ? "default" : "outline"}>
                {plan.cta}
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </MotionSection>
  );
}