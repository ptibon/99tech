import { sum_to_n_a, sum_to_n_b, sum_to_n_c } from './index';

function test(name: string, fn: () => void) {
    try {
        fn();
        console.log(`✓ ${name}`);
    } catch (error) {
        console.error(`✗ ${name}`);
        console.error(error);
    }
}

function expect(actual: number, expected: number) {
    if (actual !== expected) {
        throw new Error(`Expected ${expected}, but got ${actual}`);
    }
}

test('sum_to_n_a(5) should return 15', () => {
    expect(sum_to_n_a(5), 15);
});

test('sum_to_n_a(1) should return 1', () => {
    expect(sum_to_n_a(1), 1);
});

test('sum_to_n_a(10) should return 55', () => {
    expect(sum_to_n_a(10), 55);
});

test('sum_to_n_b(5) should return 15', () => {
    expect(sum_to_n_b(5), 15);
});

test('sum_to_n_b(1) should return 1', () => {
    expect(sum_to_n_b(1), 1);
});

test('sum_to_n_b(10) should return 55', () => {
    expect(sum_to_n_b(10), 55);
});

test('sum_to_n_c(5) should return 15', () => {
    expect(sum_to_n_c(5), 15);
});

test('sum_to_n_c(1) should return 1', () => {
    expect(sum_to_n_c(1), 1);
});

test('sum_to_n_c(10) should return 55', () => {
    expect(sum_to_n_c(10), 55);
});

test('All functions should return the same result for n=100', () => {
    const result_a = sum_to_n_a(100);
    const result_b = sum_to_n_b(100);
    const result_c = sum_to_n_c(100);
    expect(result_a, 5050);
    expect(result_b, 5050);
    expect(result_c, 5050);
});

test('All functions should return 0 for n=0', () => {
    expect(sum_to_n_a(0), 0);
    expect(sum_to_n_b(0), 0);
    expect(sum_to_n_c(0), 0);
});

test('All functions should handle negative numbers', () => {
    expect(sum_to_n_a(-5), 0);
    expect(sum_to_n_b(-5), 0);
    expect(sum_to_n_c(-5), 0);
});

test('All functions should return same result for large numbers', () => {
    const n = 1000;
    const result_a = sum_to_n_a(n);
    const result_b = sum_to_n_b(n);
    const result_c = sum_to_n_c(n);
    expect(result_a, result_b);
    expect(result_b, result_c);
});

