import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    // react(), 
    VitePWA({
    // injectRegister: null,
    // strategies:'injectManifest',
    // filename:'service-worker.ts',
    // srcDir: 'src',
    // devOptions: {
    //   enabled: true,
    //   type: "module",
    // },
    registerType: 'autoUpdate',
      devOptions: {
        enabled: true
      }
  })],
})
