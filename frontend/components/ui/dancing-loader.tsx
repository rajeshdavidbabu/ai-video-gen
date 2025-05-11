import { cn } from "@/lib/utils";

export function DancingLoader({
  className,
  size,
}: {
  className?: string;
  size?: "sm" | "lg";
}) {
  const commonClasses = "bg-gray-500 rounded-full animate-bounce";
  const sizeClass = size === "lg" ? "h-4 w-4" : "h-2 w-2";

  return (
    <div
      className={cn(
        "flex space-x-2 w-full h-10 items-center justify-center",
        className,
      )}
    >
      <div
        className={cn("[animation-delay:-0.3s]", commonClasses, sizeClass)}
      />
      <div
        className={cn("[animation-delay:-0.15s]", commonClasses, sizeClass)}
      />
      <div className={cn(commonClasses, sizeClass)} />
    </div>
  );
}
