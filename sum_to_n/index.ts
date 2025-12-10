/**
 * This function is a simple implementation of the sum of the first n natural numbers.
 * It is a loop that iterates from 1 to n and adds the current number to the sum.
 * @param n - The number of natural numbers to sum.
 * @returns The sum of the first n natural numbers.
 */
export function sum_to_n_a(n: number): number {
    if (n <= 0) return 0;
    let sum = 0;
    for (let i = 1; i <= n; i++) {
        sum += i;
    }
    return sum;
}

/**
 * This function is a mathematical formula to calculate the sum of the first n natural numbers.
 * It is a formula that calculates the sum of the first n natural numbers.
 * @param n - The number of natural numbers to sum.
 * @returns The sum of the first n natural numbers.
 */
export function sum_to_n_b(n: number): number {
    if (n <= 0) return 0;
    return (n * (n + 1)) / 2;
}

/**
 * This function is a recursive implementation of the sum of the first n natural numbers.
 * It is a recursive function that calculates the sum of the first n natural numbers.
 * @param n - The number of natural numbers to sum.
 * @returns The sum of the first n natural numbers.
 */
export function sum_to_n_c(n: number): number {
    if (n <= 0) return 0;
    if (n === 1) return 1;
    return n + sum_to_n_c(n - 1);
}
