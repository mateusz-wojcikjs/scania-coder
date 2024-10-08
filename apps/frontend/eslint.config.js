import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  { ignores: ['dist'] },
  {
    extends: [js.configs.recommended,...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
        "indent": ["error", 2],
        "object-curly-spacing": ["error", "always"],
        "quotes": ["error", "double"],
        "semi": ["error", "always"],
        "@typescript-eslint/no-magic-numbers": ["error"],
        "@typescript-eslint/no-duplicate-enum-values": ["error"],
        "@typescript-eslint/no-empty-object-type": ["error"],
        "@typescript-eslint/no-unused-vars": ["error"],
        "@typescript-eslint/no-wrapper-object-types": "error",
        "@typescript-eslint/no-explicit-any": "error"
    },
  },
)
