const ts = require('typescript-eslint');
const js = require('@eslint/js');
const prettier = require('eslint-config-prettier');

module.exports = ts.config(
  js.configs.recommended,
  ...ts.configs.recommended,
  prettier,
  {
    ignores: ['lib/**'],
  },
  {
    files: ['**/*.js'],
    rules: {
      '@typescript-eslint/no-var-requires': 'off',
      'no-undef': 'off',
    },
  },
  {
    languageOptions: {
      globals: {
        __dirname: true,
        console: true,
        exports: true,
        module: true,
        require: true,
      },
    },
  },
);
