import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "./button";

export function OpenSourceButton() {
  return (
    <div className="flex justify-center w-full mb-4 h-20 sm:h-40 lg:h-auto">
      <Link 
        href="https://github.com/rajeshdavidbabu" 
        target="_blank" 
        rel="noopener noreferrer"
      >
        <Button 
          variant="outline" 
          size="sm"
          className="font-sans gap-2 px-4 py-1 transition-transform hover:scale-105 rounded-full"
        >
          Proudly Open Source <ArrowRight className="h-4 w-4" />
        </Button>
      </Link>
    </div>
  );
}
