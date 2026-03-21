/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Institutional Navy Palette
        'brand-yellow': '#3b82f6', // Mapped to blue-500 for backwards compatibility
        'binance-black': '#0f172a', // Slate 900
        'binance-gray': '#1e293b', // Slate 800
        'binance-border': '#334155', // Slate 700
        'binance-text': '#f8fafc', // Slate 50
        'binance-muted': '#94a3b8', // Slate 400
        'binance-green': '#10b981', // Emerald 500
        'binance-red': '#ef4444', // Red 500
        
        // Semantic Mappings
        'bg-dark': '#0f172a',
        'bg-card': '#1e293b',
        'accent-gold': '#3b82f6',
        'status-success': '#10b981',
        'status-error': '#ef4444',
      },
      fontFamily: {
        'sans': ['IBM Plex Sans', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'binance': '0 4px 20px rgba(0, 0, 0, 0.4)',
        'glow-yellow': '0 0 15px rgba(252, 213, 53, 0.3)',
      }
    },
  },
  plugins: [],
}
