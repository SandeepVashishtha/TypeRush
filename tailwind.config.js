/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,mdx}",
    "./pages/**/*.{js,jsx,mdx}",
    "./components/**/*.{js,jsx,mdx}",
    "./lib/**/*.{js,jsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        arcade: {
          bg: "#080c14",
          card: "#0f172a",
          border: "#1e293b",
          neonPink: "#ff0055",
          neonCyan: "#00f0ff",
          neonYellow: "#ffe600",
          neonPurple: "#a855f7",
          neonGreen: "#10b981",
          nitro: "#38bdf8",
        },
      },
      fontFamily: {
        sans: ["Outfit", "system-ui", "-apple-system", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      boxShadow: {
        "neon-cyan": "0 0 15px rgba(0, 240, 255, 0.4), 0 0 30px rgba(0, 240, 255, 0.2)",
        "neon-pink": "0 0 15px rgba(255, 0, 85, 0.4), 0 0 30px rgba(255, 0, 85, 0.2)",
        "neon-yellow": "0 0 15px rgba(255, 230, 0, 0.4), 0 0 30px rgba(255, 230, 0, 0.2)",
        "neon-purple": "0 0 15px rgba(168, 85, 247, 0.4), 0 0 30px rgba(168, 85, 247, 0.2)",
        "nitro-glow": "0 0 20px rgba(56, 189, 248, 0.6), 0 0 40px rgba(56, 189, 248, 0.3)",
      },
      animation: {
        "pulse-fast": "pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "glow-bounce": "glowBounce 2s ease-in-out infinite",
        "speed-line": "speedLine 0.5s linear infinite",
        "road-scroll": "roadScroll 0.8s linear infinite",
      },
      keyframes: {
        glowBounce: {
          "0%, 100%": { transform: "translateY(0)", filter: "drop-shadow(0 0 8px rgba(0,240,255,0.6))" },
          "50%": { transform: "translateY(-4px)", filter: "drop-shadow(0 0 16px rgba(0,240,255,0.9))" },
        },
      },
    },
  },
  plugins: [],
};
