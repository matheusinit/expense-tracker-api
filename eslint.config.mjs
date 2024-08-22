import globals from 'globals'
import parserTs from '@typescript-eslint/parser'
import stylisticTs from '@stylistic/eslint-plugin-ts'
import pluginJs from '@eslint/js'
import tseslint from 'typescript-eslint'

export default [
  { 'files': ['**/*.{ts}'] },
  { 'languageOptions': { 'globals': globals.node, 'parser': parserTs } },
  {
    'plugins': {
      '@stylistic/ts': stylisticTs
    },
    'rules': {
      '@stylistic/ts/indent': ['error', 2],
      '@stylistic/ts/quotes': ['error', 'single'],
      '@stylistic/ts/semi': ['error', 'never'],
    }
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended
]
