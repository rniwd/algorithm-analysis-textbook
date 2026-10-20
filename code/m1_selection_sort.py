"""SelectionSort: сравнения C(n) = n(n−1)/2, обмены S(n) = n − 1."""
import random
import sys

from common import plot, print_table


def selection_sort(a):
    """Сортирует a на месте. Возвращает (число сравнений, число обменов)."""
    n = len(a)
    comparisons = swaps = 0
    for i in range(n - 1):
        mn = i
        for j in range(i + 1, n):
            comparisons += 1  # базовая операция: A[j] < A[min]
            if a[j] < a[mn]:
                mn = j
        a[i], a[mn] = a[mn], a[i]  # обмен выполняется всегда
        swaps += 1
    return comparisons, swaps


def main():
    random.seed(12345)
    ns = [2, 5, 10, 20, 50, 100, 200, 400]
    rc, rs = [], []
    for n in ns:
        a = [random.randint(0, 1000) for _ in range(n)]
        ref = sorted(a)
        c, s = selection_sort(a)
        assert a == ref, "массив не отсортирован"
        rc.append((n, c, n * (n - 1) // 2))
        rs.append((n, s, n - 1))
    ok = print_table("SelectionSort: сравнения A[j] < A[min], C(n) = n(n−1)/2", rc)
    ok &= print_table("SelectionSort: обмены, S(n) = n − 1", rs)
    print("Результат каждой сортировки проверен: массив упорядочен.")

    fx = list(range(2, 401, 2))
    plot(ns, [r[1] for r in rc], fx, [n * (n - 1) / 2 for n in fx],
         "Сортировка выбором: число сравнений", "n", "сравнения C(n)", "emp-selection-sort",
         extra_series=[(ns, [r[1] for r in rs], "обмены",
                        {"linestyle": "none", "marker": "s", "markersize": 4})])
    if not ok:
        sys.exit(1)


if __name__ == "__main__":
    main()
