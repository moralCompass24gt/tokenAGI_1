/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}", "./utils/**/*.{js,ts,jsx,tsx}"],
  plugins: [require("daisyui")],
  darkTheme: "scaffoldEthDark",
  // DaisyUI theme colors
  daisyui: {
    themes: [
      {
        scaffoldEth: {
          primary: "#93BBFB",
          "primary-content": "#212638",
          secondary: "#DAE8FF",
          "secondary-content": "#212638",
          accent: "#93BBFB",
          "accent-content": "#212638",
          neutral: "#212638",
          "neutral-content": "#ffffff",
          "base-100": "#ffffff",
          "base-200": "#f4f8ff",
          "base-300": "#DAE8FF",
          "base-content": "#212638",
          info: "#93BBFB",
          success: "#34EEB6",
          warning: "#FFCF72",
          error: "#FF8863",

          "--rounded-btn": "9999rem",

          ".tooltip": {
            "--tooltip-tail": "6px",
          },
        },
      },
      {
        scaffoldEthDark: {
          primary: "#212638",
          "primary-content": "#F9FBFF",
          secondary: "#323f61",
          "secondary-content": "#F9FBFF",
          accent: "#4969A6",
          "accent-content": "#F9FBFF",
          neutral: "#F9FBFF",
          "neutral-content": "#385183",
          "base-100": "#385183",
          "base-200": "#2A3655",
          "base-300": "#212638",
          "base-content": "#F9FBFF",
          info: "#385183",
          success: "#34EEB6",
          warning: "#FFCF72",
          error: "#FF8863",

          "--rounded-btn": "9999rem",

          ".tooltip": {
            "--tooltip-tail": "6px",
            "--tooltip-color": "hsl(var(--p))",
          },
        },
      },
      {
        exampleUi: {
          primary: "#000000",
          "primary-content": "#ffffff",
          secondary: "#FF6644",
          "secondary-content": "#212638",
          accent: "#93BBFB",
          "accent-content": "#212638",
          neutral: "#f3f3f3",
          "neutral-content": "#212638",
          "base-100": "#ffffff",
          "base-200": "#f1f1f1",
          "base-300": "#d0d0d0",
          "base-content": "#212638",
          info: "#93BBFB",
          success: "#34EEB6",
          warning: "#FFCF72",
          error: "#FF8863",

          "--rounded-btn": "9999rem",

          ".tooltip": {
            "--tooltip-tail": "6px",
          },
        },
      },
    ],
  },
  theme: {
    // // Extend Tailwind classes (e.g. font-bai-jamjuree, animate-grow)
    // extend: {
    //   fontFamily: {
    //     "bai-jamjuree": ["Bai Jamjuree", "sans-serif"],
    //   },
    //   boxShadow: {
    //     center: "0 0 12px -2px rgb(0 0 0 / 0.05)",
    //   },
    //   keyframes: {
    //     grow: {
    //       "0%": {
    //         width: "0%",
    //       },
    //       "100%": {
    //         width: "100%",
    //       },
    //     },
    //     zoom: {
    //       "0%, 100%": { transform: "scale(1, 1)" },
    //       "50%": { transform: "scale(1.1, 1.1)" },
    //     },
    //   },
    //   animation: {
    //     grow: "grow 5s linear infinite",
    //     "pulse-fast": "pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite",
    //     zoom: "zoom 1s ease infinite",
    //   },
    // },
    fontFamily: {
      sans: ["var(--font-sans)", "sans-serif"],
      code: ["var(--font-code)", "monospace"],
    },
    colors: {
      transparent: "transparent",
      "ac-1": "#833FFF",
      "ac-2": "#0A9F19",
      "ac-3": "#767676",
      "ac-4": "#D80B30",
      "fg-1": "#EDE3FF",
      "fg-2": "#D9FFDD",
      "fg-3": "#EBEBEB",
      "fg-4": "#FFD9E0",
      "bd-1": "#E3E3E3",
      "ft-1": "#000000",
      "ft-2": "#A0A0A0",
      "bg-1": "#FFFFFF",
      "bg-2": "#F7F7F7",
      "bg-3": "#F5F5F5",
      "bg-lt": "#FAFAFA",
      "bg-tm": "#2e99db",
    },
    extend: {
      backgroundImage: {
        "gr-1": "linear-gradient(#8A4EF4, #5100E3)",
      },
      boxShadow: {
        article: "inset 3px 3px 15px rgba(0, 0, 0, 0.03)",
        section: "inset 1px 1px 8px rgba(0, 0, 0, 0.05)",
      },
      animation: {
        "bounce-fast": "bounce 300ms ease-in-out infinite",
        "spin-fast": "spin 300ms ease-in-out infinite",
      },
    },
  },
};
