import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["DM Sans Variable", "system-ui", "sans-serif"],
        serif: ["DM Serif Display", "Georgia", "serif"],
        merriweatherbold: ["merriweatherbold", "serif"],
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "sparkle-1": {
          "0%, 100%": {
            transform: "scale(1)",
            opacity: "1",
          },
          "50%": {
            transform: "scale(1.2)",
            opacity: "0.6",
          },
        },
        "sparkle-2": {
          "0%, 100%": {
            transform: "scale(1) rotate(0deg)",
            opacity: "0",
          },
          "25%": {
            transform: "scale(1.2) rotate(90deg)",
            opacity: "0.9",
          },
          "50%": {
            transform: "scale(0.8) rotate(180deg)",
            opacity: "0",
          },
        },
        "sparkle-3": {
          "0%, 100%": {
            transform: "scale(1) rotate(0deg)",
            opacity: "0",
          },
          "50%": {
            transform: "scale(1.2) rotate(90deg)",
            opacity: "0.9",
          },
          "75%": {
            transform: "scale(0.8) rotate(180deg)",
            opacity: "0",
          },
        },
        "twinkle-1": {
          "0%, 100%": {
            opacity: "1",
            transform: "scale(1)",
          },
          "50%": {
            opacity: "0.3",
            transform: "scale(0.95)",
          },
        },
        "twinkle-2": {
          "0%, 100%": {
            opacity: "0.2",
          },
          "40%": {
            opacity: "0.8",
          },
          "60%": {
            opacity: "0.8",
          },
        },
        "twinkle-3": {
          "0%, 100%": {
            opacity: "0.3",
          },
          "50%": {
            opacity: "1",
          },
        },
        animatedgradient: {
          "0%": {
            backgroundPosition: "0% 50%",
          },
          "50%": {
            backgroundPosition: "100% 50%",
          },
          "100%": {
            backgroundPosition: "0% 50%",
          },
        },
        buttonheartbeat: {
          "0%": {
            "box-shadow": "0 0 0 0 hsl(var(--primary))",
          },
          "50%": {
            "box-shadow": "0 0 0 7px hsl(var(--primary) / 0)",
          },
          "100%": {
            "box-shadow": "0 0 0 0 hsl(var(--primary) / 0)",
          },
        },
        marquee: {
          from: {
            transform: "translateX(0)",
          },
          to: {
            transform: "translateX(calc(-100% - var(--gap)))",
          },
        },
        "marquee-vertical": {
          from: {
            transform: "translateY(0)",
          },
          to: {
            transform: "translateY(calc(-100% - var(--gap)))",
          },
        },
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "pulse-shadow": {
          "0%, 100%": {
            boxShadow: "0 0 0 0 rgba(124, 58, 237, 0.5)"
          },
          "50%": {
            boxShadow: "0 0 15px 2px rgba(124, 58, 237, 0.7)"
          }
        },
      },
      animation: {
        "sparkle-1": "sparkle-1 2s ease-in-out infinite",
        "sparkle-2": "sparkle-2 2.5s ease-in-out infinite",
        "sparkle-3": "sparkle-3 2.1s ease-in-out infinite",
        "twinkle-1": "twinkle-1 3s ease-in-out infinite",
        "twinkle-2": "twinkle-2 3.5s ease-in-out infinite",
        "twinkle-3": "twinkle-3 4s ease-in-out infinite",
        gradient: "animatedgradient 6s ease infinite alternate",
        buttonheartbeat: "buttonheartbeat 2s infinite ease-in-out",
        "pulse-shadow": "pulse-shadow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        marquee: "marquee var(--duration) linear infinite",
        "marquee-vertical": "marquee-vertical var(--duration) linear infinite",
        "marquee-pause": "marquee 40s linear infinite paused",
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      backgroundSize: {
        "300%": "300%",
      },
    },
  },
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  plugins: [require("tailwindcss-animate")],
};
export default config;
