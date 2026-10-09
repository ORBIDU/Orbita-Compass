import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Membaca .env dan variabel lingkungan hosting (mis. Cloudflare Pages).
  const env = loadEnv(mode, import.meta.dirname, 'VITE_')
  const useMock = env.VITE_USE_MOCK === 'true'

  return {
    plugins: [
      react(),
      {
        // Situs demo (mode dummy) tidak boleh muncul di mesin pencari.
        name: 'orbidu-demo-noindex',
        transformIndexHtml: () => (useMock ? [{ tag: 'meta', attrs: { name: 'robots', content: 'noindex' }, injectTo: 'head' }] : []),
      },
    ],
    // USE_MOCK diganti teks true/false di setiap file saat build, supaya cabang
    // mode dummy (termasuk import() ke src/mocks/) benar-benar dibuang dari
    // build mode backend. Konstanta yang diimpor dari file lain tidak dilipat.
    define: {
      USE_MOCK: JSON.stringify(useMock),
    },
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname, './src'),
      },
    },
  }
})
