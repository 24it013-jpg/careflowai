import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import tsconfigPaths from "vite-tsconfig-paths"
import { VitePWA } from "vite-plugin-pwa"
import { compression } from 'vite-plugin-compression2'

export default defineConfig({
    plugins: [
        react(),
        tsconfigPaths(),
        compression(),
        VitePWA({
            registerType: 'autoUpdate',
            useCredentials: true,
            includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
            manifest: {
                name: 'CAREflow AI',
                short_name: 'CAREflow',
                description: 'AI-Powered Healthcare Companion',
                theme_color: '#ffffff',
                icons: [
                    {
                        src: 'icon.svg',
                        sizes: '192x192 512x512',
                        type: 'image/svg+xml',
                        purpose: 'any maskable'
                    }
                ]
            },
            devOptions: {
                enabled: true
            }
        })
    ],
    envPrefix: ['VITE_', 'NEXT_PUBLIC_'],
    build: {
        target: 'esnext',
        rollupOptions: {
            output: {
                // Let Vite and Rollup handle chunking automatically to prevent module evaluation order issues
            }
        }
    }
})
