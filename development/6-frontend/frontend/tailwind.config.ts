import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: { DEFAULT: "#5A53D6", soft: "#ECEBFB" },
        pop: { DEFAULT: "#E8EA2F" },
        energy: { DEFAULT: "#F75C2D", soft: "#FDE7DD" },
        cloud: "#F1EEE7",
        ink: { DEFAULT: "#2A2A28" },
        canvas: "#F4F3FC",
        border: "hsl(var(--border))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        muted: { DEFAULT: "hsl(var(--muted))", foreground: "hsl(var(--muted-foreground))" },
        popover: { DEFAULT: "hsl(var(--popover))", foreground: "hsl(var(--popover-foreground))" },
        card: { DEFAULT: "hsl(var(--card))", foreground: "hsl(var(--card-foreground))" },
        destructive: { DEFAULT: "hsl(var(--destructive))", foreground: "hsl(var(--destructive-foreground))" },
        primary: { DEFAULT: "hsl(var(--primary))", foreground: "hsl(var(--primary-foreground))" },
        secondary: { DEFAULT: "hsl(var(--secondary))", foreground: "hsl(var(--secondary-foreground))" },
        accent: { DEFAULT: "hsl(var(--accent))", foreground: "hsl(var(--accent-foreground))" },
        ring: "hsl(var(--ring))",
        input: "hsl(var(--input))"
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Space Grotesk", "Inter", "sans-serif"]
      },
      borderRadius: { lg: "0.625rem", md: "0.5rem", sm: "0.375rem" },
      boxShadow: {
        soft: "0 18px 50px rgba(42, 42, 40, 0.08)"
      }
    }
  },
  plugins: [animate]
} satisfies Config;
