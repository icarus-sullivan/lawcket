module.exports = {
  extends: 'airbnb-base',
  plugins: [
    'jest',
  ],
  env: {
    jest: true,
  },
  rules: {
    'arrow-parens': ['error', 'always'],
    'no-console': 0,
    'max-len': 0,
    'no-continue': 0,
    'no-restricted-syntax': 0,
    'no-prototype-builtins': 0,

    'jest/no-disabled-tests': 'error',
    'jest/no-focused-tests': 'error',
    'jest/no-identical-title': 'warn',
    'jest/prefer-to-have-length': 'warn',
    'jest/valid-expect': 'warn',
  },
};