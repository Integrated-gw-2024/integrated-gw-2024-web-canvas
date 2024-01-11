module.exports = {
    "env": {
        "browser": true,
        "es2022": true,
        "node": true
    },
    "extends": [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "prettier",
    ],
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        "ecmaVersion": "latest",
        "sourceType": "module"
    },
    "plugins": [
        "@typescript-eslint"
    ],
    "rules": {
        "no-console": process.env.NODE_ENV === 'production' ? 2 : 0,
        //"no-unused-vars": ['error', { argsIgnorePattern: '^_' } ],
        "no-unused-vars": "off",
        "@typescript-eslint/no-unused-vars": ["error"],
        "keyword-spacing": ["error"],
        "semi": [2, "always"],
        '@typescript-eslint/explicit-module-boundary-types': 0,
        '@typescript-eslint/explicit-function-return-type': 1,
    }
};
