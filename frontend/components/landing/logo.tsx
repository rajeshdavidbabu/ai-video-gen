import Image from "next/image";

export function Logo({ className }: { className?: string }) {
  return (
    <Image
      src="/logo/logo.svg"
      alt="AI Shorts Pro"
      width={32}
      height={32}
      className={className}
    />
  );
}
