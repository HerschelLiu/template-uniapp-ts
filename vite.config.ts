import { resolve } from 'path'

import uni from '@dcloudio/vite-plugin-uni'
import Optimization from '@uni-ku/bundle-optimizer'
import AutoImport from 'unplugin-auto-import/vite'
import { defineConfig } from 'vite'
import eslint from 'vite-plugin-eslint'

// https://vitejs.dev/config/
export default async () => {
  const UnoCSS = (await import('unocss/vite')).default

  return defineConfig({
    envDir: './env',
    plugins: [
      uni(),
      UnoCSS(),
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
        dts: 'src/types/auto-import.d.ts',
        dirs: ['src/store', 'src/hooks', 'src/utils', 'src/api/**', 'src/enum'],
        vueTemplate: true,
        eslintrc: {
          enabled: true
        }
      }),
      Optimization({
        enable: {
          optimization: true,
          'async-import': true,
          'async-component': true
        },
        dts: {
          base: 'src/types'
        },
        logger: false
      }),
      eslint()
    ],
    resolve: {
      alias: {
        '@': resolve(__dirname, './src')
      }
    },
    css: {
      preprocessorOptions: {
        scss: {
          // additionalData: `@use '@/styles/mixin.scss' as *;`
        }
      }
    }
  })
}
