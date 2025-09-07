
// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/Netflix_Clone/", // <-- change this to "/your-repo-name/" if different
  plugins: [react()],
});
