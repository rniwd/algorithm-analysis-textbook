"""SequentialSearch: средний случай C_avg(n) = p(n+1)/2 + n(1−p)."""
import random
import sys

from common import plot, print_table

R = 20000  # число испытаний


def sequential_search(a, k):
    """Возвращает (индекс или −1, число сравнений A[i] ≠ K)."""
    n = len(a)
    comparisons = 0
    i = 0
    while i < n:
        comparisons += 1  # базовая операция: A[i] ≠ K (выполняется только при i < n)
        if a[i] == k:
            break
        i += 1
    return (i if i < n else -1), comparisons


def simulate(n, p, trials=R):
    """Среднее число сравнений при вероятности успеха p и равновероятной позиции ключа."""
    a = list(range(n))  # различные значения
    k = -1              # ключ, которого нет в массиве
    total = 0
    for _ in range(trials):
        if random.random() < p:
            pos = random.randrange(n)
            a[pos] = k
            idx, c = sequential_search(a, k)
            assert idx == pos
            a[pos] = pos  # восстановить
        else:
            idx, c = sequential_search(a, k)
            assert idx == -1
        total += c
    return total / trials


def formula(n, p):
    return p * (n + 1) / 2 + n * (1 - p)


def main():
    random.seed(12345)
    ps = [0, 0.25, 0.5, 0.75, 1]
    rows_p = []
    for p in ps:
        rows_p.append((f"100, p={p}", simulate(100, p), formula(100, p)))
    ok = print_table(f"n = 100, разные p ({R} испытаний; совпадает при отн. погрешности < 2%)",
                     rows_p, tol=0.02)

    rows_n = []
    for n in [10, 20, 50, 100, 200, 500]:
        rows_n.append((n, simulate(n, 0.5), formula(n, 0.5)))
    ok &= print_table("p = 0.5, разные n: формула 0.5·(n+1)/2 + 0.5·n = (3n+1)/4", rows_n, tol=0.02)

    print("\nЧастные случаи: p = 1 → (n+1)/2 (в среднем половина массива), "
          "p = 0 → n (просмотр всего массива).")

    fx = [i / 100 for i in range(101)]
    plot(ps, [r[1] for r in rows_p], fx, [formula(100, p) for p in fx],
         "Последовательный поиск, n = 100: среднее число сравнений",
         "вероятность успешного поиска p", "C_avg", "emp-seq-search")
    if not ok:
        sys.exit(1)


if __name__ == "__main__":
    main()
