module.exports = {
  env: {
    browser: true,
    es6: true
  },
  parser: '@typescript-eslint/parser',
  extends: [
    'plugin:@typescript-eslint/recommended',
    'eslint-config-prettier'
  ],
  plugins: [
    'eslint-plugin-prettier'
  ],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  rules: {
    'prettier/prettier': 'error',
    '@typescript-eslint/no-empty-interface': 'off',
    '@typescript-eslint/member-delimiter-style': [
      2,
      {
        'multiline': {
          'delimiter': 'none',
          'requireLast': false
        },
      }
    ],
    semi: [
      2, 'never'
    ]
  },
}