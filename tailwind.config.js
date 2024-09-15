/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        "logo-cloud": {
          
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(calc(-200%))" }, // Adjust the calculation to ensure smoother looping
        },
        'gradient-x': {
          '0%, 100%': { 'background-position': '0% 50%' },
          '50%': { 'background-position': '100% 50%' },
        },
      },
      animation: {
        "logo-cloud": "logo-cloud 60s linear infinite", // Slow down the animation to make it smoother
        'gradient-x': 'gradient-x 8s ease infinite',
      },
      plugins: [],
    },
  },
};
