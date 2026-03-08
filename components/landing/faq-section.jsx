"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus } from "lucide-react";
import MotionSection from "@/components/landing/motion-section";

const items = [
  {
    q: "Can ApexAI customize resumes for each job?",
    a: "Yes. Paste the job description and ApexAI rewrites bullets and summaries for better role relevance.",
  },
  {
    q: "Does it support interview prep for different roles?",
    a: "Yes. You can practice behavioral, product, technical, and leadership interviews with role-specific prompts.",
  },
  {
    q: "Can I track progress over time?",
    a: "Yes. The dashboard tracks interview performance, roadmap completion, and profile strength metrics.",
  },
  {
    q: "Is there a free plan?",
    a: "Yes. You can start on the free tier and upgrade when you need unlimited AI workflows.",
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <MotionSection className="px-4 py-14 md:py-20">
      <div className="container mx-auto max-w-3xl">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <h2 className="text-3xl font-semibold md:text-4xl">Frequently asked questions</h2>
        </div>
        <div className="space-y-3">
          {items.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={item.q} className="glass-card overflow-hidden p-1">
                <button
                  type="button"
                  className="flex w-full items-center justify-between rounded-2xl px-4 py-4 text-left"
                  onClick={() => setOpenIndex(isOpen ? -1 : index)}
                >
                  <span className="font-medium">{item.q}</span>
                  {isOpen ? <Minus className="h-4 w-4 text-brand-orange" /> : <Plus className="h-4 w-4 text-muted-foreground" />}
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeOut" }}
                    >
                      <p className="px-4 pb-4 text-sm text-muted-foreground">{item.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </MotionSection>
  );
}