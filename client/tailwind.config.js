/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#a49eff',
          DEFAULT: '#6C63FF', // Violet
          dark: '#5145e5',
        },
        secondary: {
          light: '#5ae3ff',
          DEFAULT: '#00D2FF', // Cyan
          dark: '#00a3cc',
        },
        accent: {
          light: '#ff9c9c',
          DEFAULT: '#FF6B6B', // Coral
          dark: '#e84e4e',
        },
        darkbg: '#1A1A2E',
        lightbg: '#F8F9FA',
      },
      fontFamily: {
        sans: ['Poppins', 'Outfit', 'Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'gradient-accent': 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        'gradient-secondary': 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      }
    },
  },
  plugins: [],
}
