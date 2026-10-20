"""Рекурсивная сумма: A(n) = n сложений, глубина n + 1; хвостовая рекурсия в Python."""
import random
import sys

from common import plot, print_table


def rec_sum(a, n, st, depth=1):
    """Sum(A[0..n−1]) — передаём длину префикса вместо среза."""
    st["depth"] = max(st["depth"], depth)
    if n == 0:
        return 0
    r = rec_sum(a, n - 1, st, depth + 1) + a[n - 1]
    st["adds"] += 1
    return r


def sum_acc(a, i, acc, st):
    """Хвостовая рекурсия: SumAcc(A, i, acc)."""
    if i == len(a):
        return acc
    st["adds"] += 1
    return sum_acc(a, i + 1, acc + a[i], st)


def main():
    random.seed(12345)
    ns = [0, 1, 2, 5, 10, 50, 100, 200, 500, 900]
    ra, rd, rt = [], [], []
    for n in ns:
        a = [random.randint(-100, 100) for _ in range(n)]
        st = {"adds": 0, "depth": 0}
        assert rec_sum(a, n, st) == sum(a)
        ra.append((n, st["adds"], n))
        rd.append((n, st["depth"], n + 1))
        st2 = {"adds": 0}
        assert sum_acc(a, 0, 0, st2) == sum(a)
        rt.append((n, st2["adds"], n))
    ok = print_table("Sum: сложения, A(n) = A(n−1) + 1 = n", ra)
    ok &= print_table("Sum: максимальная глубина рекурсии = n + 1", rd)
    ok &= print_table("SumAcc (хвостовая рекурсия): сложения = n", rt)

    print(f"\nПредел рекурсии Python: sys.getrecursionlimit() = {sys.getrecursionlimit()}")
    big = [1] * 5000
    try:
        sum_acc(big, 0, 0, {"adds": 0})
        print("SumAcc при n = 5000 завершился (неожиданно: хвостовой вызов оптимизирован?)")
        tco_failed = False
    except RecursionError:
        print("SumAcc при n = 5000: RecursionError — Python НЕ оптимизирует хвостовые вызовы.")
        tco_failed = True
    s = 0
    for x in range(10 ** 6):
        s = s + 1
    print(f"Итеративный цикл при n = 10⁶ отработал без проблем: сумма = {s}")
    ok &= tco_failed and s == 10 ** 6

    xs = [r[0] for r in ra]
    plot(xs, [r[1] for r in ra], xs, xs,
         "Рекурсивная сумма: число сложений", "n", "сложения A(n)", "emp-rec-sum",
         extra_series=[(xs, [r[1] for r in rd], "глубина рекурсии",
                        {"linestyle": "none", "marker": "s", "markersize": 4})])
    if not ok:
        sys.exit(1)


if __name__ == "__main__":
    main()
