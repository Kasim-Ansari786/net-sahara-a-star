export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./app/**/*.{js,jsx}",
    "./src/**/*.{js,jsx}"
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: {
        "2xl": "1320px",
      },
    },
    extend: {
      fontFamily: {
        display: ["'Playfair Display'", "'Cormorant Garamond'", "serif"],
        serif: ["'Cormorant Garamond'", "serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        navy: {
          DEFAULT: "hsl(var(--navy))",
          deep: "hsl(var(--navy-deep))",
          foreground: "hsl(var(--navy-foreground))",
        },
        gold: {
          DEFAULT: "hsl(var(--gold))",
          bright: "hsl(var(--gold-bright))",
          soft: "hsl(var(--gold-soft))",
          foreground: "hsl(var(--gold-foreground))",
        },
        ivory: "hsl(var(--ivory))",
        "elegant-grey": {
          DEFAULT: "hsl(var(--elegant-grey))",
          soft: "hsl(var(--elegant-grey-soft))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
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
      backgroundImage: {
        "hero-gradient": "var(--gradient-hero)",
        "gold-gradient": "var(--gradient-gold)",
        "radial-gold": "var(--gradient-radial-gold)",
        "section-gradient": "var(--gradient-section)",
        "dark-card": "var(--gradient-dark-card)",
      },
      boxShadow: {
        luxury: "var(--shadow-luxury)",
        gold: "var(--shadow-gold)",
        "card-soft": "var(--shadow-card)",
        elegant: "var(--shadow-elegant)",
      },
      keyframes: {
        "accordion-down": { from: { height: "0" }, to: { height: "var(--radix-accordion-content-height)" } },
        "accordion-up": { from: { height: "var(--radix-accordion-content-height)" }, to: { height: "0" } },
        "fade-up": { from: { opacity: "0", transform: "translateY(20px)" }, to: { opacity: "1", transform: "translateY(0)" } },
        "pulse-gold": {
          "0%, 100%": { boxShadow: "0 0 0 0 hsl(var(--gold) / 0.5)" },
          "50%": { boxShadow: "0 0 0 12px hsl(var(--gold) / 0)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-up": "fade-up 0.8s cubic-bezier(0.22, 1, 0.36, 1) both",
        "pulse-gold": "pulse-gold 2s ease-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};