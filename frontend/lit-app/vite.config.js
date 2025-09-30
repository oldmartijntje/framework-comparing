import { defineConfig } from 'vite';

export default defineConfig({
    server: {
        port: 3006,
        open: true,
        historyApiFallback: true, // Enable SPA routing
    },
    build: {
        outDir: 'dist',
        rollupOptions: {
            input: 'index.html'
        }
    }
});
