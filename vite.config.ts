import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default async () => {
  const UnoCSS = (await import('unocss/vite')).default

  return defineConfig({
    envDir: './env',
    plugins: [uni(), UnoCSS()],
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
