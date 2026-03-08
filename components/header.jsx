"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import {
  ChevronDown,
  FileText,
  GraduationCap,
  LayoutDashboard,
  Lightbulb,
  Menu,
  PenBox,
  Sparkles,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ThemeToggle from "@/components/theme-toggle";

const navLinks = [
  { label: "Features", href: "/#features" },
  { label: "How it Works", href: "/#how-it-works" },
  { label: "Pricing", href: "/#pricing" },
  { label: "Dashboard", href: "/dashboard" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  
  const logoSrc = mounted && resolvedTheme === "light" ? "/logo_dark.png" : "/logoo.png";

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "border-b border-border/80 bg-background/85 backdrop-blur-2xl dark:bg-[#0b1220]/85"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <nav className="container mx-auto flex h-20 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-3" aria-label="ApexAI home">
          <Image src={logoSrc} alt="ApexAI" width={140} height={40} className="h-9 w-auto object-contain" priority />
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((item) => (
            <Link key={item.href} href={item.href} className="text-sm font-medium text-foreground/80 transition-colors hover:text-foreground">
              {item.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <ThemeToggle />
          <SignedOut>
            <Link href="/sign-in">
              <Button className="bg-brand-gradient text-white hover:brightness-110">Get Started</Button>
            </Link>
          </SignedOut>
          <SignedIn>
            <Link href="/dashboard">
              <Button
                variant="outline"
                className="h-12 rounded-2xl border-border/90 bg-card/70 px-7 text-base font-semibold"
              >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Button>
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="h-12 rounded-2xl bg-brand-gradient px-7 text-base font-semibold text-white shadow-glow hover:brightness-110">
                  <Sparkles className="h-4 w-4" />
                  <span>Toolkit</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-56 border-white/10 bg-card/95 backdrop-blur-xl dark:bg-[#111827]/95"
              >
                <DropdownMenuItem asChild>
                  <Link href="/resume" className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Resume Builder
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href="/ai-cover-letter"
                    className="flex items-center gap-2"
                  >
                    <PenBox className="h-4 w-4" />
                    Cover Letters
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/interview" className="flex items-center gap-2">
                    <GraduationCap className="h-4 w-4" />
                    Interview Prep
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/skill-roadmap" className="flex items-center gap-2">
                    <Lightbulb className="h-4 w-4" />
                    Skill Roadmap
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <Button variant="outline" size="icon" onClick={() => setMenuOpen((v) => !v)} aria-label="Toggle menu">
            {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
        </div>
      </nav>

      {menuOpen && (
        <div className="border-b border-border/70 bg-background/95 px-4 pb-5 pt-2 backdrop-blur-xl md:hidden">
          <div className="container mx-auto space-y-2">
            {navLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="block rounded-xl px-3 py-2 text-sm font-medium text-foreground/85 hover:bg-secondary"
              >
                {item.label}
              </Link>
            ))}
            <SignedOut>
              <Link href="/sign-in" onClick={() => setMenuOpen(false)}>
                <Button className="mt-2 w-full bg-brand-gradient text-white">Get Started</Button>
              </Link>
            </SignedOut>
            <SignedIn>
              <Link href="/dashboard" onClick={() => setMenuOpen(false)}>
                <Button className="mt-2 w-full bg-brand-gradient text-white">Dashboard</Button>
              </Link>
              <Link href="/resume" onClick={() => setMenuOpen(false)}>
                <Button variant="outline" className="mt-2 w-full">Resume Builder</Button>
              </Link>
              <Link href="/ai-cover-letter" onClick={() => setMenuOpen(false)}>
                <Button variant="outline" className="mt-2 w-full">Cover Letters</Button>
              </Link>
              <Link href="/interview" onClick={() => setMenuOpen(false)}>
                <Button variant="outline" className="mt-2 w-full">Interview Prep</Button>
              </Link>
              <Link href="/skill-roadmap" onClick={() => setMenuOpen(false)}>
                <Button variant="outline" className="mt-2 w-full">Skill Roadmap</Button>
              </Link>
            </SignedIn>
          </div>
        </div>
      )}
    </header>
  );
}
