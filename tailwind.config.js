/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: {
        "2xl": "1440px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
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
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // ── Brand: Off-white & Deep Blue ──
        bone: "#F4F3EE", // off-white page tone
        paper: "#FAFAF8", // lightest (cards / text on dark)
        ink: "#1A1B1E", // cool near-black text
        // cool greige → charcoal ramp (also aliased to `linen` for existing markup)
        linen: {
          50: "#FAFAF8",
          100: "#F1F1ED",
          200: "#E4E3DE",
          300: "#D0CFC9",
          400: "#A9A8A2",
          500: "#83837D",
          600: "#5F5F5A",
          700: "#434440",
          800: "#2A2B2E",
          900: "#1A1B1E",
        },
        // `clay` key retained for compatibility — now a deep-blue accent scale
        clay: {
          50: "#EAF0F7",
          100: "#C9D9EC",
          200: "#9FBCDC",
          300: "#6E92C1",
          400: "#3E679A",
          500: "#284B73",
          600: "#1D3A5C",
          700: "#142A45",
          DEFAULT: "#284B73",
        },
        sage: {
          300: "#BAC1AE",
          400: "#A9B19C",
          500: "#97A088",
          600: "#76806A",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 3px)",
      },
      fontFamily: {
        serif: ["Fraunces", "Georgia", "serif"],
        display: ["Fraunces", "Georgia", "serif"],
        sans: ["Montserrat", "system-ui", "sans-serif"],
      },
      fontSize: {
        // fluid display sizes for editorial headlines
        "d-sm": ["clamp(2.5rem, 6vw, 4.5rem)", { lineHeight: "0.98", letterSpacing: "-0.02em" }],
        "d-md": ["clamp(3rem, 8vw, 7rem)", { lineHeight: "0.95", letterSpacing: "-0.025em" }],
        "d-lg": ["clamp(3.5rem, 11vw, 10rem)", { lineHeight: "0.9", letterSpacing: "-0.03em" }],
        "d-xl": ["clamp(4rem, 16vw, 15rem)", { lineHeight: "0.85", letterSpacing: "-0.035em" }],
      },
      letterSpacing: {
        widest: "0.3em",
        tightest: "-0.04em",
      },
      spacing: {
        4.5: "1.125rem",
        13: "3.25rem",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "marquee-rev": {
          "0%": { transform: "translateX(-50%)" },
          "100%": { transform: "translateX(0)" },
        },
      },
      animation: {
        marquee: "marquee 40s linear infinite",
        "marquee-rev": "marquee-rev 40s linear infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
