import { defineConfig } from 'vite';

export default defineConfig({
    root: '.',
    server: {
        port: 3004,
        open: true,
    },
    build: {
        outDir: 'dist'
    }
});
