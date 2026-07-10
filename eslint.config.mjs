import js from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import prettier from 'eslint-plugin-prettier';
// Custom plugins
import fcPattern from './eslint-plugins/fc-pattern.js';
import typesLocation from './eslint-plugins/types-location.js';
import stylingRules from './eslint-plugins/styling-rules.js';
import folderStructure from './eslint-plugins/folder-structure.js';
import functionTypes from './eslint-plugins/function-types.js';
import errorHandling from './eslint-plugins/error-handling.js';
import performanceRules from './eslint-plugins/performance-rules.js';

export default [
  js.configs.recommended,
  {
    ignores: [
      'node_modules/**',
      '.expo/**',
      'expo-env.d.ts',
      'android/**',
      'ios/**',
      'dist/**',
      'coverage/**',
      'eslint-plugins/**',
      '*.config.js',
      '*.config.mjs',
      'babel.config.js',
      'metro.config.js',
      'jest.setup.js',
    ],
  },
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        __DEV__: 'readonly',
        console: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
        fetch: 'readonly',
        URL: 'readonly',
        URLSearchParams: 'readonly',
        window: 'readonly',
        document: 'readonly',
        navigator: 'readonly',
        localStorage: 'readonly',
        Blob: 'readonly',
        MediaStream: 'readonly',
        MediaRecorder: 'readonly',
        HTMLVideoElement: 'readonly',
        HTMLCanvasElement: 'readonly',
        Promise: 'readonly',
        process: 'readonly',
        global: 'readonly',
        require: 'readonly',
        module: 'readonly',
        exports: 'readonly',
        RequestInit: 'readonly',
        Response: 'readonly',
        jest: 'readonly',
        describe: 'readonly',
        it: 'readonly',
        expect: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
      react,
      'react-hooks': reactHooks,
      prettier,
      'fc-pattern': fcPattern,
      'types-location': typesLocation,
      'styling-rules': stylingRules,
      'folder-structure': folderStructure,
      'function-types': functionTypes,
      'error-handling': errorHandling,
      'performance-rules': performanceRules,
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      // Prettier integration
      'prettier/prettier': 'error',

      // TypeScript rules
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', fixStyle: 'separate-type-imports' },
      ],

      // React rules - enforce FC<Props> pattern
      'react/function-component-definition': [
        'error',
        {
          namedComponents: 'arrow-function',
          unnamedComponents: 'arrow-function',
        },
      ],
      'fc-pattern/require-fc-typing': 'error',
      'fc-pattern/no-inline-default-export': 'error',
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'react/jsx-uses-react': 'off',
      'react/jsx-no-target-blank': 'error',
      'react/self-closing-comp': 'error',
      'react/jsx-curly-brace-presence': ['error', { props: 'never', children: 'never' }],

      // React Hooks rules
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      // General rules
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-unused-vars': 'off', // Use TypeScript's version
      'prefer-const': 'error',
      'no-var': 'error',
      eqeqeq: ['error', 'always'],
      curly: ['error', 'all'],

      // Import organization
      'sort-imports': [
        'error',
        {
          ignoreCase: true,
          ignoreDeclarationSort: true,
          ignoreMemberSort: false,
        },
      ],

      // Custom rules - Types location
      'types-location/types-in-types-folder': 'error',

      // Custom rules - Styling
      'styling-rules/no-hardcoded-colors': 'error',
      'styling-rules/prefer-stylesheet': 'error',

      // Custom rules - Folder structure
      'folder-structure/component-folder-structure': 'error',
      'folder-structure/no-barrel-exports': 'error',

      // Custom rules - Function types
      'function-types/require-function-return-type': 'error',

      // Custom rules - Error handling
      'error-handling/require-promise-catch': 'error',
      'error-handling/require-async-error-handling': 'warn',

      // Custom rules - Performance
      'performance-rules/require-memo-for-components': 'warn',
    },
  },
];
