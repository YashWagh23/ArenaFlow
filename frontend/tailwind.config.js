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
        "bg":                    "#F7F6F1",
        "surface":               "#FFFFFF",
        "surface-2":             "#F2F1EA",
        "surface-3":             "#FFFFFF",

        // Brand
        "primary":               "#2E7D32",
        "primary-dark":          "#1B5E20",
        "gold":                  "#6BCB6E",
        "emerald-accent":        "#2E7D32",

        // Text
        "ink":                   "#1C1C1C",
        "muted":                 "rgba(28,28,28,0.55)",
        "dim":                   "rgba(28,28,28,0.25)",

        // Status
        "danger":                "#C84A4A",
        "warning-amber":         "#C48A00",

        // Legacy aliases — preserved for any remaining JSX references
        "primary-container":     "#008751",
        "on-primary":            "#F7F6F1",
        "on-primary-container":  "#1C1C1C",
        "surface-tint":          "#2E7D32",
        "on-surface-variant":    "rgba(28,28,28,0.55)",
        "inverse-on-surface":    "#F7F6F1",
        "secondary-fixed-dim":   "#6BCB6E",
        "background":            "#F7F6F1",
        "tertiary":              "#C84A4A",
        "on-surface":            "#1C1C1C",
        "on-error-container":    "#C84A4A",
        "secondary":             "#6BCB6E",
        "secondary-container":   "rgba(107,203,110,0.15)",
        "surface-container-high":"#FFFFFF",
        "surface-container":     "#F2F1EA",
        "on-secondary-fixed":    "#F7F6F1",
        "on-secondary-container":"#6BCB6E",
        "error":                 "#C84A4A",
        "tertiary-container":    "rgba(200,74,74,0.12)",
        "surface-container-lowest": "#F7F6F1",
        "pearl":                 "#FFFFFF",
        "titanium-white":        "#F7F6F1",
        "critical-red":          "#C84A4A",
        "on-tertiary-container": "#1C1C1C",
        "on-tertiary":           "#1C1C1C",
        "surface-container-low": "#FFFFFF",
        "graphite":              "#1C1C1C",
        "outline-variant":       "rgba(0,0,0,0.07)",
        "surface":               "#FFFFFF",
        "surface-variant":       "#F2F1EA",
        "surface-dim":           "#F7F6F1",
        "outline":               "rgba(0,0,0,0.12)",
        "surface-container-highest": "#FFFFFF",
        "error-container":       "rgba(200,74,74,0.12)",
        "on-error":              "#1C1C1C",
        "inverse-surface":       "#1C1C1C",
        "surface-bright":        "#FFFFFF",
        "on-secondary":          "#F7F6F1",
        "on-background":         "#1C1C1C",
        "brand-dark":            "#F7F6F1",
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
        "card":       "0 6px 18px rgba(0,0,0,0.05)",
        "float":      "0 12px 30px rgba(0,0,0,0.08)",
        "lift":       "0 20px 40px rgba(0,0,0,0.12)",
        "glow-green": "0 8px 32px rgba(0,0,0,0.05)",
        "glow-gold":  "0 8px 32px rgba(0,0,0,0.05)",
        "inner-sm":   "inset 0 1px 3px rgba(0,0,0,0.05)",
        "dark-panel": "0 12px 32px rgba(0,0,0,0.08)",
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
