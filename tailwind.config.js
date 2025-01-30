/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./components/**/*.{jsx,tsx}", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
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
      },
      borderRadius: {
        lg: `var(--radius)`,
        md: `calc(var(--radius) - 2px)`,
        sm: "calc(var(--radius) - 4px)",
      },
      zIndex: {
        10: "10",
      },
    },
  },

  plugins: [require("tailwindcss-animate")],
  corePlugins: { gridTemplateRows: true },
  safelist: [
    "row-start-1",
    "h-fit",
    "place-self-center",
    "row-start-1",
    "row-end-2",
    "col-start-1",
    "col-end-2",
    { pattern: /text-(8xl|9xl)/ },
    {
      pattern: /text-(2|3|4|5|6|7)xl/,
    },
    { pattern: /font-(thin|light|black)/ },
    { pattern: /whitespace-(nowrap)/ },
    { pattern: /z-(20|30|40|50)/, variants: ["!"] },
  ],
}
