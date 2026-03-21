/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-dark': '#0A192F', // Azul Marino Profundo (Sidebar)
        'bg-light': '#F5F8FC', // Soft blue-gray for main dashboard area
        'card-dark': '#112240', // Deep Navy Elevated
        'card-light': '#FFFFFF', // Pure white for cards
        'accent-gold': '#F4B41A', // Oro Mate Andino
        'accent-red': '#A31621', // Rojo Carmesí
        'text-smoke': '#E6F1FF', // Blanco Humo
        // Retaining some legacy tokens mapped to the new palette to avoid immediate breaks
        'accent-blue': '#F4B41A', // mapped to gold
        'accent-purple': '#F4B41A', // mapped to gold
        'accent-pink': '#A31621', // mapped to red
        'text-gray': '#8892B0', // Soft navy-slate for secondary descriptive text
        'status-blue': '#4CA5FF',
        'status-red': '#A31621',
        'status-purple': '#F4B41A',
      },
      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-web3': 'linear-gradient(135deg, #F4B41A 0%, #D4AF37 100%)',
        'gradient-web3-hover': 'linear-gradient(135deg, #FFC13B 0%, #F4B41A 100%)',
        'gradient-danger': 'linear-gradient(135deg, #A31621 0%, #D32F2F 100%)',
      },
      boxShadow: {
        'soft': '0 8px 30px rgba(10, 25, 47, 0.04)', // Clean Coinspace soft shadow
        'soft-hover': '0 12px 40px rgba(10, 25, 47, 0.08)',
        'glow-blue': '0 0 20px rgba(76, 165, 255, 0.4)',
        'glow-purple': '0 0 20px rgba(244, 180, 26, 0.4)', // Mapped to gold glow
        'glow-red': '0 0 20px rgba(163, 22, 33, 0.4)', // Crimson glow
        'glow-gold': '0 0 20px rgba(244, 180, 26, 0.5)',
      }
    },
  },
  plugins: [],
}
