"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { HeroImages } from "@/components/landing/hero-images";
import { ArrowRight, MountainIcon, MousePointerClick } from "lucide-react";
import { OpenSourceButton } from "@/components/ui/open-source-button";
import { Logo } from "@/components/landing/logo";
import { MaxWidthWrapper } from "@/components/ui/max-width-wrapper";
import { ParticleButton } from "@/components/ui/particle-button";
import { HeroHighlight } from "@/components/ui/hero-highlight";
import { HowItWorks } from "@/components/landing/how-it-works";
import { VideoShowcase } from "@/components/landing/discover-carousel";
import { FaqSection } from "@/components/landing/faq-section";
import { LogoWithLink } from "@/components/landing/logo-with-link";
import { Pricing } from "@/components/landing/pricing";
import { Footer } from "@/components/landing/footer";
import Image from "next/image";

export default function LandingPage() {
  const [titleNumber, setTitleNumber] = useState(0);
  const titles = useMemo(
    () => ["Amazing", "Stunning", "Engaging", "Powerful"],
    []
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (titleNumber === titles.length - 1) {
        setTitleNumber(0);
      } else {
        setTitleNumber(titleNumber + 1);
      }
    }, 2000);
    return () => clearTimeout(timeoutId);
  }, [titleNumber, titles]);

  return (
    <div className="flex flex-col min-h-screen">
      <MaxWidthWrapper>
        <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 lg:px-6 h-14 flex items-center">
          <LogoWithLink />
        </header>
        <main className="flex-1">
          <section className="w-full py-12 md:py-24 lg:py-32 px-4 lg:px-6">
            <HeroHighlight>
              <div className="container px-4 md:px-6">
                <div className="grid gap-16 lg:gap-12 lg:grid-cols-[1fr_400px] xl:grid-cols-[1fr_600px]">
                  <div className="flex flex-col justify-center space-y-4 text-center lg:text-left">
                    <div className="space-y-2">
                      <h1 className="text-3xl font-serif font-bold sm:text-5xl flex flex-col space-y-2">
                        <div>
                          Turn your script into{" "}
                          <span className="relative inline-flex py-2 mr-2 justify-start">
                            <span className="invisible">Amazing</span>
                            {titles.map((title, index) => (
                              <motion.span
                                key={index}
                                className="absolute text-primary text-foreground-muted"
                                initial={{ opacity: 0, y: "100%" }}
                                transition={{ type: "spring", stiffness: 50 }}
                                animate={{
                                  y:
                                    titleNumber === index
                                      ? 0
                                      : titleNumber === index - 1 ||
                                        (titleNumber === titles.length - 1 &&
                                          index === 0)
                                      ? "-100%"
                                      : "100%",
                                  opacity: titleNumber === index ? 1 : 0,
                                }}
                              >
                                {title}
                              </motion.span>
                            ))}
                          </span>{" "}
                          videos
                        </div>
                      </h1>
                      <p className="max-w-[600px] mx-auto lg:mx-0 font-sans text-gray-500 md:text-xl dark:text-gray-400">
                        Transform ideas into videos with AI-generated scripts,
                        voiceovers, and visuals—all from a simple prompt or a
                        script.
                      </p>
                    </div>
                    <div className="flex flex-col gap-2 min-[400px]:flex-row justify-center lg:justify-start">
                      <Link href="/auth/login">
                        <ParticleButton
                          successDuration={1000}
                          variant="default"
                          className="w-full font-sans"
                        >
                          Get Started
                          <ArrowRight className="h-4 w-4" />
                        </ParticleButton>
                      </Link>
                      <Link href="/auth/login">
                        <ParticleButton
                          successDuration={1000}
                          variant="outline"
                          className="w-full font-sans flex items-center justify-center gap-2"
                        >
                          <Image
                            src="/landing/web_neutral_rd_na.svg"
                            alt="Google"
                            width={20}
                            height={20}
                          />
                          Join with Google
                        </ParticleButton>
                      </Link>
                    </div>
                  </div>
                  <HeroImages />
                </div>
              </div>
            </HeroHighlight>
          </section>
          <HowItWorks />
          <VideoShowcase />
          <FaqSection />
          <Pricing />
          <Footer />
        </main>
      </MaxWidthWrapper>
    </div>
  );
}
