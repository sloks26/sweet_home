module.exports = {
  root: true,
  env: {
    es2022: true
  },
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module'
  },
  settings: {
    react: {
      version: 'detect'
    }
  },
  overrides: [
    {
      files: ['backend/**/*.js'],
      env: {
        node: true,
        es2022: true
      },
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module'
      },
      plugins: ['security', 'n', 'import'],
      extends: [
        'eslint:recommended',
        'plugin:security/recommended-legacy',
        'plugin:n/recommended',
        'plugin:import/recommended'
      ],
      rules: {
        'no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
        'no-console': 'off',
        'n/no-unpublished-import': 'off',
        'n/no-missing-import': 'off',
        'import/no-unresolved': 'off',
        'security/detect-object-injection': 'off' // will note in report
      }
    },
    {
      files: ['frontend/**/*.{js,jsx}'],
      env: {
        browser: true,
        es2022: true
      },
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true
        }
      },
      plugins: ['react', 'react-hooks', 'import'],
      extends: [
        'eslint:recommended',
        'plugin:react/recommended',
        'plugin:react-hooks/recommended',
        'plugin:import/recommended'
      ],
      rules: {
        'react/react-in-jsx-scope': 'off',
        'react/prop-types': 'off',
        'no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
        'no-console': 'off',
        'import/no-unresolved': 'off'
      }
    }
  ]
};
