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
                manualChunks(id) {
                    if (id.includes('node_modules')) {
                        if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
                            return 'vendor-react';
                        }
                        if (id.includes('@react-three') || id.includes('three')) {
                            return 'vendor-three';
                        }
                        if (id.includes('@mediapipe')) {
                            return 'vendor-mediapipe';
                        }
                        if (id.includes('recharts') || id.includes('d3')) {
                            return 'vendor-charts';
                        }
                        if (id.includes('@clerk')) {
                            return 'vendor-clerk';
                        }
                        if (id.includes('framer-motion') || id.includes('motion')) {
                            return 'vendor-motion';
                        }
                        if (id.includes('@tanstack')) {
                            return 'vendor-tanstack';
                        }
                        return 'vendor-core';
                    }
                }
            }
        }
    }
})
