import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import jsxa11y from 'eslint-plugin-jsx-a11y';
import noRelativeImportPaths from 'eslint-plugin-no-relative-import-paths';
import { FlatCompat } from '@eslint/eslintrc';
const compat = new FlatCompat();

export default tseslint.config(
  { ignores: ['dist'] },
  {
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      ...compat.extends('eslint-config-standard'),
    ],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      'jsx-a11y': jsxa11y,
      'no-relative-import-paths': noRelativeImportPaths,
    },
    rules: {
      // ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      'no-relative-import-paths/no-relative-import-paths': [
        'error',
        { allowSameFolder: true, rootDir: 'src', prefix: '@' },
      ],
      semi: 'off',
      'comma-dangle': 'off', // 끝에 콤마
      'space-before-function-paren': 'off', // 함수명 앞에 '()'소괄호가 붙어있으면 안됨 -> 해제
      'jsx-a11y/alt-text': [
        'warn',
        {
          elements: ['img'],
        },
      ],
      // 유효한 aria-* 속성만 사용
      'jsx-a11y/aria-props': 'warn',
      // 유효한 aria-* 상태/값만 사용
      'jsx-a11y/aria-proptypes': 'warn',
      // DOM에서 지원되는 role, ARIA만 사용
      'jsx-a11y/aria-unsupported-elements': 'warn',
      // 필수 ARIA 속성이 빠져있는지 체크
      'jsx-a11y/role-has-required-aria-props': 'warn',
      // ARIA 속성은 지원되는 role에서만 사용
      'jsx-a11y/role-supports-aria-props': 'warn',
      // DOM에 정의되지 않은 속성을 사용했는지 체크 (emotion css 속성 등 예외 케이스가 있으므로 기본은 off)
      'react/no-unknown-property': 'off',
      // 정의한 props 중에 빠진게 있는지 체크 (NextPage 등 일부 추상화 컴포넌트에서 복잡해지므로 기본은 off)
      'react/prop-types': 'off',
      'multiline-ternary': 'off',
      indent: 'off',
      'no-console': 'off',
      'no-unused-vars': 'off',
      'react-hooks/ exhaustive-deps': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
    },
  },
);
