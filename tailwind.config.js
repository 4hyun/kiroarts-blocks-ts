/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ["./components/**/*.{ts,jsx,tsx}", "./src/**/*.{js,ts,jsx,tsx,php}"],
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
        lg: "`var(--radius)`",
        md: "`calc(var(--radius) - 2px)`",
        sm: "calc(var(--radius) - 4px)",
      },
      zIndex: {
        10: "10",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
  safelist: [
    "row-start-1",
    "h-fit",
    "place-self-center",
    "row-start-1",
    "row-end-2",
    "col-start-1",
    "col-end-2",
    "!text-right",
    { pattern: /grid-rows-.+/, variants: ["sm", "md", "lg"] },
    { pattern: /col-.+/, variants: ["sm", "md", "lg"] },
    {
      pattern: /text-(2|3|4|5|6|7|8|9)xl/,
      variants: ["sm", "md", "lg"],
    },
    { pattern: /text-(xs|sm|base)/, variants: ["sm", "md"] },
    { pattern: /text-(right)/ },
    { pattern: /font-(thin|light|black)/ },
    { pattern: /whitespace-(nowrap)/ },
    { pattern: /z-(20|30|40|50)/, variants: ["!"] },
    { pattern: /py-(2)/, variants: ["md"] },
    { pattern: /flex/, variants: ["sm", "md"] },
    { pattern: /hidden/, variants: ["sm", "md", "lg"] },
    { pattern: /rounded-(sm)/ },
  ],
}
