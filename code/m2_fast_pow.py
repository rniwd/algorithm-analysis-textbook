"""Быстрое возведение в степень: M(n) = ⌊log₂n⌋ + ν(n) − 1 умножений."""
import math
import sys

from common import plot, print_table


def power(a, n, cnt):
    if n == 1:
        return a
    h = power(a, n // 2, cnt)
    if n % 2 == 0:
        cnt[0] += 1  # h·h
        return h * h
    cnt[0] += 2  # h·h·a
    return h * h * a


def nu(n):
    """Число единиц в двоичной записи n."""
    return bin(n).count("1")


def mults(n, a=3):
    cnt = [0]
    v = power(a, n, cnt)
    assert v == a ** n, "значение не совпало с a**n"
    return cnt[0]


def main():
    N = 2000
    selected = [1, 2, 3, 4, 7, 8, 15, 16, 31, 32, 100, 255, 256, 1000, 1023, 1024]
    rows = []
    all_ok = True
    special_ok = True
    for n in range(1, N + 1):
        m = mults(n)
        f = (n.bit_length() - 1) + nu(n) - 1
        if m != f:
            all_ok = False
        k = n.bit_length()
        if n & (n - 1) == 0 and m != k - 1:          # n = 2^(k−1)
            special_ok = False
        if (n + 1) & n == 0 and n > 1 and m != 2 * (k - 1):  # n = 2^k − 1
            special_ok = False
        if n in selected:
            rows.append((n, m, f))
    ok = print_table("Power(3, n): умножения, M(n) = ⌊log₂n⌋ + ν(n) − 1", rows)
    print(f"Проверены все n = 1..{N} (значение = 3**n):",
          "все совпали" if all_ok else "ЕСТЬ РАСХОЖДЕНИЯ")
    print("Лучший случай n = 2^k: M = k; худший n = 2^k − 1: M = 2(k − 1) —",
          "верно" if special_ok else "НЕВЕРНО")

    xs = list(range(1, 301))
    plot(xs, [mults(n) for n in xs], None, None,
         "Быстрое возведение в степень: число умножений", "n", "умножения M(n)",
         "emp-fast-pow",
         extra_series=[
             (xs, [math.log2(n) for n in xs], "log₂n (лучший случай)",
              {"linestyle": "--", "color": "#9a9a9a"}),
             (xs, [2 * math.log2(n) for n in xs], "2·log₂n (худший случай)",
              {"linestyle": "--", "color": "#d0743c"}),
         ])
    if not (ok and all_ok and special_ok):
        sys.exit(1)


if __name__ == "__main__":
    main()
