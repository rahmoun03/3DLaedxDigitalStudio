import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import glsl from 'vite-plugin-glsl'
import fs from 'fs'



export default defineConfig({
	server:{
		host: '0.0.0.0',
		port: 7777,
		https: {
			key: fs.readFileSync(path.resolve(__dirname, 'cert/key.pem')),
			cert: fs.readFileSync(path.resolve(__dirname, 'cert/cert.pem')),
		},
	},
	plugins: [
		react(),
		tailwindcss(),
        glsl() 
	],
	assetsInclude: ['**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.svg'],
	resolve: {
		alias: {
		'@': path.resolve(__dirname, 'src'),
		},
	},
})
