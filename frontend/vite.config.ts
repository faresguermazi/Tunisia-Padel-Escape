import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import { unlink } from 'node:fs/promises'
import path from 'node:path'
import { hotelMedia } from './src/content/hotelMedia.ts'

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'exclude-local-hotel-photographs',
      apply: 'build',
      async writeBundle(options) {
        const output = path.resolve(options.dir!)
        for (const image of hotelMedia) {
          if (image.usage !== 'temporary-local') continue
          for (const source of [image.src, image.smallSrc].filter(Boolean)) {
            const filename = path.resolve(output, `.${source}`)
            if (!filename.startsWith(`${output}${path.sep}`))
              throw new Error(
                'Local media path must stay inside the build directory',
              )
            await unlink(filename).catch((error: NodeJS.ErrnoException) => {
              if (error.code !== 'ENOENT') throw error
            })
          }
        }
      },
    },
    ...(mode === 'review'
      ? [
          {
            name: 'review-no-index',
            transformIndexHtml() {
              return [
                {
                  tag: 'meta',
                  attrs: { name: 'robots', content: 'noindex, nofollow' },
                  injectTo: 'head' as const,
                },
              ]
            },
          },
        ]
      : []),
  ],
  build: { outDir: mode === 'review' ? 'dist-review' : 'dist' },
}))
