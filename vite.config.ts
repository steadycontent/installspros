import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (!id.includes("node_modules")) return;
          if (id.includes("react-dom") || id.includes("/react/") || id.includes("scheduler")) return "react-vendor";
          if (id.includes("react-router")) return "router-vendor";
          if (id.includes("@supabase") || id.includes("@tanstack/react-query")) return "data-vendor";
          if (id.includes("@radix-ui")) return "radix-vendor";
          if (id.includes("lucide-react")) return "icons-vendor";
          if (id.includes("recharts") || id.includes("d3-")) return "charts-vendor";
          if (id.includes("date-fns") || id.includes("react-day-picker")) return "date-vendor";
          if (id.includes("framer-motion")) return "motion-vendor";
          if (id.includes("embla-carousel")) return "carousel-vendor";
          if (id.includes("cmdk") || id.includes("vaul") || id.includes("sonner") || id.includes("input-otp") || id.includes("react-resizable-panels")) return "ui-extras-vendor";
          if (id.includes("zod") || id.includes("react-hook-form") || id.includes("@hookform")) return "form-vendor";
          return "vendor";
        },
      },
    },
  },
}));
