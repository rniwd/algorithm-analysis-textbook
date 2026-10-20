"""MaxElement: число сравнений A[i] > maxval равно C(n) = n − 1."""
import random
import sys

from common import plot, print_table


def max_element(a):
    """Возвращает (максимум, число сравнений, число присваиваний maxval внутри цикла)."""
    comparisons = 0
    assignments = 0
    maxval = a[0]
    for i in range(1, len(a)):
        comparisons += 1  # базовая операция: A[i] > maxval
        if a[i] > maxval:
            maxval = a[i]
            assignments += 1
    return maxval, comparisons, assignments


def main():
    random.seed(12345)
    ns = [1, 2, 5, 10, 20, 50, 100, 200, 500, 1000]
    rows = []
    for n in ns:
        a = [random.randint(-10**6, 10**6) for _ in range(n)]
        m, c, _ = max_element(a)
        assert m == max(a)
        rows.append((n, c, n - 1))
    ok = print_table("MaxElement: сравнения A[i] > maxval, формула C(n) = n − 1", rows)

    # присваивания зависят от входа, сравнения — нет
    n = 1000
    print(f"\nВходы разного вида, n = {n}:")
    print(f"{'массив':>22} | сравнения | присваивания maxval")
    cases = [
        ("по возрастанию", list(range(n))),
        ("по убыванию", list(range(n, 0, -1))),
        ("случайный", random.sample(range(10 * n), n)),
    ]
    for name, a in cases:
        _, c, s = max_element(a)
        ok = ok and c == n - 1
        print(f"{name:>22} | {c:>9} | {s:>19}")
    print("Вывод: число сравнений всегда n − 1, а число присваиваний зависит от входа"
          " — поэтому базовой операцией выбрано сравнение.")

    plot(ns, [r[1] for r in rows], ns, [n - 1 for n in ns],
         "MaxElement: число сравнений", "n", "сравнения C(n)", "emp-max-element")
    if not ok:
        sys.exit(1)


if __name__ == "__main__":
    main()
