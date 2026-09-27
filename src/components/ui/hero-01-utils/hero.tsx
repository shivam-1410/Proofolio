import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Star, ShieldCheck } from "lucide-react";

export interface AvatarList {
  image: string;
  name?: string;
}

interface HeroSectionProps {
  avatarList: AvatarList[];
}

export default function HeroSection({ avatarList }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-24">
      <div className="container mx-auto px-4 text-center max-w-4xl">
        {/* Top announcement pill */}
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-medium text-primary mb-6">
          <ShieldCheck className="h-3.5 w-3.5" />
          <span>Next-Generation Zero Knowledge Verification</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-foreground leading-[1.1] mb-6">
          Scale Institutional Trust with{" "}
          <span className="bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">
            Confidential ZK Proofs
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
          Mathematically prove solvency and compliance on Cardano&apos;s Midnight Network without ever disclosing underlying customer deposits, internal balances, or private treasury assets.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-10">
          <Button size="lg" className="w-full sm:w-auto font-semibold gap-2">
            <span>Explore Verifier App</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="lg" className="w-full sm:w-auto font-medium">
            Read Technical Whitepaper
          </Button>
        </div>

        {/* Social Proof / Avatars Stack */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4 border-t border-border/50 max-w-md mx-auto">
          <div className="flex -space-x-2.5 overflow-hidden">
            {avatarList.map((avatar, i) => (
              <img
                key={i}
                src={avatar.image}
                alt={avatar.name || `User ${i + 1}`}
                className="inline-block h-8 w-8 rounded-full ring-2 ring-background object-cover"
                onError={(e) => {
                  // Fallback to high quality unsplash avatar if external cdn fails
                  e.currentTarget.src = `https://images.unsplash.com/photo-${1534528741775 + i * 1000}?w=100&auto=format&fit=crop&q=80`;
                }}
              />
            ))}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-3.5 w-3.5 fill-current" />
              ))}
            </div>
            <span className="font-semibold text-foreground">5.0</span>
            <span>&bull; Verified by Web3 Auditors</span>
          </div>
        </div>
      </div>
    </section>
  );
}
