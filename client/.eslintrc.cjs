module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'airbnb',
    'airbnb-typescript',
    'plugin:import/typescript',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
  },
  plugins: [
    'react',
    '@typescript-eslint',
    'react-hooks',
    'import',
    'jsx-a11y',
    'prettier',
  ],
  rules: {
    'prettier/prettier': 'error',
    'react/jsx-filename-extension': [1, { extensions: ['.tsx'] }],
    'react/react-in-jsx-scope': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    'import/prefer-default-export': 'off',
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'never',
        jsx: 'never',
        ts: 'never', // Keep for .ts if you explicitly want to disallow .ts extensions
        tsx: 'never', // Keep for .tsx if you explicitly want to disallow .tsx extensions
      },
    ],
    'react/prop-types': 'off', // Not needed in TypeScript
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    "no-param-reassign": ["error", { "props": true, "ignorePropertyModificationsFor": ["state", "acc", "e"] }],
    "react/require-default-props": "off",
    "jsx-a11y/anchor-is-valid": "off", // Often disabled for Next.js/Remix Link components
  },
  settings: {
    react: {
      version: 'detect',
    },
    // The 'import/resolver' and 'import/extensions' settings will be
    // inherited from 'airbnb-typescript' and 'plugin:import/typescript'
    // which use the 'parserOptions.project' setting (./tsconfig.json).
  },
  ignorePatterns: [
    '.eslintrc.cjs',
    'node_modules/',
    'dist/',
    'build/',
    'vite.config.ts',
    'tailwind.config.js', // Assuming these are in client/
    'postcss.config.js',  // Assuming these are in client/
    'vercel-build.js',    // Assuming this is in client/
    // Add any other generated files or specific configs if needed
  ],
};