import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  root: ".",
  appType: "mpa",

  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        login: resolve(__dirname, "pages/login/index.html"),
        signup: resolve(__dirname, "pages/signup/index.html"),
        productDetail: resolve(__dirname, "pages/product-detail/index.html"),
        notFound: resolve(__dirname, "pages/not-found/index.html"),
      },
    },
  },

  server: {
    port: 5173,
    open: true,
  },

  plugins: [
    {
      name: "custom-404",
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (
            !req.url.includes(".") &&
            !req.url.startsWith("/@") &&
            !req.url.startsWith("/node_modules")
          ) {
            // 쿼리스트링 제거하고 경로만 추출
            const pathname = req.url.split("?")[0];

            const validPaths = [
              "/",
              "/pages/login",
              "/pages/login/",
              "/pages/signup",
              "/pages/signup/",
              "/pages/product-detail",
              "/pages/product-detail/",
              "/pages/product-list",
              "/pages/product-list/",
              "/pages/cart",
              "/pages/cart/",
              "/pages/not-found",
              "/pages/not-found/",
            ];

            // pathname으로 체크 (쿼리스트링 제외)
            const isValid = validPaths.includes(pathname);

            if (!isValid) {
              req.url = "/pages/not-found/";
            }
          }
          next();
        });
      },
    },
  ],
});
