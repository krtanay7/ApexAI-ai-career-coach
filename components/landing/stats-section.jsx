"use client";

import { useEffect, useRef, useState } from "react";
import { animate, motion, useInView, useMotionValue } from "framer-motion";
import MotionSection from "@/components/landing/motion-section";

function StatCounter({ target, suffix, label, duration = 1.8 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const count = useMotionValue(0);
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(count, target, {
      duration,
      ease: "easeOut",
      onUpdate: (latest) => setValue(Math.floor(latest)),
    });
    return () => controls.stop();
  }, [count, duration, inView, target]);

  return (
    <motion.div ref={ref} whileHover={{ y: -6 }} className="glass-card p-6 text-center">
      <p className="brand-gradient-text text-4xl font-semibold">
        {value}
        {suffix}
      </p>
      <p className="mt-2 text-sm text-muted-foreground">{label}</p>
    </motion.div>
  );
}

export default function StatsSection() {
  return (
    <MotionSection className="px-4 pb-8">
      <div className="container mx-auto grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCounter target={50} suffix="+" label="Industries" />
        <StatCounter target={1000} suffix="+" label="Interview Questions" />
        <StatCounter target={95} suffix="%" label="Success Rate" />
        <StatCounter target={24} suffix="/7" label="AI Support" />
      </div>
    </MotionSection>
  );
}