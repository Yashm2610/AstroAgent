/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        astro: {
          bg: '#0a0b16',        // Deep cosmos background
          card: 'rgba(20, 22, 45, 0.6)', // Glassmorphism card background
          cardBorder: 'rgba(212, 175, 55, 0.15)', // Soft gold border
          gold: '#dfb73c',      // Warm gold accent
          goldHover: '#cda22b', // Darker gold hover
          purple: '#7d52ff',    // Soft purple glow
          purpleHover: '#6a3df7',
          indigo: '#181b3a',    // Rich dark indigo
          textMain: '#f0f2fa',  // Premium bright text
          textMuted: '#9aa0c2', // Soft blue-gray text
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 20px rgba(125, 82, 255, 0.15)',
        goldGlow: '0 0 15px rgba(223, 183, 60, 0.1)',
      }
    },
  },
  plugins: [],
}
