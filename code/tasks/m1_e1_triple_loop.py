"""Задача М1-Э1: тройной цикл, C(n) = n(n+1)(n+2)/6."""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from common import plot, print_table  # noqa: E402


def triple_loop(n):
    count = 0
    for i in range(1, n + 1):
        for j in range(i, n + 1):
            for _ in range(i, j + 1):
                count = count + 1
    return count


def main():
    ns = [1, 2, 3, 4, 5, 10, 20, 40, 80, 160]
    counts = {n: triple_loop(n) for n in ns}
    rows = [(n, counts[n], n * (n + 1) * (n + 2) // 6) for n in ns]
    ok = print_table("Тройной цикл: C(n) = n(n+1)(n+2)/6", rows)

    print("\nОтношение C(2n)/C(n) (→ 8, т.к. C(n) ∈ Θ(n³)):")
    for n in [5, 10, 20, 40, 80]:
        print(f"  C({2 * n})/C({n}) = {counts[2 * n] / counts[n]:.4f}")

    fx = list(range(1, 161))
    plot(ns, [counts[n] for n in ns], fx, [n * (n + 1) * (n + 2) / 6 for n in fx],
         "Задача: тройной цикл", "n", "count", "task-m1-e1")
    if not ok:
        sys.exit(1)


if __name__ == "__main__":
    main()
