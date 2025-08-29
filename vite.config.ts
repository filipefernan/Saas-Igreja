import path from "path";
import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, ".", "");
    return {
      define: {
        "process.env.API_KEY": JSON.stringify(env.GEMINI_API_KEY),
        "process.env.GEMINI_API_KEY": JSON.stringify(env.GEMINI_API_KEY),
        "process.env.VITE_SUPABASE_URL": JSON.stringify(env.VITE_SUPABASE_URL),
        "process.env.VITE_SUPABASE_ANON_KEY": JSON.stringify(env.VITE_SUPABASE_ANON_KEY)
      },
      resolve: {
        alias: {
          "@": path.resolve(__dirname, "."),
        }
      },
      preview: {
        host: true,
        port: process.env.PORT ? parseInt(process.env.PORT) : 4173,
        allowedHosts: [
          "localhost",
          "127.0.0.1",
          "saas-igreja-production.up.railway.app",
          ".up.railway.app" // Permite qualquer subdomínio do Railway
        ]
      },
      server: {
        host: true,
        port: 5173
      }
    };
});
