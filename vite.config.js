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
        seller: resolve(__dirname, "pages/seller/index.html"),
        sellerUpload: resolve(__dirname, "pages/seller/upload/index.html"),
        cart: resolve(__dirname, "pages/cart/index.html"),
      },
    },
  },

  server: {
    port: 5173,
    open: true,
  },

  plugins: [
    {
      name: "custom-routing",
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (
            !req.url.includes(".") &&
            !req.url.startsWith("/@") &&
            !req.url.startsWith("/node_modules")
          ) {
            const pathname = req.url.split("?")[0];
            const normalizedPath = pathname.endsWith("/")
              ? pathname.slice(0, -1)
              : pathname;

            // /product/숫자 → 상품 상세 페이지로
            if (/^\/product\/\d+$/.test(normalizedPath)) {
              req.url = "/pages/product-detail/";
              return next();
            }

            const validPaths = [
              "",
              "/pages/login",
              "/pages/signup",
              "/pages/product-detail",
              "/pages/product-list",
              "/pages/cart",
              "/pages/not-found",
              "/pages/seller/upload",
              "/pages/seller",
            ];

            if (!validPaths.includes(normalizedPath)) {
              req.url = "/pages/not-found/";
            }
          }
          next();
        });
      },
    },
  ],
});
