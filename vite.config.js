import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import glsl from 'vite-plugin-glsl'




export default defineConfig({
	server:{
		host: '0.0.0.0',
		port: 7777,
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
