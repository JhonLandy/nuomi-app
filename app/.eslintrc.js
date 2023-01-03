module.exports = {
    parser: "vue-eslint-parser",
    parserOptions: {
        parser: "@typescript-eslint/parser",
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: {
            ts: true,
            jsx: true,
            experimentalObjectRestSpread: true,
        },
    },
    env: {
        es6: true,
        node: true,
        browser: true,
        commonjs: true,
    },
    extends: [
        "plugin:vue/vue3-recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:prettier/recommended",
    ],
    rules: {
        "no-var": "error",
        "no-empty": "warn",
        "vue/multi-word-component-names": "off",
        "vue/html-self-closing": [
            "warn",
            {
                html: {
                    void: "never",
                    normal: "always",
                    component: "always",
                },
            },
        ],
    },
};
