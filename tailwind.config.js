/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // We'll support dark mode manually via a class on HTML/body or a wrapper, like the original
  theme: {
    extend: {
      colors: {
        background: 'var(--bg)',
        panel: 'var(--panel)',
        panelSolid: 'var(--panelSolid)',
        textMain: 'var(--text)',
        muted: 'var(--muted)',
        borderMain: 'var(--border)',
        primary: {
          500: 'var(--primary)',
          600: 'var(--primary2)',
        },
        danger: 'var(--danger)',
        success: 'var(--success)',
        warning: 'var(--warning)',
      },
      boxShadow: {
        'panel': 'var(--shadow)',
      }
    },
  },
  plugins: [],
}
