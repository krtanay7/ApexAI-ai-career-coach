"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import MotionSection from "@/components/landing/motion-section";

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Product Manager",
    company: "Nova Labs",
    quote: "Helped me land my dream job. The interview simulator felt exactly like the real process.",
    avatar: "https://randomuser.me/api/portraits/women/75.jpg",
  },
  {
    name: "Aditya Sharma",
    role: "Backend Engineer",
    company: "HyperScale",
    quote: "I rewrote my resume with ApexAI and got 4 interviews in two weeks after months of silence.",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    name: "Priya Patel",
    role: "Marketing Lead",
    company: "OrbitIQ",
    quote: "Roadmaps and role insights made my transition plan concrete and measurable.",
    avatar: "https://randomuser.me/api/portraits/women/74.jpg",
  },
];

export default function TestimonialsSection() {
  return (
    <MotionSection className="px-4 py-14 md:py-20">
      <div className="container mx-auto">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <h2 className="text-3xl font-semibold md:text-4xl">Loved by career builders</h2>
          <p className="mt-3 text-muted-foreground">Stories from professionals using ApexAI to unlock faster role growth.</p>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {testimonials.map((entry) => (
            <motion.article
              key={entry.name}
              className="glass-card p-6"
              whileHover={{ y: -8, boxShadow: "0 24px 55px -30px rgba(0,0,0,0.35)" }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center gap-3">
                <Image src={entry.avatar} alt={entry.name} width={44} height={44} className="rounded-full border border-brand-orange/40 object-cover" />
                <div>
                  <p className="font-semibold">{entry.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {entry.role} at {entry.company}
                  </p>
                </div>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">"{entry.quote}"</p>
            </motion.article>
          ))}
        </div>
      </div>
    </MotionSection>
  );
}