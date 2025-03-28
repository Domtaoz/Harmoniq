import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import os from 'os';

function devServerLogger(): Plugin {
  return {
    name: 'dev-server-logger',
    configureServer(server) {
      server.httpServer?.once('listening', () => {
        const address = server.httpServer?.address();
        if (typeof address === 'object' && address?.port) {
          const port = address.port;
          const interfaces = os.networkInterfaces();
          const ips: string[] = [];

          for (const name in interfaces) {
            for (const iface of interfaces[name] ?? []) {
              if (iface.family === 'IPv4' && !iface.internal) {
                ips.push(iface.address);
              }
            }
          }

          console.log('\n🎧 Concert Booking App Dev Server');
          console.log(`→ Local:   http://harmoniq.com:${port}`);
          ips.forEach(ip => console.log(`→ Network: http://${ip}:${port}`));
          console.log('');
        }
      });
    }
  };
}

export default defineConfig({
  clearScreen: false,
  server: {
    host: '0.0.0.0',
    port: 8080,
  },
  plugins: [
    react(),
    devServerLogger(), // ✅ เพิ่ม plugin นี้
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
