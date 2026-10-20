"""Binary(n): число сравнений n > 1 равно ⌊log₂n⌋ + 1."""
import math
import sys

from common import plot, print_table


def binary(n):
    """Возвращает (count, число сравнений n > 1)."""
    comparisons = 0
    count = 1
    while True:
        comparisons += 1  # базовая операция: проверка n > 1
        if not n > 1:
            break
        count += 1
        n //= 2
    return count, comparisons


def doubling_loop(n):
    """i ← 1; while i ≤ n: тело; i ← 2i. Возвращает число выполнений тела."""
    body = 0
    i = 1
    while i <= n:
        body += 1
        i *= 2
    return body


def main():
    N = 5000
    selected = [1, 2, 3, 4, 7, 8, 15, 16, 100, 1000, 1023, 1024, 4096, 5000]
    rows = []
    all_ok = True
    for n in range(1, N + 1):
        cnt, c = binary(n)
        f = n.bit_length()
        assert f == math.floor(math.log2(n)) + 1
        assert cnt == f  # count — это число двоичных цифр n
        if c != f:
            all_ok = False
        if n in selected:
            rows.append((n, c, f))
    ok = print_table("Binary(n): сравнения n > 1, формула ⌊log₂n⌋ + 1", rows)
    print(f"Проверены все n = 1..{N}:", "все совпали" if all_ok else "ЕСТЬ РАСХОЖДЕНИЯ")
    print("Проверено также: n.bit_length() = ⌊log₂n⌋ + 1 для всех n.")

    loop_ok = all(doubling_loop(n) == n.bit_length() for n in range(1, N + 1))
    print(f"Цикл с удвоением i ← 2i: тело выполняется ⌊log₂n⌋ + 1 раз — "
          f"{'верно' if loop_ok else 'НЕВЕРНО'} для всех n = 1..{N}.")

    xs = list(range(1, 301))
    plot(xs, [binary(n)[1] for n in xs], xs, [math.log2(n) + 1 for n in xs],
         "Binary(n): число сравнений", "n", "сравнения C(n)", "emp-binary", step=True)
    if not (ok and all_ok and loop_ok):
        sys.exit(1)


if __name__ == "__main__":
    main()
