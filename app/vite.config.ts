import legacy from "@vitejs/plugin-legacy";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import { resolve } from "path";
import { defineConfig, loadEnv, splitVendorChunkPlugin } from "vite";
import electron from "vite-electron-plugin";
export default defineConfig(({ mode }) => ({
    css: {
        postcss: {
            plugins: [require("tailwindcss"), require("autoprefixer")],
        },
    },
    define: {
        "process.env": loadEnv(mode, process.cwd(), ""),
    },
    build: {
        outDir: "dist-app",
        assetsDir: "static",
        sourcemap: true,
        rollupOptions: {
            input: {
                index: resolve(__dirname, "./public/index.html"),
                ball: resolve(__dirname, "./public/ball.html"),
            },
            output: {
                entryFileNames: "js/[name].[hash].entry.js",
                chunkFileNames: "js/[name].[hash].chunkFile.js",
                assetFileNames(asset) {
                    const filename = asset.name as string;
                    switch (true) {
                        case /\.(css|sass|scaa|less)$/.test(filename):
                            return "css/[name].[hash].[ext]";
                        case /\.(png|jpe?g|gif|svg|webp)$/.test(filename):
                            return "image/[name].[hash].[ext]";
                        case /\.(woff2|eot|ttf|otf)$/.test(filename):
                            return "font/[name].[hash].[ext]";
                        case /\.(mp4|webm|ogg|mp3|wav|flac|acc)$/.test(filename):
                            return "media/[name].[hash].[ext]";
                        default:
                            return filename;
                    }
                },
                manualChunks(id) {
                    switch (true) {
                        case id.includes("vue"):
                            return `vendor/vue`;
                        case id.includes("ramda"):
                            return `vendor/ramda`;
                        case id.includes("element-plus"):
                            return `element-plus`;
                        case id.includes("node_modules"):
                            return "vendor/[name].[hash].chunkFile.js";
                    }
                },
            },
        },
    },
    resolve: {
        alias: {
            "@src": resolve(__dirname, "./src"),
            "@views": resolve(__dirname, "./src/views"),
            "@root": resolve(__dirname),
        },
        extensions: [".js", ".jsx", ".vue", ".ts", ".tsx", ".css", ".sass"],
    },
    server: {
        host: "127.0.0.1",
        port: 8086,
    },
    preview: {
        host: "0.0.0.0",
        port: 8080,
    },
    plugins: [
        vue({
            template: {
                transformAssetUrls: {
                    video: ["src", "poster"],
                    source: ["src"],
                    img: ["src"],
                    image: ["xlink:href", "href"],
                    use: ["xlink:href", "href"],
                },
            },
        }),
        vueJsx(),
        legacy({
            targets: ["defaults", "not IE 11"],
        }),
        electron({
            include: [
                // The Electron source codes directory
                "electron",
            ],
        }),
        splitVendorChunkPlugin(),
    ],
}));
