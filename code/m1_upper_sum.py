"""SumAboveDiagonal: число сложений A(n) = n(n−1)/2."""
import random
import sys

from common import plot, print_table


def sum_above_diagonal(a):
    """Возвращает (сумма над главной диагональю, число сложений)."""
    n = len(a)
    adds = 0
    s = 0
    for i in range(n - 1):
        for j in range(i + 1, n):
            s = s + a[i][j]
            adds += 1  # базовая операция
    return s, adds


def main():
    random.seed(12345)
    ns = [1, 2, 5, 10, 20, 50, 100, 200]
    rows = []
    for n in ns:
        a = [[random.randint(-50, 50) for _ in range(n)] for _ in range(n)]
        s, c = sum_above_diagonal(a)
        direct = sum(a[i][j] for i in range(n) for j in range(n) if j > i)
        assert s == direct, "сумма вычислена неверно"
        rows.append((n, c, n * (n - 1) // 2))
    ok = print_table("SumAboveDiagonal: сложения, A(n) = n(n−1)/2", rows)
    print("Значение суммы проверено прямым вычислением.")

    fx = list(range(1, 201))
    plot(ns, [r[1] for r in rows], fx, [n * (n - 1) / 2 for n in fx],
         "Сумма над диагональю: число сложений", "n", "сложения A(n)", "emp-upper-sum")
    if not ok:
        sys.exit(1)


if __name__ == "__main__":
    main()
