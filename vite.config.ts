import { defineConfig } from "vite";
import { resolve } from "path";

// Dev server: rewrite /login.html etc. to /src/pages/ so same URLs work in dev and prod
function rewritePagesPlugin() {
  return {
    name: "rewrite-pages",
    configureServer(server) {
      server.middlewares.use((req, _res, next) => {
        if (req.url === "/login.html") req.url = "/src/pages/login.html";
        else if (req.url === "/register.html") req.url = "/src/pages/register.html";
        else if (req.url === "/space.html") req.url = "/src/pages/space.html";
        next();
      });
    },
  };
}

export default defineConfig({
  root: ".",
  publicDir: "public",
  plugins: [rewritePagesPlugin()],
  build: {
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        login: resolve(__dirname, "src/pages/login.html"),
        register: resolve(__dirname, "src/pages/register.html"),
        space: resolve(__dirname, "src/pages/space.html"),
      },
      output: {
        entryFileNames: "[name].js",
        chunkFileNames: "chunk-[name].js",
        assetFileNames: "assets/[name][extname]",
      },
    },
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "src/ts"),
    },
  },
});
