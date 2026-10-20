"""Задача М2-Э1: Split(n), A(n) = 2A(⌊n/2⌋) + 1, A(1) = 0 ⇒ A(n) = 2^⌊log₂n⌋ − 1."""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from common import plot, print_table  # noqa: E402


def split(n, cnt):
    if n == 1:
        return 1
    r = split(n // 2, cnt) + split(n // 2, cnt)
    cnt[0] += 1  # базовая операция: сложение
    return r


def additions(n):
    cnt = [0]
    split(n, cnt)
    return cnt[0]


def main():
    N = 2000
    selected = [1, 2, 3, 4, 7, 8, 9, 15, 16, 17, 100, 1000, 1024, 2000]
    rows = []
    all_ok = pow_ok = True
    values = {}
    for n in range(1, N + 1):
        a = additions(n)
        values[n] = a
        f = 2 ** (n.bit_length() - 1) - 1
        if a != f:
            all_ok = False
        if n & (n - 1) == 0 and a != n - 1:
            pow_ok = False
        if n in selected:
            rows.append((n, a, f))
    ok = print_table("Split(n): сложения, A(n) = 2^⌊log₂n⌋ − 1", rows)
    print(f"Проверены все n = 1..{N}:", "все совпали" if all_ok else "ЕСТЬ РАСХОЖДЕНИЯ")
    print("Для n = 2^k: A(n) = n − 1 —", "верно" if pow_ok else "НЕВЕРНО")

    ratios = [values[n] / n for n in range(100, N + 1)]
    print(f"\nОтношение A(n)/n при n = 100..{N}: min = {min(ratios):.4f}, "
          f"max = {max(ratios):.4f}")
    print("Отношение ограничено ≈ [0.5, 1) ⇒ A(n) ∈ Θ(n) (правило гладкости).")

    xs = list(range(1, 301))
    plot(xs, [values[n] for n in xs], xs, [2 ** (n.bit_length() - 1) - 1 for n in xs],
         "Задача: Split(n), число сложений", "n", "сложения A(n)", "task-m2-e1", step=True,
         extra_series=[(xs, [n - 1 for n in xs], "n − 1", {"linestyle": ":"})])
    if not (ok and all_ok and pow_ok):
        sys.exit(1)


if __name__ == "__main__":
    main()
