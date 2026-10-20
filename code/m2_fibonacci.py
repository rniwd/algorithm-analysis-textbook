"""Числа Фибоначчи: наивная рекурсия, функция с памятью, итеративный алгоритм."""
import sys

from common import plot, print_table

PHI = (1 + 5 ** 0.5) / 2


def fib_ref(n):
    a, b = 0, 1
    for _ in range(n):
        a, b = b, a + b
    return a


def fib_naive(n, cnt):
    cnt["calls"] += 1
    if n <= 1:
        return n
    r = fib_naive(n - 1, cnt) + fib_naive(n - 2, cnt)
    cnt["adds"] += 1
    return r


def memo_fib(n, table, cnt):
    cnt["calls"] += 1
    if table[n] < 0:  # −1 означает «ещё не вычислено»
        if n <= 1:
            table[n] = n
        else:
            table[n] = memo_fib(n - 1, table, cnt) + memo_fib(n - 2, table, cnt)
            cnt["adds"] += 1
    return table[n]


def fib_iter(n):
    adds = 0
    a, b = 0, 1
    if n == 0:
        return 0, 0
    for _ in range(2, n + 1):
        a, b = b, a + b
        adds += 1
    return b, adds


def main():
    ns = list(range(0, 26))
    ra, rcalls, rma, rmc, ri = [], [], [], [], []
    naive_adds, memo_adds = [], []
    for n in ns:
        cnt = {"adds": 0, "calls": 0}
        v = fib_naive(n, cnt)
        assert v == fib_ref(n)
        ra.append((n, cnt["adds"], fib_ref(n + 1) - 1))
        rcalls.append((n, cnt["calls"], 2 * fib_ref(n + 1) - 1))
        naive_adds.append(cnt["adds"])

        mc = {"adds": 0, "calls": 0}
        table = [-1] * (n + 1)
        assert memo_fib(n, table, mc) == fib_ref(n)
        rma.append((n, mc["adds"], max(n - 1, 0)))
        rmc.append((n, mc["calls"], 2 * n - 1 if n >= 1 else 1))
        memo_adds.append(mc["adds"])

        v, adds = fib_iter(n)
        assert v == fib_ref(n)
        ri.append((n, adds, max(n - 1, 0)))

    ok = print_table("Наивная рекурсия: сложения, A(n) = F(n+1) − 1", ra)
    ok &= print_table("Наивная рекурсия: вызовы, C(n) = 2F(n+1) − 1", rcalls)
    ok &= print_table("Функция с памятью: сложения, n − 1 (n ≥ 1; 0 при n = 0)", rma)
    ok &= print_table("Функция с памятью: вызовы, 2n − 1 (n ≥ 1; 1 при n = 0)", rmc)
    ok &= print_table("Итеративный алгоритм: сложения, n − 1 (n ≥ 1)", ri)

    print(f"\nОтношение A(n)/A(n−1) для наивной рекурсии (→ φ ≈ {PHI:.6f}):")
    for n in range(3, 26):
        print(f"  n = {n:2d}: {naive_adds[n] / naive_adds[n - 1]:.6f}")

    xs = list(range(2, 26))
    plot(xs, naive_adds[2:], xs, [fib_ref(n + 1) - 1 for n in xs],
         "Числа Фибоначчи: число сложений", "n", "сложения A(n)", "emp-fib", logy=True,
         extra_series=[(xs, memo_adds[2:], "с памятью: n − 1",
                        {"linestyle": "none", "marker": "s", "markersize": 4})])
    if not ok:
        sys.exit(1)


if __name__ == "__main__":
    main()
