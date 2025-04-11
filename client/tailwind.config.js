/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#4F46E5",
        secondary: "#6B7280",
        background: "#F3F4F6",
        "tag-high": "#FEE2E2",
        "tag-medium": "#FEF3C7",
        "tag-low": "#DBEAFE",
        "tag-work": "#E0E7FF",
        "tag-coding": "#DBEAFE",
      }
    },
  },
  plugins: [],
}

