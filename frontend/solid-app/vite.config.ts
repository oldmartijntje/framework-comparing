import { defineConfig } from 'vite';
import solid from 'vite-plugin-solid';

export default defineConfig({
    plugins: [solid()],
    server: {
        port: 3007
    },
    preview: {
        port: 3007
    }
});
