module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  parserOptions: {
    parser: 'babel-eslint'
  },
  extends: [
    '@nuxtjs',
    'plugin:nuxt/recommended'
    // "plugin:vue/recommended",
    // "@vue/standard",
  ],
  rules: {
      'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
      'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
      "indent": [
          1,
          4
      ],
      "comma-dangle": [
          "error",
          "always-multiline"
      ],
      "space-before-function-paren": ["error", {
          "anonymous": "never",
          "named": "never",
          "asyncArrow": "always",
      }],
      "vue/max-attributes-per-line": [
          "error",
          {
              "singleline": 8,
              "multiline": {
                  "max": 1,
                  "allowFirstLine": false
              }
          }
      ]
  },
}
