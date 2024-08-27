import globals from 'globals'
import parserTs from '@typescript-eslint/parser'
import stylistic from '@stylistic/eslint-plugin'
import stylisticTs from '@stylistic/eslint-plugin-ts'
import pluginJs from '@eslint/js'
import tseslint from 'typescript-eslint'

export default [
  { files: ['**/*.{ts, mjs}'] },
  { languageOptions: { globals: globals.node, parser: parserTs } },
  {
    plugins: {
      '@stylistic/ts': stylisticTs,
      '@stylistic': stylistic
    },
    rules: {
      '@stylistic/ts/indent': ['error', 2],
      '@stylistic/ts/quotes': ['error', 'single'],
      '@stylistic/ts/semi': ['error', 'never'],
      '@stylistic/no-mixed-spaces-and-tabs': ['error', 'smart-tabs'],
      '@stylistic/no-multi-spaces': 'error',
      '@stylistic/no-trailing-spaces': 'error',
      '@stylistic/object-curly-spacing': ['error', 'always'],
      '@stylistic/rest-spread-spacing': ['error', 'never'],
      '@stylistic/function-paren-newline': ['error', 'consistent'],
      '@stylistic/no-multiple-empty-lines': ['error', { 'max': 1, 'maxEOF': 0, 'maxBOF': 0 }],
      '@typescript-eslint/no-unused-vars': ['error', {
        'argsIgnorePattern': '^_',
        'caughtErrorsIgnorePattern': '^_',
        'destructuredArrayIgnorePattern': '^_',
        'varsIgnorePattern': '^_',
      }],
    },
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
]
