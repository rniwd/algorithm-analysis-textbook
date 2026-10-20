"""Рекурсивный факториал: M(n) = n умножений, n + 1 вызовов."""
import math
import sys

from common import plot, print_table


class Counter:
    def __init__(self):
        self.mults = 0
        self.calls = 0


def factorial(n, cnt):
    cnt.calls += 1
    if n == 0:
        return 1
    result = factorial(n - 1, cnt) * n
    cnt.mults += 1  # базовая операция: умножение
    return result


def main():
    ns = list(range(0, 21)) + [100, 500]
    rm, rc = [], []
    for n in ns:
        cnt = Counter()
        v = factorial(n, cnt)
        assert v == math.factorial(n), "значение не совпало с math.factorial"
        rm.append((n, cnt.mults, n))
        rc.append((n, cnt.calls, n + 1))
    ok = print_table("F(n): умножения, M(n) = n (M(n) = M(n−1) + 1, M(0) = 0)", rm)
    ok &= print_table("F(n): вызовы, C(n) = n + 1", rc)
    print("Значения F(n) совпали с math.factorial для всех n.")

    xs = list(range(0, 21))
    plot(xs, [r[1] for r in rm[:21]], xs, xs,
         "Рекурсивный факториал: число умножений", "n", "умножения M(n)", "emp-factorial")
    if not ok:
        sys.exit(1)


if __name__ == "__main__":
    main()
