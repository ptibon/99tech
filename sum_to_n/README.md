# sum_to_n

Three implementations of summing numbers from 1 to n with tests.

## Functions
- `sum_to_n_a(n)`: iterative loop, O(n) time, O(1) space
- `sum_to_n_b(n)`: arithmetic series formula, O(1) time, O(1) space
- `sum_to_n_c(n)`: recursive, O(n) time, O(n) space (call stack)

For n <= 0, all functions return 0.

## Prerequisites
- Node.js v22+
- npm
- nvm use

## Install
```bash
cd sum_to_n
npm install
```

## Test
```bash
npm test
```

## Files
- `index.ts`: function implementations
- `index.test.ts`: test coverage for positive, zero, negative, and large n
- `tsconfig.json`: TypeScript config
- `package.json`: scripts and deps
