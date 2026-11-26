import js from '@eslint/js'
import globals from 'globals'
import react from 'eslint-plugin-react'

export default [
  {
    ignores: ['dist/**', 'node_modules/**'],
  },
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      react,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...react.configs.flat.recommended.rules,
      'react/react-in-jsx-scope': 'off',
      'no-unused-vars': 'off',
      'react/jsx-uses-vars': 'error',
      'react/prop-types': 'off',
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
]