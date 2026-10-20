"""Ханойская башня: M(n) = 2ⁿ − 1 перемещений, C(n) = 2ⁿ − 1 вызовов, глубина n."""
import sys

from common import plot, print_table


class State:
    def __init__(self, n):
        # стержни как списки; вершина — последний элемент
        self.pegs = {"A": list(range(n, 0, -1)), "B": [], "C": []}
        self.moves = 0
        self.calls = 0
        self.depth = 0
        self.max_depth = 0

    def move(self, src, dst):
        disk = self.pegs[src].pop()
        target = self.pegs[dst]
        assert not target or target[-1] > disk, "большой диск на меньшем!"
        target.append(disk)
        self.moves += 1  # базовая операция: перемещение диска


def hanoi(n, src, dst, aux, st):
    st.calls += 1
    st.depth += 1
    st.max_depth = max(st.max_depth, st.depth)
    if n == 1:
        st.move(src, dst)
    else:
        hanoi(n - 1, src, aux, dst, st)
        st.move(src, dst)
        hanoi(n - 1, aux, dst, src, st)
    st.depth -= 1


def main():
    ns = list(range(1, 21))
    rm, rc, rd = [], [], []
    moves = []
    for n in ns:
        st = State(n)
        hanoi(n, "A", "C", "B", st)
        assert st.pegs["C"] == list(range(n, 0, -1)) and not st.pegs["A"] and not st.pegs["B"]
        rm.append((n, st.moves, 2 ** n - 1))
        rc.append((n, st.calls, 2 ** n - 1))
        rd.append((n, st.max_depth, n))
        moves.append(st.moves)
    ok = print_table("Hanoi: перемещения, M(n) = 2ⁿ − 1", rm)
    ok &= print_table("Hanoi: вызовы, C(n) = 2ⁿ − 1", rc)
    ok &= print_table("Hanoi: максимальная глубина рекурсии = n", rd)
    print("Для всех n конечное состояние верно, правило «меньший на большем» не нарушено.")

    print("\nОтношение M(n)/M(n−1) (→ 2):")
    for n in range(2, 21):
        print(f"  n = {n:2d}: {moves[n - 1] / moves[n - 2]:.6f}")

    plot(ns, moves, ns, [2 ** n - 1 for n in ns],
         "Ханойская башня: число перемещений", "n", "перемещения M(n)", "emp-hanoi",
         logy=True)
    if not ok:
        sys.exit(1)


if __name__ == "__main__":
    main()
