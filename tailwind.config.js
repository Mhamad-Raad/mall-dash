/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './src/pages/**/*.{js,jsx,ts,tsx}',
    './src/components/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        // Light theme (default)
        background: '#ffffff',
        foreground: '#0f172a',
        card: '#ffffff',
        'card-foreground': '#0f172a',
        primary: {
          DEFAULT: '#3b82f6',
          foreground: '#ffffff',
        },
        secondary: {
          DEFAULT: '#f1f5f9',
          foreground: '#0f172a',
        },
        muted: {
          DEFAULT: '#f1f5f9',
          foreground: '#64748b',
        },
        accent: {
          DEFAULT: '#f1f5f9',
          foreground: '#0f172a',
        },
        destructive: {
          DEFAULT: '#ef4444',
          foreground: '#ffffff',
        },
        border: '#e2e8f0',
        input: '#e2e8f0',
        ring: '#3b82f6',

        // Dark theme colors
        dark: {
          background: '#0f172a',
          foreground: '#f8fafc',
          card: '#1e293b',
          'card-foreground': '#f8fafc',
          primary: {
            DEFAULT: '#60a5fa',
            foreground: '#0f172a',
          },
          secondary: {
            DEFAULT: '#1e293b',
            foreground: '#f8fafc',
          },
          muted: {
            DEFAULT: '#1e293b',
            foreground: '#94a3b8',
          },
          accent: {
            DEFAULT: '#1e293b',
            foreground: '#f8fafc',
          },
          destructive: {
            DEFAULT: '#dc2626',
            foreground: '#f8fafc',
          },
          border: '#334155',
          input: '#334155',
          ring: '#60a5fa',
        },

        // Night theme colors (true black for OLED)
        night: {
          background: '#000000',
          foreground: '#f8fafc',
          card: '#0a0a0a',
          'card-foreground': '#f8fafc',
          primary: {
            DEFAULT: '#60a5fa',
            foreground: '#000000',
          },
          secondary: {
            DEFAULT: '#1a1a1a',
            foreground: '#f8fafc',
          },
          muted: {
            DEFAULT: '#1a1a1a',
            foreground: '#94a3b8',
          },
          accent: {
            DEFAULT: '#1a1a1a',
            foreground: '#f8fafc',
          },
          destructive: {
            DEFAULT: '#dc2626',
            foreground: '#f8fafc',
          },
          border: '#262626',
          input: '#262626',
          ring: '#60a5fa',
        },
      },
      borderRadius: {
        lg: '0.5rem',
        md: '0.375rem',
        sm: '0.25rem',
      },
    },
  },
  plugins: [],
};

