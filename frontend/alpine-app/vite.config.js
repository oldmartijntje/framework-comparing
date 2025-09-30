import { defineConfig } from 'vite';

export default defineConfig({
    root: '.',
    server: {
        port: 3002,
        open: true,
    },
    build: {
        outDir: 'dist'
    }
});
