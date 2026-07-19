/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    extend: {
      colors: {
        // ── ArenaFlow Night Stadium Dark Palette ──────────────────
        // Backgrounds
        "bg":                    "#0F061A",
        "surface":               "#171025",
        "surface-2":             "#221536",
        "surface-3":             "#2A1942",

        // Brand
        "primary":               "#6F00FF",
        "primary-dark":          "#3B0270",
        "gold":                  "#E9B3FB",
        "emerald-accent":        "#4ADE80",

        // Text
        "ink":                   "#FFFFFF",
        "muted":                 "rgba(255,255,255,0.55)",
        "dim":                   "rgba(255,255,255,0.25)",

        // Status
        "danger":                "#F87171",
        "warning-amber":         "#FACC15",

        // Legacy aliases — preserved for any remaining JSX references
        "primary-container":     "#008751",
        "on-primary":            "#0F061A",
        "on-primary-container":  "#FFFFFF",
        "surface-tint":          "#6F00FF",
        "on-surface-variant":    "rgba(255,255,255,0.55)",
        "inverse-on-surface":    "#0F061A",
        "secondary-fixed-dim":   "#E9B3FB",
        "background":            "#0F061A",
        "tertiary":              "#F87171",
        "on-surface":            "#FFFFFF",
        "on-error-container":    "#F87171",
        "secondary":             "#E9B3FB",
        "secondary-container":   "rgba(233,179,251,0.15)",
        "surface-container-high":"#2A1942",
        "surface-container":     "#221536",
        "on-secondary-fixed":    "#0F061A",
        "on-secondary-container":"#E9B3FB",
        "error":                 "#F87171",
        "tertiary-container":    "rgba(248,113,113,0.12)",
        "surface-container-lowest": "#0F061A",
        "pearl":                 "#171025",
        "titanium-white":        "#0F061A",
        "critical-red":          "#F87171",
        "on-tertiary-container": "#FFFFFF",
        "on-tertiary":           "#FFFFFF",
        "surface-container-low": "#171025",
        "graphite":              "#FFFFFF",
        "outline-variant":       "rgba(255,255,255,0.07)",
        "surface":               "#171025",
        "surface-variant":       "#221536",
        "surface-dim":           "#0F061A",
        "outline":               "rgba(255,255,255,0.12)",
        "surface-container-highest": "#2A1942",
        "error-container":       "rgba(248,113,113,0.12)",
        "on-error":              "#FFFFFF",
        "inverse-surface":       "#FFFFFF",
        "surface-bright":        "#2A1942",
        "on-secondary":          "#0F061A",
        "on-background":         "#FFFFFF",
        "brand-dark":            "#0F061A",
      },

      borderRadius: {
        DEFAULT:  "0.25rem",
        lg:       "0.5rem",
        xl:       "0.75rem",
        "2xl":    "1rem",
        "3xl":    "1.5rem",
        "4xl":    "2rem",
        "5xl":    "2.5rem",
        full:     "9999px",
      },

      spacing: {
        "container-padding": "80px",
        "section-margin":    "96px",
        "card-gap":          "24px",
        "base":              "8px",
        "gutter":            "24px",
      },

      boxShadow: {
        "card":       "0 4px 24px rgba(0,0,0,0.40), 0 1px 0 rgba(255,255,255,0.05) inset",
        "float":      "0 12px 40px rgba(0,0,0,0.60), 0 1px 0 rgba(255,255,255,0.06) inset",
        "lift":       "0 24px 64px rgba(0,0,0,0.70), 0 2px 0 rgba(255,255,255,0.08) inset",
        "glow-green": "0 0 0 1px rgba(111,0,255,0.20), 0 8px 32px rgba(111,0,255,0.15)",
        "glow-gold":  "0 0 32px rgba(233,179,251,0.20)",
        "inner-sm":   "inset 0 1px 3px rgba(0,0,0,0.40)",
        "dark-panel": "0 24px 80px rgba(0,0,0,0.70)",
      },

      fontFamily: {
        "display":              ["Mona Sans", "Hanken Grotesk", "sans-serif"],
        "body-md":              ["Inter", "sans-serif"],
        "headline-lg-mobile":   ["Mona Sans", "Hanken Grotesk", "sans-serif"],
        "body-lg":              ["Inter", "sans-serif"],
        "stats-numeric":        ["JetBrains Mono", "monospace"],
        "display-lg":           ["Mona Sans", "Hanken Grotesk", "sans-serif"],
        "headline-lg":          ["Mona Sans", "Hanken Grotesk", "sans-serif"],
        "label-caps":           ["JetBrains Mono", "monospace"],
        "headline-xl":          ["Mona Sans", "Hanken Grotesk", "sans-serif"],
        "title-md":             ["Mona Sans", "Hanken Grotesk", "sans-serif"],
        "sans":                 ["Inter", "Hanken Grotesk", "sans-serif"],
        "mono":                 ["JetBrains Mono", "monospace"],
      },

      fontSize: {
        "display-hero":  ["clamp(72px,8vw,120px)", { lineHeight: "0.95", letterSpacing: "-0.05em", fontWeight: "900" }],
        "display-lg":    ["clamp(56px,6vw,96px)",  { lineHeight: "1.0",  letterSpacing: "-0.04em", fontWeight: "800" }],
        "display-md":    ["clamp(40px,4vw,72px)",  { lineHeight: "1.05", letterSpacing: "-0.035em", fontWeight: "800" }],
        "headline-lg":   ["clamp(28px,3vw,48px)",  { lineHeight: "1.1",  letterSpacing: "-0.02em", fontWeight: "700" }],
        "headline-xl":   ["clamp(36px,4vw,56px)",  { lineHeight: "1.08", letterSpacing: "-0.025em", fontWeight: "800" }],
        "headline-lg-mobile": ["28px", { lineHeight: "1.15", fontWeight: "700" }],
        "title-md":      ["20px", { lineHeight: "1.3", fontWeight: "600" }],
        "body-lg":       ["18px", { lineHeight: "1.7", fontWeight: "400" }],
        "body-md":       ["15px", { lineHeight: "1.65", fontWeight: "400" }],
        "stats-numeric": ["32px", { lineHeight: "1.0", fontWeight: "700" }],
        "label-caps":    ["10px", { lineHeight: "1.4", letterSpacing: "0.12em", fontWeight: "700" }],
      },

      transitionDuration: {
        "fast": "150ms",
        "base": "220ms",
        "slow": "400ms",
      },

      transitionTimingFunction: {
        "apple":  "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        "spring": "cubic-bezier(0.34, 1.1, 0.64, 1.0)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
