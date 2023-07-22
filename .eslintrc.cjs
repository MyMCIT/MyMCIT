module.exports = {
  env: { browser: true, es2020: true },
  extends: [
    'plugin:prettier/recommended',
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  plugins: ['react-refresh', '@typescript-eslint'],
  rules: {
    'react-refresh/only-export-components': 'warn',
    "max-len": ["error", { "code": 120, "ignoreUrls": true, "ignoreStrings": true, "ignoreComments": true }],
    "@typescript-eslint/no-explicit-any" : "off",
    "@typescript-eslint/no-non-null-assertion" : "off",
    "@typescript-eslint/ban-ts-comment": "off",
  },
}