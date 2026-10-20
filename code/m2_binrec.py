"""BinRec(n): число сложений A(n) = ⌊log₂n⌋."""
import math
import sys

from common import plot, print_table


def binrec(n, cnt):
    if n == 1:
        return 1
    r = binrec(n // 2, cnt) + 1
    cnt[0] += 1  # базовая операция: сложение
    return r


def main():
    N = 5000
    selected = [1, 2, 3, 4, 7, 8, 15, 16, 100, 1000, 1023, 1024, 4096, 5000]
    rows = []
    all_ok = True
    pow_ok = True
    for n in range(1, N + 1):
        cnt = [0]
        v = binrec(n, cnt)
        f = n.bit_length() - 1  # ⌊log₂n⌋
        assert v == n.bit_length()
        if cnt[0] != f:
            all_ok = False
        if n & (n - 1) == 0 and cnt[0] != int(math.log2(n)):
            pow_ok = False
        if n in selected:
            rows.append((n, cnt[0], f))
    ok = print_table("BinRec(n): сложения, A(n) = ⌊log₂n⌋", rows)
    print(f"Проверены все n = 1..{N}:", "все совпали" if all_ok else "ЕСТЬ РАСХОЖДЕНИЯ")
    print(f"Для n = 2^k: A(n) = k = log₂n —", "верно" if pow_ok else "НЕВЕРНО")

    xs = list(range(1, 301))
    counts = []
    for n in xs:
        cnt = [0]
        binrec(n, cnt)
        counts.append(cnt[0])
    plot(xs, counts, xs, [math.log2(n) for n in xs],
         "BinRec(n): число сложений", "n", "сложения A(n)", "emp-binrec", step=True)
    if not (ok and all_ok and pow_ok):
        sys.exit(1)


if __name__ == "__main__":
    main()
