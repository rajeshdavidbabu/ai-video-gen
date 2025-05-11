"use client";

import Link from "next/link";
import { siGithub, siDiscord, siX } from "simple-icons/icons";

const COMPANY_INFO = {
  name: "AI Shorts Pro",
  year: new Date().getFullYear(),
};

const FOOTER_LINKS = {
  terms: {
    label: "Terms of Service",
    href: "/terms",
  },
  support: {
    label: "Support",
    href: "mailto:support@yourcompany.com",
  },
  privacy: {
    label: "Privacy Policy",
    href: "/privacy",
  },
};

const SOCIAL_LINKS = [
  {
    name: "GitHub",
    href: "https://github.com",
    icon: siGithub.path,
  },
  {
    name: "Discord",
    href: "https://discord.com",
    icon: siDiscord.path,
  },
  {
    name: "Twitter",
    href: "https://twitter.com",
    icon: siX.path,
  },
];

export function Footer({ hideTerms = false }: { hideTerms?: boolean }) {
  return (
    <footer className="w-full px-4 border-t border-border/60 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 pb-4">
      <div className="container flex flex-col sm:flex-row sm:h-14 items-center justify-center sm:justify-between px-4 py-4 sm:py-0 gap-4 sm:gap-0">
        <p className="text-sm text-muted-foreground text-center sm:text-left">
          © {COMPANY_INFO.year} {COMPANY_INFO.name}. All rights reserved.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8">
          <div className="flex items-center gap-4">
            {!hideTerms &&
              Object.values(FOOTER_LINKS).map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link.label}
                </Link>
              ))}
          </div>

          <div className="flex items-center gap-4 mt-2 sm:mt-0">
            {SOCIAL_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label={link.name}
              >
                <svg
                  role="img"
                  viewBox="0 0 24 24"
                  className="h-5 w-5 fill-current"
                >
                  <path d={link.icon} />
                </svg>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
