import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'
import { resolve } from 'path'

// Check if we're building the demo for GitHub Pages
const isDemoBuild = process.env.DEMO_BUILD === 'true'

export default defineConfig({
  plugins: [
    vue(),
    // Only generate types for library build
    !isDemoBuild && dts({
      include: ['src/**/*.ts', 'src/**/*.vue'],
      outDir: 'dist',
      copyDtsFiles: true,
      staticImport: true,
      insertTypesEntry: true,
      rollupTypes: true
    })
  ].filter(Boolean),

  // Base path for GitHub Pages (replace 'bottom-sheet-wrappers' with your repo name)
  base: isDemoBuild ? '/bottom-sheet-wrappers/' : '/',

  build: isDemoBuild ? {
    // Demo build configuration
    outDir: 'dist-demo',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html')
      }
    }
  } : {
    // Library build configuration
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'BottomSheetWrappers',
      fileName: (format) => `bottom-sheet-wrappers.${format}.js`
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        exports: 'named',
        globals: {
          vue: 'Vue'
        },
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'style.css') return 'bottom-sheet-wrappers.css'
          return assetInfo.name
        }
      }
    }
  },

  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  }
})
