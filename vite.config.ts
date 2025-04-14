import path from 'path'

import uni from '@dcloudio/vite-plugin-uni'
import { defineConfig } from 'vite'
import eslint from 'vite-plugin-eslint'

// https://vitejs.dev/config/
export default defineConfig(async () => {
  const UnoCss = await import('unocss/vite').then(i => i.default)
  const { default: AutoImport } = await import('unplugin-auto-import/vite')

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
