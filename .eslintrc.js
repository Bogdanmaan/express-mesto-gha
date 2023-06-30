module.exports = {
  extends: 'airbnb',
  parserOptions: {
    ecmaVersion: 'latest',
  },
  rules: {
    'no-underscore-dangle': ['error', { allow: ['_id'] }],
    'import/no-extraneous-dependencies': ['error', { devDependencies: false, optionalDependencies: false, peerDependencies: false }],
  },
};
