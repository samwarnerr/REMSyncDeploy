import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  build: {
    outDir: 'dist'
  },
  server: {
    historyApiFallback: true
  }

  //server: {
    //proxy: {
      //'/api': {
        //target: 'http://localhost:3001',
        //changeOrigin: true,
        //secure: false,
      //},
   //},
  //},
});
