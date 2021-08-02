module.exports = {
  env: {
    commonjs: true,
    es2021: true,
    node: true,
  },
  extends: ['airbnb-base', 'prettier:recommended'],
  parserOptions: {
    ecmaVersion: 12,
  },
  rules: {
    indent: 2,
    'no-console': 'off',
    'linebreak-style': ['error', 'windows'],
    quotes: ['error', 'single'],
    semi: ['error', 'always'],
  },
};
