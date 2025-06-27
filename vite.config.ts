import { resolve } from 'path'

import uni from '@dcloudio/vite-plugin-uni'
import Optimization from '@uni-ku/bundle-optimizer'
import AutoImport from 'unplugin-auto-import/vite'
import { defineConfig } from 'vite'
import eslint from 'vite-plugin-eslint'
import ViteRestart from 'vite-plugin-restart'

// https://vitejs.dev/config/
export default async ({ mode }) => {
  const UnoCSS = (await import('unocss/vite')).default

  const { UNI_PLATFORM } = process.env

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
      eslint(),
      ViteRestart({
        // 通过这个插件，在修改vite.config.js文件则不需要重新运行也生效配置
        restart: ['vite.config.ts']
      })
    ],
    resolve: {
      alias: {
        '@': resolve(__dirname, './src')
      }
    },
    define: {
      __UNI_PLATFORM__: JSON.stringify(UNI_PLATFORM)
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@import '@/styles/mixin.scss';@import "@/styles/_variable.scss;`
        }
      }
    }
  })
}
