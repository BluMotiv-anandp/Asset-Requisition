/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#111111',
        paper: '#FFFFFF',
        muted: '#888888',
        border: '#E2E8F0',
        'brand-deep': '#1E3A8A',
        'brand-mid': '#3B82F6',
        'brand-teal': '#0D9488',
        'brand-purple': '#7C3AED',
        'brand-coral': '#F97316',
        'brand-light': '#EFF6FF',
        'brand-soft': '#F0F9FF',
      },
      fontFamily: {
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'sans-serif',
        ],
      },
      backgroundImage: {
        'gradient-chat': 'linear-gradient(180deg, #1E3A8A 0%, #0D9488 100%)',
        'gradient-brand': 'linear-gradient(135deg, #3B82F6 0%, #7C3AED 100%)',
        'gradient-btn': 'linear-gradient(135deg, #3B82F6 0%, #7C3AED 100%)',
        'gradient-btn-hover': 'linear-gradient(135deg, #2563EB 0%, #6D28D9 100%)',
        'gradient-avatar': 'linear-gradient(135deg, #3B82F6 0%, #7C3AED 100%)',
        'gradient-header': 'linear-gradient(90deg, #3B82F6 0%, #0D9488 100%)',
      },
      boxShadow: {
        'card': '0 4px 24px rgba(0, 0, 0, 0.08)',
        'card-hover': '0 8px 32px rgba(0, 0, 0, 0.12)',
        'bubble': '0 2px 12px rgba(0, 0, 0, 0.06)',
        'input': '0 2px 16px rgba(0, 0, 0, 0.06)',
      },
    },
  },
  plugins: [],
};
