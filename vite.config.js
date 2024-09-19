import dotenv from 'dotenv'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
//import basicSsl from '@vitejs/plugin-basic-ssl'


dotenv.config()

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(), 
    //basicSsl()
  ],
  server: {https: false},
  define: {
    'process.env' : process.env
  }
})
