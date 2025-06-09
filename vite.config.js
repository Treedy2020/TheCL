import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    port: 3000,
    open: true, // 自动打开浏览器
    hmr: {
      port: 24678 // HMR 端口
    }
  },
  root: '.', // 项目根目录
  build: {
    outDir: 'dist'
  }
})