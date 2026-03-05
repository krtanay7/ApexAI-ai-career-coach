"use client";

import React from "react";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import {
  PenBox,
  LayoutDashboard,
  FileText,
  GraduationCap,
  ChevronDown,
  Sparkles,
  Lightbulb,
} from "lucide-react";
import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import ThemeToggle from "./theme-toggle";
import { useTheme } from "next-themes";

export default function Header() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const logoSrc =
    mounted && resolvedTheme === "light" ? "/logo_dark.png" : "/logoo.png";

  return (
    <header className="fixed top-0 z-50 w-full border-b border-white/10 bg-background/70 backdrop-blur-2xl">
      <nav className="container mx-auto flex h-20 items-center justify-between px-4">
        <Link href="/" className="group flex items-center gap-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-2 transition-transform duration-300 group-hover:rotate-3">
            <Image
              src={logoSrc}
              alt="ApexAI Logo"
              width={150}
              height={48}
              className="h-10 w-auto object-contain"
            />
          </div>
          <div className="hidden md:block">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              AI Career Intelligence
            </p>
            <p className="font-semibold">ApexAI Coach</p>
          </div>
        </Link>

        <div className="flex items-center gap-2 md:gap-3">
          <ThemeToggle />

          <SignedIn>
            <Link href="/dashboard">
              <Button
                variant="outline"
                className="hidden items-center gap-2 md:inline-flex"
              >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Button>
              <Button variant="ghost" className="h-10 w-10 p-0 md:hidden">
                <LayoutDashboard className="h-4 w-4" />
              </Button>
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  <span className="hidden md:block">Toolkit</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-56 border-white/10 bg-card/90 backdrop-blur-xl"
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
          </SignedIn>

          <SignedOut>
            <SignInButton>
              <Button variant="outline">Sign In</Button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-10 h-10 ring-2 ring-primary/40",
                  userButtonPopoverCard: "shadow-xl",
                  userPreviewMainIdentifier: "font-semibold",
                },
              }}
              afterSignOutUrl="/"
            />
          </SignedIn>
        </div>
      </nav>
    </header>
  );
}
