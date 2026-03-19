/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Outfit', 'DM Sans', 'sans-serif'],
      },
      colors: {
        brand: {
          DEFAULT: '#1a5f7a',
          dark:    '#0f3d52',
          mid:     '#4a9ab5',
          light:   '#e4f4fa',
          xlight:  '#f0f9fd',
        },
        teal: {
          DEFAULT: '#0d9488',
          light:   '#ccfbf1',
          mid:     '#2dd4bf',
        },
        ink: {
          DEFAULT: '#0d1f2d',
          secondary: '#3f5666',
          muted:     '#7a95a3',
          faint:     '#b0c7d1',
        },
        surface: {
          DEFAULT: '#ffffff',
          subtle:  '#f5f9fb',
          raised:  '#edf4f7',
        },
        border: {
          DEFAULT: '#d8e8ef',
          strong:  '#b0c8d4',
        },
        success: {
          DEFAULT: '#059669',
          light:   '#d1fae5',
        },
        warning: {
          DEFAULT: '#d97706',
          light:   '#fef3c7',
        },
        danger: {
          DEFAULT: '#dc2626',
          light:   '#fee2e2',
        },
      },
      spacing: {
        '0.5': '2px',
        '1':   '4px',
        '2':   '8px',
        '3':   '12px',
        '4':   '16px',
        '5':   '20px',
        '6':   '24px',
        '8':   '32px',
        '10':  '40px',
        '12':  '48px',
      },
      borderRadius: {
        sm:  '6px',
        DEFAULT: '8px',
        md:  '10px',
        lg:  '12px',
        xl:  '16px',
      },
      boxShadow: {
        card: '0 1px 4px 0 rgba(13,31,45,0.07), 0 2px 12px 0 rgba(13,31,45,0.05)',
        modal: '0 8px 32px 0 rgba(13,31,45,0.18)',
        nav: '0 -1px 0 0 #d8e8ef, 0 -4px 16px 0 rgba(13,31,45,0.06)',
      },
    },
  },
  plugins: [],
}
