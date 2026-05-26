import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default {
  content: ['./index.html', './src/**/*.{vue,js,ts}'],
  theme: {
    extend: {
      colors: {
        primary: '#2d6a4f',
        secondary: '#52b788',
        accent: '#74c69d',
        background: '#f4f9f4',
      },
    },
  },
  plugins: [],
}
