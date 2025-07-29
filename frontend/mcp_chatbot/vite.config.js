import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  proxy: {
    "/api": {
      target: "http://localhost:8000",
    },
  },
  plugins: [react()],
});
