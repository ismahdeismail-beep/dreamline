import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {fileURLToPath} from 'url';
import {defineConfig} from 'vite';

// `__dirname` is not available in an ES module config. Vite 8 warns that its use
// is unsupported under the native config loader and will break when that becomes
// the default, so derive the directory from import.meta.url instead.
const projectRoot = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(projectRoot, '.'),
      },
    },
    server: {
      // HMR can be disabled via DISABLE_HMR env var (set in AI Studio).
      // File watching is disabled at the same time to prevent flickering.
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
