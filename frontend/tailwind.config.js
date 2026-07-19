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
        "bg":                    "#080C0A",
        "surface":               "#0D1410",
        "surface-2":             "#111916",
        "surface-3":             "#161E1A",

        // Brand
        "primary":               "#00D46A",
        "primary-dark":          "#006B3F",
        "gold":                  "#F5C842",
        "emerald-accent":        "#10B981",

        // Text
        "ink":                   "#F0F0EE",
        "muted":                 "rgba(240,240,238,0.55)",
        "dim":                   "rgba(240,240,238,0.25)",

        // Status
        "danger":                "#FF4444",
        "warning-amber":         "#FFB800",

        // Legacy aliases — preserved for any remaining JSX references
        "primary-container":     "#008751",
        "on-primary":            "#080C0A",
        "on-primary-container":  "#F0F0EE",
        "surface-tint":          "#00D46A",
        "on-surface-variant":    "rgba(240,240,238,0.55)",
        "inverse-on-surface":    "#080C0A",
        "secondary-fixed-dim":   "#F5C842",
        "background":            "#080C0A",
        "tertiary":              "#FF4444",
        "on-surface":            "#F0F0EE",
        "on-error-container":    "#FF4444",
        "secondary":             "#F5C842",
        "secondary-container":   "rgba(245,200,66,0.15)",
        "surface-container-high":"#161E1A",
        "surface-container":     "#111916",
        "on-secondary-fixed":    "#080C0A",
        "on-secondary-container":"#F5C842",
        "error":                 "#FF4444",
        "tertiary-container":    "rgba(255,68,68,0.12)",
        "surface-container-lowest": "#080C0A",
        "pearl":                 "#0D1410",
        "titanium-white":        "#080C0A",
        "critical-red":          "#FF4444",
        "on-tertiary-container": "#F0F0EE",
        "on-tertiary":           "#F0F0EE",
        "surface-container-low": "#0D1410",
        "graphite":              "#F0F0EE",
        "outline-variant":       "rgba(255,255,255,0.07)",
        "surface":               "#0D1410",
        "surface-variant":       "#111916",
        "surface-dim":           "#080C0A",
        "outline":               "rgba(255,255,255,0.12)",
        "surface-container-highest": "#161E1A",
        "error-container":       "rgba(255,68,68,0.12)",
        "on-error":              "#F0F0EE",
        "inverse-surface":       "#F0F0EE",
        "surface-bright":        "#161E1A",
        "on-secondary":          "#080C0A",
        "on-background":         "#F0F0EE",
        "brand-dark":            "#080C0A",
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
        "glow-green": "0 0 0 1px rgba(0,212,106,0.20), 0 8px 32px rgba(0,212,106,0.15)",
        "glow-gold":  "0 0 32px rgba(245,200,66,0.20)",
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
