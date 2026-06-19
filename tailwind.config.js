export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Now you can use classes like `bg-brand`, `text-brand`, `bg-app`
        app: 'var(--bg-app)',
        brand: {
          DEFAULT: 'var(--color-primary)',
          hover: 'var(--color-primary-hover)',
        },
        main: 'var(--text-main)',
      },
    },
  },
  plugins: [],
};
