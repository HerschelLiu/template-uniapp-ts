import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'
import { resolve } from 'path'
import AutoImport from 'unplugin-auto-import/vite'

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
      })
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
