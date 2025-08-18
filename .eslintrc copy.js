module.exports = {
  extends: ['next/core-web-vitals', 'plugin:@typescript-eslint/recommended', 'plugin:import/recommended', 'prettier'],
  rules: {
    'no-undef': 'error',
    'jsx-a11y/alt-text': 'off',
    'react/display-name': 'off',
    'react/no-children-prop': 'off',
    '@next/next/no-img-element': 'off',
    '@next/next/no-page-custom-font': 'off',
    '@typescript-eslint/consistent-type-imports': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    'lines-around-comment': [
      'off',
      {
        beforeBlockComment: true,
        beforeLineComment: true,
        allowBlockStart: true,
        allowObjectStart: true,
        allowArrayStart: true
      }
    ],
    'padding-line-between-statements': [
      'off',
      {
        blankLine: 'any',
        prev: 'export',
        next: 'export'
      },
      {
        blankLine: 'always',
        prev: ['const', 'let', 'var'],
        next: '*'
      },
      {
        blankLine: 'any',
        prev: ['const', 'let', 'var'],
        next: ['const', 'let', 'var']
      },
      {
        blankLine: 'always',
        prev: '*',
        next: ['function', 'multiline-const', 'multiline-block-like']
      },
      {
        blankLine: 'always',
        prev: ['function', 'multiline-const', 'multiline-block-like'],
        next: '*'
      }
    ],
    'newline-before-return': 'off',
    'import/newline-after-import': [
      'off',
      {
        count: 1
      }
    ],
    'import/order': [
      'off',
      {
        groups: ['builtin', 'external', ['internal', 'parent', 'sibling', 'index'], ['object', 'unknown']],
        pathGroups: [
          {
            pattern: 'react',
            group: 'external',
            position: 'before'
          },
          {
            pattern: 'next/**',
            group: 'external',
            position: 'before'
          },
          {
            pattern: '~/**',
            group: 'external',
            position: 'before'
          },
          {
            pattern: '@/**',
            group: 'internal'
          }
        ],
        pathGroupsExcludedImportTypes: ['react', 'type'],
        'newlines-between': 'always-and-inside-groups'
      }
    ],
    '@typescript-eslint/ban-types': [
      'error',
      {
        extendDefaults: true,
        types: {
          Function: 'Use a specific function type instead',
          Object: 'Use object instead',
          Boolean: 'Use boolean instead',
          Number: 'Use number instead',
          String: 'Use string instead',
          Symbol: 'Use symbol instead',
          any: false,
          '{}': false
        }
      }
    ]
  },
  settings: {
    react: {
      version: 'detect'
    },
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx']
    },
    'import/resolver': {
      node: {},
      typescript: {
        project: './tsconfig.json'
      }
    }
  },

  overrides: [
    {
      files: ['*.ts', '*.tsx', '*.js', '*.jsx'],
      rules: {
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/no-var-requires': 'off'
      }
    }
  ]
}

// module.exports = {
//   root: true,
//   extends: [
//     'next/core-web-vitals',
//     'plugin:react/recommended',
//     'plugin:react-hooks/recommended',
//     'plugin:@typescript-eslint/recommended',
//     'plugin:import/recommended',
//     'prettier'
//   ],
//   plugins: ['react', 'react-hooks', '@typescript-eslint'],
//   rules: {
//     'no-undef': 'error',
//     'jsx-a11y/alt-text': 'off',
//     'react/display-name': 'off',
//     'react/no-children-prop': 'off',
//     '@next/next/no-img-element': 'off',
//     '@next/next/no-page-custom-font': 'off',
//     '@typescript-eslint/consistent-type-imports': 'off',
//     '@typescript-eslint/ban-ts-comment': 'off',
//     '@typescript-eslint/no-explicit-any': 'off',
//     '@typescript-eslint/no-unused-vars': 'off',
//     '@typescript-eslint/no-non-null-assertion': 'off',

//     'newline-before-return': 'error',
//     'lines-around-comment': 'off',
//     'padding-line-between-statements': 'off',
//     'import/newline-after-import': 'off',
//     'import/order': 'off',

//     '@typescript-eslint/ban-types': [
//       'error',
//       {
//         extendDefaults: true,
//         types: {
//           Function: 'Use a specific function type instead',
//           Object: 'Use object instead',
//           Boolean: 'Use boolean instead',
//           Number: 'Use number instead',
//           String: 'Use string instead',
//           Symbol: 'Use symbol instead',
//           any: false,
//           '{}': false
//         }
//       }
//     ]
//   },
//   settings: {
//     react: {
//       version: 'detect'
//     },
//     'import/parsers': {
//       '@typescript-eslint/parser': ['.ts', '.tsx']
//     },
//     'import/resolver': {
//       node: {
//         extensions: ['.js', '.jsx', '.ts', '.tsx']
//       },
//       typescript: {
//         project: './tsconfig.json'
//       }
//     }
//   },
//   overrides: [
//     {
//       files: ['*.ts', '*.tsx', '*.js', '*.jsx'],
//       rules: {
//         '@typescript-eslint/explicit-module-boundary-types': 'off',
//         '@typescript-eslint/no-var-requires': 'off'
//       }
//     }
//   ]
// }
