import { resolve } from "path";
import { defineConfig, loadEnv, splitVendorChunkPlugin } from "vite";
export default defineConfig(({ mode }) => ({
    define: {
        "process.env": loadEnv(mode, process.cwd(), ""),
    },
    build: {
        assetsDir: "",
        sourcemap: false,
        watch: {
        },
        rollupOptions: {
            input: resolve(__dirname, "./bin/index.ts"),
            output: {
                format: "cjs",
                banner: "#!/usr/bin/env node",
                entryFileNames: '[name].js',
                chunkFileNames: "[name].[hash].js",
                manualChunks(id) {
                    switch (true) {
                        case id.includes("commander"):
                            return `vendor/commander`;
                        default:
                            return `vendor/lib`;
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
    // server: {
    //     host: "127.0.0.1",
    //     port: 8086,
    // },
    // preview: {
    //     host: "0.0.0.0",
    //     port: 8080,
    // },
    plugins: [
        // legacy({
        //     targets: ["defaults", "not IE 11"],
        // }),
        splitVendorChunkPlugin(),
    ],
}));
