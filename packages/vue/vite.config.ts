import vue from '@vitejs/plugin-vue'
import VueJSX from '@vitejs/plugin-vue-jsx'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    VueJSX(),
  ],
  build: {
    lib: {
      entry: {
        index: 'src/index.ts',
      },
      formats: ['cjs', 'es'],
    },
  },
})
