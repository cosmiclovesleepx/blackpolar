/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/apps/**/views/**/*.ejs',
    './src/apps/**/public/**/*.js',
    './src/shared/styles/**/*.css',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Bebas Neue"', 'sans-serif'],
        body:    ['"DM Sans"', 'sans-serif'],
        mono:    ['"Space Mono"', 'monospace'],
      },
      colors: {
        'bp-black': '#080808',
        'bp-white': '#f5f5f0',
        'bp-gray':  '#1a1a1a',
        'bp-muted': '#888888',
      },
    },
  },
  plugins: [],
};
