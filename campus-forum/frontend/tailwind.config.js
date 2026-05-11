/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      maxWidth: {
        content: '1200px',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
        float: 'float 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
      },
    },
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      {
        light: {
          ...require('daisyui/src/theming/themes')['light'],
          primary: '#6366f1',
          'primary-content': '#ffffff',
          secondary: '#8b5cf6',
          'secondary-content': '#ffffff',
          accent: '#06b6d4',
          'accent-content': '#ffffff',
          neutral: '#1e293b',
          'neutral-content': '#f8fafc',
          'base-100': '#ffffff',
          'base-200': '#f1f5f9',
          'base-300': '#e2e8f0',
          'base-content': '#0f172a',
          info: '#3b82f6',
          success: '#10b981',
          warning: '#f59e0b',
          error: '#ef4444',
          '--rounded-box': '1rem',
          '--rounded-btn': '0.75rem',
          '--rounded-badge': '1.9rem',
          '--animation-btn': '0.25s',
          '--btn-focus-scale': '0.97',
        },
      },
      {
        dark: {
          ...require('daisyui/src/theming/themes')['dark'],
          primary: '#818cf8',
          'primary-content': '#0f172a',
          secondary: '#a78bfa',
          'secondary-content': '#0f172a',
          accent: '#22d3ee',
          'accent-content': '#0f172a',
          neutral: '#1e293b',
          'neutral-content': '#f8fafc',
          'base-100': '#0f172a',
          'base-200': '#1e293b',
          'base-300': '#334155',
          'base-content': '#e2e8f0',
          info: '#60a5fa',
          success: '#34d399',
          warning: '#fbbf24',
          error: '#f87171',
          '--rounded-box': '1rem',
          '--rounded-btn': '0.75rem',
          '--rounded-badge': '1.9rem',
          '--animation-btn': '0.25s',
          '--btn-focus-scale': '0.97',
        },
      },
    ],
  },
};
