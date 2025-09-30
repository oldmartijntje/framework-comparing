import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';

export default defineConfig({
    plugins: [preact()],
    server: {
        port: 3005,
        open: true,
    },
    build: {
        outDir: 'dist'
    }
});
