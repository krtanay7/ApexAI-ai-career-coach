"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

const HeroSection = () => {
  const imageRef = useRef(null);

  useEffect(() => {
    const imageElement = imageRef.current;
    const handleScroll = () => {
      if (!imageElement) return;
      if (window.scrollY > 90) {
        imageElement.classList.add("scrolled");
      } else {
        imageElement.classList.remove("scrolled");
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="w-full px-4 pb-10 pt-32 md:pt-40">
      <div className="container mx-auto">
        <div className="section-shell overflow-hidden p-6 md:p-10 lg:p-14">
          <div className="mx-auto max-w-4xl space-y-8 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
              <Sparkles className="h-4 w-4" />
              Career Growth Platform
            </div>
            <h1 className="text-4xl font-bold leading-tight md:text-6xl lg:text-7xl">
              Build your next role with a{" "}
              <span className="warm-gradient-text">smarter AI coach</span>
            </h1>
            <p className="mx-auto max-w-2xl text-base text-muted-foreground md:text-xl">
              Personalized learning paths, interview practice, resume guidance,
              and market insights in one focused workspace.
            </p>
            <div className="flex flex-col justify-center gap-3 sm:flex-row">
              <Link href="/dashboard">
                <Button size="lg" className="w-full sm:w-auto">
                  Launch Dashboard <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/interview">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  Try Interview Prep
                </Button>
              </Link>
            </div>
            <div className="hero-image-wrapper mt-8">
              <div ref={imageRef} className="hero-image">
                <Image
                  src="/banner.jpeg"
                  width={1280}
                  height={720}
                  alt="Dashboard Preview"
                  className="mx-auto rounded-2xl border border-white/15 shadow-2xl"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
