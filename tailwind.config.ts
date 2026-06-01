import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // ─── Brand Greens ───────────────────────────────────────
        brand: {
          primary:   "#0A9B4B", // Primary Heritage Green
          deep:      "#06753A", // Deep Heritage Green
          light:     "#EAF8F0", // Light Mint Green
          pale:      "#D6F0E4", // Subtle tint for hover states
        },
        // ─── Neutrals ───────────────────────────────────────────
        cream:    "#FAF8F2", // Warm cream background
        charcoal: "#1E1E1E", // Primary text
        muted:    "#6B7280", // Secondary text
        // ─── Gold ───────────────────────────────────────────────
        gold: {
          DEFAULT: "#C9A24A",
          light:   "#E8C97A",
          dark:    "#A07830",
        },
        // ─── Semantic ───────────────────────────────────────────
        success: "#0A9B4B",
        warning: "#F59E0B",
        error:   "#EF4444",
      },

      fontFamily: {
        // Headings — elegance
        serif:    ["var(--font-playfair)", "Georgia", "serif"],
        // Body — clarity
        sans:     ["var(--font-inter)", "system-ui", "sans-serif"],
        // Heritage accent — ornate details
        heritage: ["var(--font-cormorant)", "Georgia", "serif"],
      },

      fontSize: {
        "display-xl": ["4.5rem",  { lineHeight: "1.1", letterSpacing: "-0.02em" }],
        "display-lg": ["3.75rem", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
        "display":    ["3rem",    { lineHeight: "1.15", letterSpacing: "-0.01em" }],
        "heading-xl": ["2.25rem", { lineHeight: "1.2" }],
        "heading-lg": ["1.875rem",{ lineHeight: "1.25" }],
        "heading":    ["1.5rem",  { lineHeight: "1.3" }],
        "heading-sm": ["1.25rem", { lineHeight: "1.35" }],
      },

      spacing: {
        "18": "4.5rem",
        "22": "5.5rem",
        "88": "22rem",
        "128": "32rem",
      },

      borderRadius: {
        "heritage": "8px", // Soft rounded squares for a smoother premium feel
      },

      boxShadow: {
        "heritage":    "0 4px 24px rgba(10, 155, 75, 0.06)",
        "heritage-lg": "0 12px 48px rgba(10, 155, 75, 0.08)",
        "gold":        "0 4px 16px rgba(201, 162, 74, 0.15)",
        "card":        "0 2px 8px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.03)",
        "card-hover":  "0 8px 32px rgba(0,0,0,0.08)",
      },

      backgroundImage: {
        "heritage-gradient":   "linear-gradient(135deg, #0A9B4B 0%, #06753A 100%)",
        "cream-gradient":      "linear-gradient(180deg, #FAF8F2 0%, #FFFFFF 100%)",
        "gold-gradient":       "linear-gradient(135deg, #C9A24A 0%, #A07830 100%)",
        "hero-pattern":        "url('/images/heritage-pattern.svg')",
      },

      animation: {
        "fade-in":       "fadeIn 0.6s ease-out forwards",
        "fade-up":       "fadeUp 0.7s ease-out forwards",
        "slide-in-left": "slideInLeft 0.6s ease-out forwards",
        "spin-slow":     "spin 8s linear infinite",
        "pulse-gold":    "pulseGold 2s ease-in-out infinite",
      },

      keyframes: {
        fadeIn: {
          "0%":   { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeUp: {
          "0%":   { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideInLeft: {
          "0%":   { opacity: "0", transform: "translateX(-24px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        pulseGold: {
          "0%, 100%": { opacity: "1" },
          "50%":      { opacity: "0.7" },
        },
      },

      transitionDuration: {
        "400": "400ms",
      },
    },
  },
  plugins: [],
};

export default config;
