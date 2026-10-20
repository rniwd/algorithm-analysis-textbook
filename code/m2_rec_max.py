"""MaxDC («разделяй и властвуй»): C(n) = n − 1 сравнений, глубина ⌈log₂n⌉ + 1."""
import math
import random
import sys

from common import plot, print_table


def max_dc(a, l, r, st, depth=1):
    st["depth"] = max(st["depth"], depth)
    if l == r:
        return a[l]
    m = (l + r) // 2
    x = max_dc(a, l, m, st, depth + 1)
    y = max_dc(a, m + 1, r, st, depth + 1)
    st["cmp"] += 1  # базовая операция: a > b
    return x if x > y else y


def main():
    random.seed(12345)
    ns = [1, 2, 3, 5, 8, 13, 16, 100, 1000, 1024]
    rc, rd = [], []
    for n in ns:
        a = [random.randint(-10**6, 10**6) for _ in range(n)]
        st = {"cmp": 0, "depth": 0}
        assert max_dc(a, 0, n - 1, st) == max(a)
        rc.append((n, st["cmp"], n - 1))
        rd.append((n, st["depth"], math.ceil(math.log2(n)) + 1))
    ok = print_table("MaxDC: сравнения, C(n) = C(⌈n/2⌉) + C(⌊n/2⌋) + 1 = n − 1", rc)
    ok &= print_table("MaxDC: максимальная глубина рекурсии = ⌈log₂n⌉ + 1", rd)

    xs = list(range(1, 101))
    counts = []
    for n in xs:
        st = {"cmp": 0, "depth": 0}
        max_dc(list(range(n)), 0, n - 1, st)
        counts.append(st["cmp"])
    plot(xs, counts, xs, [n - 1 for n in xs],
         "Рекурсивный поиск максимума: число сравнений", "n", "сравнения C(n)", "emp-rec-max")
    if not ok:
        sys.exit(1)


if __name__ == "__main__":
    main()
