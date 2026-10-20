"""Умножение матриц по определению: M(n) = n³ умножений, A(n) = n³ сложений."""
import random
import sys

from common import plot, print_table


def matrix_multiply(a, b):
    """Возвращает (C, число умножений, число сложений)."""
    n = len(a)
    mults = adds = 0
    c = [[0] * n for _ in range(n)]
    for i in range(n):
        for j in range(n):
            c[i][j] = 0
            for k in range(n):
                c[i][j] = c[i][j] + a[i][k] * b[k][j]
                mults += 1
                adds += 1
    return c, mults, adds


def main():
    random.seed(12345)
    ns = [1, 2, 4, 8, 16, 32, 48]
    rm, ra = [], []
    for n in ns:
        a = [[random.randint(-9, 9) for _ in range(n)] for _ in range(n)]
        b = [[random.randint(-9, 9) for _ in range(n)] for _ in range(n)]
        c, m, s = matrix_multiply(a, b)
        # проверка результата независимым способом
        ref = [[sum(x * y for x, y in zip(row, col)) for col in zip(*b)] for row in a]
        assert c == ref
        rm.append((n, m, n ** 3))
        ra.append((n, s, n ** 3))
    ok = print_table("Умножения a[i,k]·b[k,j]: M(n) = n³", rm)
    ok &= print_table("Сложения C[i,j] + …: A(n) = n³", ra)

    fx = list(range(1, 49))
    plot(ns, [r[1] for r in rm], fx, [n ** 3 for n in fx],
         "Умножение матриц: число умножений", "n", "умножения M(n)", "emp-matrix")
    if not ok:
        sys.exit(1)


if __name__ == "__main__":
    main()
