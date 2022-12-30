module.exports = {
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
        commonjs: true,
    },
    extends: [
        "plugin:eslint/recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:prettier/recommended",
    ],
    rules: {
        "no-var": "error",
        "no-empty": "warn",
        "no-undef-var": "error"
    },
};
