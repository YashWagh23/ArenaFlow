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
        "bg":                    "#1A1A00",
        "surface":               "#24240A",
        "surface-2":             "#24240A",
        "surface-3":             "#2D2D12",

        // Brand
        "primary":               "#FFFFCC",
        "primary-dark":          "#E9F4A8",
        "gold":                  "#E9F4A8",
        "emerald-accent":        "#74D680",

        // Text
        "ink":                   "#FFFFCC",
        "muted":                 "rgba(255,255,204,0.55)",
        "dim":                   "rgba(255,255,204,0.25)",

        // Status
        "danger":                "#E86C5D",
        "warning-amber":         "#F3C969",

        // Legacy aliases — preserved for any remaining JSX references
        "primary-container":     "#008751",
        "on-primary":            "#1A1A00",
        "on-primary-container":  "#FFFFCC",
        "surface-tint":          "#FFFFCC",
        "on-surface-variant":    "rgba(255,255,204,0.55)",
        "inverse-on-surface":    "#1A1A00",
        "secondary-fixed-dim":   "#E9F4A8",
        "background":            "#1A1A00",
        "tertiary":              "#E86C5D",
        "on-surface":            "#FFFFCC",
        "on-error-container":    "#E86C5D",
        "secondary":             "#E9F4A8",
        "secondary-container":   "rgba(233,244,168,0.15)",
        "surface-container-high":"#2D2D12",
        "surface-container":     "#24240A",
        "on-secondary-fixed":    "#1A1A00",
        "on-secondary-container":"#E9F4A8",
        "error":                 "#E86C5D",
        "tertiary-container":    "rgba(232,108,93,0.12)",
        "surface-container-lowest": "#1A1A00",
        "pearl":                 "#24240A",
        "titanium-white":        "#1A1A00",
        "critical-red":          "#E86C5D",
        "on-tertiary-container": "#FFFFCC",
        "on-tertiary":           "#FFFFCC",
        "surface-container-low": "#24240A",
        "graphite":              "#FFFFCC",
        "outline-variant":       "rgba(255,255,204,0.07)",
        "surface":               "#24240A",
        "surface-variant":       "#24240A",
        "surface-dim":           "#1A1A00",
        "outline":               "rgba(255,255,204,0.12)",
        "surface-container-highest": "#2D2D12",
        "error-container":       "rgba(232,108,93,0.12)",
        "on-error":              "#FFFFCC",
        "inverse-surface":       "#FFFFCC",
        "surface-bright":        "#2D2D12",
        "on-secondary":          "#1A1A00",
        "on-background":         "#FFFFCC",
        "brand-dark":            "#1A1A00",
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
        "card":       "0 4px 24px rgba(0,0,0,0.40), 0 1px 0 rgba(255,255,204,0.05) inset",
        "float":      "0 12px 40px rgba(0,0,0,0.60), 0 1px 0 rgba(255,255,204,0.06) inset",
        "lift":       "0 24px 64px rgba(0,0,0,0.70), 0 2px 0 rgba(255,255,204,0.08) inset",
        "glow-green": "0 0 0 1px rgba(255,255,204,0.20), 0 8px 32px rgba(255,255,204,0.15)",
        "glow-gold":  "0 0 32px rgba(233,244,168,0.20)",
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
