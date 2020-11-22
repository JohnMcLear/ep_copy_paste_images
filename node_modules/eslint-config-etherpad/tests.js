'use strict';

module.exports = {
  env: {
    mocha: true,
  },
  extends: [
    'etherpad',
    'plugin:mocha/recommended',
  ],
  plugins: [
    'mocha',
  ],
  rules: {
    'mocha/no-hooks-for-single-case': 'off',
    'mocha/no-return-from-async': 'error',
    // Disabled due to false positives:
    //   - https://github.com/lo1tuma/eslint-plugin-mocha/issues/274
    //   - Using a loop to define tests can trigger it unless the logic is trivial.
    'mocha/no-setup-in-describe': 'off',
    'mocha/no-synchronous-tests': 'error',
    'mocha/prefer-arrow-callback': 'error',
    'prefer-arrow-callback': 'off',
    'prefer-arrow/prefer-arrow-functions': 'off',
  },
};
