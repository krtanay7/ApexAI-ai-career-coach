"use client";

import HeroSection from "@/components/landing/hero-section";
import TrustBar from "@/components/landing/trust-bar";
import FeaturesBento from "@/components/landing/features-bento";
import StatsSection from "@/components/landing/stats-section";
import TimelineSection from "@/components/landing/timeline-section";
import LiveDemoSection from "@/components/landing/live-demo-section";
import TestimonialsSection from "@/components/landing/testimonials-section";
import PricingSection from "@/components/landing/pricing-section";
import FAQSection from "@/components/landing/faq-section";
import FinalCTASection from "@/components/landing/final-cta-section";

export default function LandingPage() {
  return (
    <>
      <HeroSection />
      <TrustBar />
      <FeaturesBento />
      <StatsSection />
      <TimelineSection />
      <LiveDemoSection />
      <TestimonialsSection />
      <PricingSection />
      <FAQSection />
      <FinalCTASection />
    </>
  );
}