import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: 'src/option-list-editor.ts',
      formats: ['es']
    },
    rollupOptions: {
      external: /^lit/
    }
  }
})
