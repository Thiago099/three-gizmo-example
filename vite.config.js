import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from "vite"

import { MagicDomVitePlugin, MagicDomLiteVitePlugin }  from "magic-dom/vite-plugin"

export default defineConfig({
    plugins:[
        MagicDomVitePlugin(),
    ],
    base: '/three-gizmo-example/', 
    // make the @ as a alias to the src folder (opitional but recomended)
    resolve: {
        alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        }
    }
})