module.exports = {
    parserOptions: {
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
        "eslint:recommended",
        "plugin:prettier/recommended",
    ],
    rules: {
        "no-var": "error",
        "no-empty": "warn",
        "no-undef-var": "error"
    },
};
