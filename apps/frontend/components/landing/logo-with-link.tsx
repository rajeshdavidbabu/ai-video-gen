import Link from "next/link";
import { Logo } from "./logo";

export const LogoWithLink = () => {
  return (
    <Link href="/" className="flex items-center gap-2 px-4 py-4">
      <Logo />
      <span className="text-xl font-bold font-serif">AI Shorts Pro</span>
      <span className="text-[0.6rem] px-1.5 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/20">
        BETA
      </span>
    </Link>
  );
};
