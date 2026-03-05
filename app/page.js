"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import HeroSection from "@/components/hero";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Image from "next/image";
import { features } from "@/data/features";
import { testimonial } from "@/data/testimonial";
import { faqs } from "@/data/faqs";
import { howItWorks } from "@/data/howItWorks";

export default function LandingPage() {
  return (
    <>
      <div className="mesh-overlay" />
      <HeroSection />

      <section className="w-full px-4 py-12 md:py-20">
        <div className="container mx-auto">
          <div className="section-shell p-6 md:p-10">
            <h2 className="mb-8 text-center text-3xl font-bold md:text-4xl">
              Powerful Features for Career Growth
            </h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              {features.map((feature, index) => (
                <Card key={index} className="h-full">
                  <CardContent className="flex h-full flex-col items-center pt-6 text-center">
                    {feature.icon}
                    <h3 className="mt-4 text-xl font-bold">{feature.title}</h3>
                    <p className="mt-2 text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="w-full px-4 py-6 md:py-10">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {[
              ["50+", "Industries Covered"],
              ["1000+", "Interview Questions"],
              ["95%", "Success Rate"],
              ["24/7", "AI Support"],
            ].map(([value, label]) => (
              <div
                key={label}
                className="section-shell flex flex-col items-center justify-center p-6 text-center"
              >
                <h3 className="text-4xl font-bold warm-gradient-text">{value}</h3>
                <p className="mt-2 text-sm text-muted-foreground md:text-base">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="w-full px-4 py-12 md:py-20">
        <div className="container mx-auto">
          <div className="section-shell p-6 md:p-10">
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <h2 className="text-3xl font-bold md:text-4xl">How It Works</h2>
              <p className="mt-3 text-muted-foreground">
                Four clear steps to accelerate your next career move.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              {howItWorks.map((item, index) => (
                <div key={index} className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/15">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-semibold">{item.title}</h3>
                  <p className="mt-2 text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="w-full px-4 py-12 md:py-20">
        <div className="container mx-auto">
          <div className="section-shell p-6 md:p-10">
            <h2 className="mb-8 text-center text-3xl font-bold md:text-4xl">
              What Users Say
            </h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {testimonial.map((entry, index) => (
                <Card key={index}>
                  <CardContent className="pt-6">
                    <div className="mb-4 flex items-center gap-3">
                      <Image
                        width={44}
                        height={44}
                        src={entry.image}
                        alt={entry.author}
                        className="rounded-full border border-primary/30 object-cover"
                      />
                      <div>
                        <p className="font-semibold">{entry.author}</p>
                        <p className="text-sm text-muted-foreground">
                          {entry.role} at {entry.company}
                        </p>
                      </div>
                    </div>
                    <p className="italic text-muted-foreground">"{entry.quote}"</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="w-full px-4 py-12 md:py-20">
        <div className="container mx-auto">
          <div className="section-shell p-6 md:p-10">
            <div className="mx-auto mb-10 max-w-2xl text-center">
              <h2 className="text-3xl font-bold md:text-4xl">
                Frequently Asked Questions
              </h2>
              <p className="mt-3 text-muted-foreground">
                Quick answers about how the platform works.
              </p>
            </div>

            <div className="mx-auto max-w-3xl">
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent>{faq.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full px-4 pb-20">
        <div className="container mx-auto">
          <div className="rounded-3xl border border-primary/25 bg-gradient-to-r from-primary/20 via-accent/10 to-primary/20 p-8 text-center md:p-12">
            <h2 className="text-3xl font-bold md:text-5xl">
              Ready to accelerate your career?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground md:text-lg">
              Join professionals using ApexAI to build better resumes, sharpen
              interview skills, and map next-role opportunities.
            </p>
            <Link href="/dashboard">
              <Button size="lg" className="mt-8">
                Start Now <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
