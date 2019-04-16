// https://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'script',
  },
  env: {
    node: true,
    es6: true,
  },
  globals: {
    logger: 'readonly',
  },
  extends: 'airbnb-base',
  rules: {
    // 'no-param-reassign': 1,
    'prefer-destructuring': ['error', {
      'AssignmentExpression': {
        array: false,
        object: true,
      },
    }],
    'no-use-before-define': ['error', { functions: false, classes: true, variables: true }],
    'no-underscore-dangle': ['error', { 'allow': ['_page', '_limit', '_sort', '_order', '_start', '_end', '_embed', '_expand'] }],
  },
};
