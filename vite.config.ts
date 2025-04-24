import path from 'path'

import uni from '@dcloudio/vite-plugin-uni'
import AutoImport from 'unplugin-auto-import/vite'
import { defineConfig } from 'vite'
import eslint from 'vite-plugin-eslint'

// https://vitejs.dev/config/
export default defineConfig(async (): Promise<import('vite').UserConfig> => {
  const UnoCss = await import('unocss/vite').then(i => i.default)

  return {
    plugins: [
      uni(),
      UnoCss(),
      AutoImport({
        imports: [
          'pinia',
          'vue',
          'uni-app',
          {
            validing: [['default', 'validing']]
          },
          {
            '@/utils/uniProxy': [['default', 'upp']]
          },
          {
            '@/settings': [['default', 'settings']]
          },
          {
            '@/store': [['default', 'pinia']]
          }
        ],
        dts: 'types/auto-imports.d.ts',
        dirs: ['src/store', 'src/hooks', 'src/utils', 'src/api/**', 'src/enum'],
        eslintrc: {
          enabled: true
        },
        vueTemplate: true
      }),
      eslint()
    ],
    build: {
      sourcemap: false,
      minify: 'esbuild',
      cssTarget: 'chrome61',
      rollupOptions: {
        cache: true
      }
    },
    optimizeDeps: {
      include: ['vue', 'pinia', '@dcloudio/uni-app'],
      exclude: ['vue-demi'],
      needsInterop: undefined
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src')
      }
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@use '@/styles/mixin.scss' as *;`
        }
      }
    }
  }
})
