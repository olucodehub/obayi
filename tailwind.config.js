/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        primary: ['Montserrat', 'sans-serif'],
        secondary: ['Inter', 'sans-serif'],
      },
      colors: {
        cyan: {
          50: '#f0f9fc',  // Almost White Blue Tint
          100: '#e8f8fa', // Very Light Blue
          200: '#b3eaf4', // Light Sky Blue
          300: '#9ae3f4', // Pale Aqua
          400: '#6dd3e5', // Light Cyan Blue
          500: '#4bc3d6', // Soft Cyan Blue
          600: '#2e80b7', // Medium Blue
          700: '#171c36', // Very Dark Blue
        }
      },
      boxShadow: {
        'soft': '0 4px 20px rgba(0, 0, 0, 0.05)',
        'card': '0 2px 15px rgba(0, 0, 0, 0.08)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-pattern': "url('https://images.pexels.com/photos/935944/pexels-photo-935944.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750')",
      },
      transitionProperty: {
        'height': 'height',
        'spacing': 'margin, padding',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.5s ease-in',
        slideUp: 'slideUp 0.3s ease-out',
      },
    },
  },
  plugins: [],
};