"""Зависимые циклы: Σi² = n(n+1)(2n+1)/6 и цикл с удвоением n(⌊log₂n⌋ + 1)."""
import math
import sys

from common import plot, print_table


def squares_loop(n):
    """for i ← 1..n: for j ← 1..i·i: x ← x + 1."""
    x = 0
    for i in range(1, n + 1):
        for _ in range(1, i * i + 1):
            x = x + 1
    return x


def nlogn_loop(n):
    """for i ← 1..n: j ← 1; while j ≤ n: x ← x + 1; j ← 2j."""
    x = 0
    for _ in range(1, n + 1):
        j = 1
        while j <= n:
            x = x + 1
            j = 2 * j
    return x


def main():
    ns_a = list(range(1, 13)) + [20, 50]
    rows_a = [(n, squares_loop(n), n * (n + 1) * (2 * n + 1) // 6) for n in ns_a]
    ok = print_table("(а) Внутренний цикл до i²: Σi² = n(n+1)(2n+1)/6", rows_a)

    ns_b = [1, 2, 3, 4, 5, 8, 10, 16, 100, 1000, 1024]
    rows_b = [(n, nlogn_loop(n), n * (math.floor(math.log2(n)) + 1)) for n in ns_b]
    ok &= print_table("(б) Внешний цикл до n, внутренний с удвоением: n(⌊log₂n⌋ + 1)", rows_b)

    xs = list(range(1, 201))
    plot(xs, [nlogn_loop(n) for n in xs], xs, [n * (math.log2(n) + 1) for n in xs],
         "Цикл с удвоением внутри цикла до n", "n", "выполнения тела",
         "emp-nlogn")
    if not ok:
        sys.exit(1)


if __name__ == "__main__":
    main()
