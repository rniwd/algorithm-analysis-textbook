"""UniqueElements: худший случай C(n) = n(n−1)/2, лучший случай — 1 сравнение."""
import sys

from common import plot, print_table


def unique_elements(a):
    """Возвращает (результат, число сравнений A[i] = A[j])."""
    count = 0
    n = len(a)
    for i in range(n - 1):
        for j in range(i + 1, n):
            count += 1  # базовая операция
            if a[i] == a[j]:
                return False, count
    return True, count


def main():
    ns = [2, 3, 5, 10, 20, 50, 100, 200, 400]
    worst1, worst2, best = [], [], []
    for n in ns:
        # тип 1: все элементы различны
        r, c = unique_elements(list(range(n)))
        assert r is True
        worst1.append((n, c, n * (n - 1) // 2))
        # тип 2: единственная равная пара — два последних элемента
        a = list(range(n - 1)) + [n - 2]
        r, c = unique_elements(a)
        assert r is False
        worst2.append((n, c, n * (n - 1) // 2))
        # лучший случай: A[0] = A[1]
        a = [7, 7] + list(range(100, 100 + n - 2))
        r, c = unique_elements(a)
        assert r is False
        best.append((n, c, 1))
    ok = print_table("Худший случай, тип 1 (все различны): C(n) = n(n−1)/2", worst1)
    ok &= print_table("Худший случай, тип 2 (равны только два последних): C(n) = n(n−1)/2", worst2)
    ok &= print_table("Лучший случай (A[0] = A[1]): C(n) = 1", best)

    fx = list(range(2, 401, 2))
    plot(ns, [r[1] for r in worst1], fx, [n * (n - 1) / 2 for n in fx],
         "UniqueElements: сравнения в худшем и лучшем случаях", "n", "сравнения C(n)",
         "emp-unique-elements",
         extra_series=[(ns, [r[1] for r in best], "лучший случай",
                        {"linestyle": "none", "marker": "s", "markersize": 4})])
    if not ok:
        sys.exit(1)


if __name__ == "__main__":
    main()
