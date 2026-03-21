/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Binance-inspired Palette
        'brand-yellow': '#FCD535',
        'binance-black': '#0B0E11',
        'binance-gray': '#1E2329',
        'binance-border': '#2B3139',
        'binance-text': '#EAECEF',
        'binance-muted': '#848E9C',
        'binance-green': '#0ECB81',
        'binance-red': '#F6465D',
        
        // Semantic Mappings
        'bg-dark': '#0B0E11',
        'bg-card': '#1E2329',
        'accent-gold': '#FCD535',
        'status-success': '#0ECB81',
        'status-error': '#F6465D',
      },
      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'binance': '0 4px 20px rgba(0, 0, 0, 0.4)',
        'glow-yellow': '0 0 15px rgba(252, 213, 53, 0.3)',
      }
    },
  },
  plugins: [],
}
