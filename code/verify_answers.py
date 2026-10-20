"""Автоматическая проверка всех числовых ответов задач и квизов сайта.

Скрипт читает строки `checks: [...]` из файлов data/*.js (это строгий JSON),
для каждой проверки запускает реализацию алгоритма со счётчиком базовой
операции (или прямое вычисление суммы/рекуррентности) и сравнивает результат
с формулой ответа. Дополнительно проверяет структуру банка заданий
(один верный вариант, объяснение у каждого варианта, три блока у задачи)
и числа, упомянутые в тексте разборов (CLAIMS).

Запуск:  python3 verify_answers.py      (из папки code/ или из корня проекта)
Код возврата 0 — все проверки пройдены, 1 — есть ошибки.
"""

import itertools
import json
import math
import random
import re
import sys
from fractions import Fraction
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DATA = ROOT / "data"
sys.setrecursionlimit(10000)
random.seed(2024)


# ---------- вспомогательные функции для формул ----------

def floor_log2(n):
    return n.bit_length() - 1


def nu(n):
    return bin(n).count("1")


def fib(n):
    a, b = 0, 1
    for _ in range(n):
        a, b = b, a + b
    return a


FORMULA_NS = {
    "floor_log2": floor_log2, "nu": nu, "fib": fib, "isqrt": math.isqrt,
    "Fraction": Fraction, "len": len, "str": str, "max": max, "range": range,
    "floor": math.floor, "ceil": math.ceil,
}


def ev(expr, **vars_):
    return eval(expr, {"__builtins__": {}}, {**FORMULA_NS, **vars_})


# ---------- реализации алгоритмов со счётчиками ----------

def count_negatives(n):
    a = [random.randint(-9, 9) for _ in range(n)]
    cnt = c = 0
    for i in range(n):
        cnt += 1                       # сравнение A[i] < 0
        if a[i] < 0:
            c += 1
    return cnt


def matrix_mult(n):
    A = [[random.random() for _ in range(n)] for _ in range(n)]
    B = [[random.random() for _ in range(n)] for _ in range(n)]
    mults = 0
    C = [[0.0] * n for _ in range(n)]
    for i in range(n):
        for j in range(n):
            for k in range(n):
                mults += 1
                C[i][j] += A[i][k] * B[k][j]
    return mults


def unique_elements(a):
    cnt, n = 0, len(a)
    for i in range(n - 1):
        for j in range(i + 1, n):
            cnt += 1
            if a[i] == a[j]:
                return cnt
    return cnt


def unique_best(n):
    return unique_elements([7, 7] + list(range(100, 100 + n - 2)))


def binary_comparisons(n):
    cnt = 0
    while True:
        cnt += 1                       # сравнение n > 1
        if not n > 1:
            return cnt
        n //= 2


def hanoi_run(n):
    pegs = [list(range(n, 0, -1)), [], []]
    stats = {"moves": 0, "depth": 0, "max_depth": 0}

    def hanoi(m, src, dst, aux):
        stats["depth"] += 1
        stats["max_depth"] = max(stats["max_depth"], stats["depth"])
        if m == 1:
            move(src, dst)
        else:
            hanoi(m - 1, src, aux, dst)
            move(src, dst)
            hanoi(m - 1, aux, dst, src)
        stats["depth"] -= 1

    def move(s, d):
        disk = pegs[s].pop()
        assert not pegs[d] or pegs[d][-1] > disk, "нарушено правило"
        pegs[d].append(disk)
        stats["moves"] += 1

    hanoi(n, 0, 2, 1)
    assert pegs[2] == list(range(n, 0, -1))
    return stats


def hanoi_moves(n):
    return hanoi_run(n)["moves"]


def hanoi_depth(n):
    return hanoi_run(n)["max_depth"]


def binrec_additions(n):
    if n == 1:
        return 0
    return binrec_additions(n // 2) + 1


def memo_fib_additions(n):
    F = [-1] * (n + 1)
    adds = [0]

    def mf(k):
        if F[k] < 0:
            if k <= 1:
                F[k] = k
            else:
                F[k] = mf(k - 1) + mf(k - 2)
                adds[0] += 1
        return F[k]

    assert mf(n) == fib(n)
    return adds[0]


def count_zeros_matrix(n):
    cnt = 0
    A = [[random.randint(0, 2) for _ in range(n)] for _ in range(n)]
    for i in range(n):
        for j in range(n):
            cnt += 1
            _ = A[i][j] == 0
    return cnt


def inner_const5(n):
    cnt = 0
    for i in range(1, n + 1):
        for j in range(1, 6):
            cnt += 1
    return cnt


def b1_dependent(n):
    return sum(1 for i in range(n) for j in range(i, n))


def b2_triple(n):
    return sum(1 for i in range(n) for j in range(n) for k in range(j + 1))


def has_zero_row(A):
    n, cnt = len(A), 0
    for i in range(n):
        j = 0
        while j < n:
            cnt += 1                   # сравнение A[i, j] = 0
            if A[i][j] != 0:
                break
            j += 1
        if j == n:
            return cnt
    return cnt


def zero_row_extremes(n):
    """Перебор всех 0/1-матриц для малых n — настоящие максимум и минимум."""
    best, worst = None, None
    for bits in itertools.product([0, 1], repeat=n * n):
        A = [list(bits[r * n:(r + 1) * n]) for r in range(n)]
        c = has_zero_row(A)
        best = c if best is None else min(best, c)
        worst = c if worst is None else max(worst, c)
    return best, worst


def zero_row_worst(n):
    if n <= 3:
        return zero_row_extremes(n)[1]
    A = [[0] * (n - 1) + [1] for _ in range(n)]   # ненулевой только последний столбец
    return has_zero_row(A)


def zero_row_best(n):
    if n <= 3:
        return zero_row_extremes(n)[0]
    A = [[1] + [0] * (n - 1) for _ in range(n)]   # каждая строка начинается с ненуля
    return has_zero_row(A)


def b4_step2(n):
    cnt = 0
    for i in range(1, n + 1):
        j = 1
        while j <= i:
            cnt += 1
            j += 2
    return cnt


def seq_search_weighted(n):
    """Точное ожидание числа сравнений при p_i = 2(n+1-i)/(n(n+1)), ключ всегда есть."""
    total_p, expect = Fraction(0), Fraction(0)
    for pos in range(1, n + 1):
        a = list(range(n))
        key = a[pos - 1]
        i = cnt = 0
        while i < n:
            cnt += 1                   # сравнение A[i] ≠ K
            if a[i] == key:
                break
            i += 1
        p = Fraction(2 * (n + 1 - pos), n * (n + 1))
        total_p += p
        expect += p * cnt
    assert total_p == 1
    return expect


def c2_log_inner(n):
    cnt = 0
    for i in range(1, n + 1):
        j = i
        while j <= n:
            cnt += 1
            j *= 2
    return cnt


def pairs_diff_additions(n):
    return sum(1 for i in range(n - 1) for j in range(i + 1, n))


def isprime_divisions(n):
    assert all(n % d for d in range(2, math.isqrt(n) + 1)), "ожидается простое n"
    cnt = 0
    for d in range(2, math.isqrt(n) + 1):
        cnt += 1
        if n % d == 0:
            break
    return cnt


def e1_triple_dependent(n):
    return sum(1 for i in range(1, n + 1) for j in range(i, n + 1) for k in range(i, j + 1))


def rec_search(a, key, n, cnt=0):
    if n == 0:
        return cnt
    cnt += 1
    if a[n - 1] == key:
        return cnt
    return rec_search(a, key, n - 1, cnt)


def rec_search_worst(n):
    return rec_search(list(range(n)), -1, n)


def rec_search_best(n):
    a = list(range(n))
    return rec_search(a, a[-1], n)


def digits_additions(n):
    if n < 10:
        return 0
    return digits_additions(n // 10) + 1


def tri(n, st):
    st["calls"] += 1
    if n == 0:
        return 1
    v = tri(n - 1, st) + tri(n - 1, st) + tri(n - 1, st)
    st["adds"] += 2
    return v


def tri_additions(n):
    st = {"calls": 0, "adds": 0}
    assert tri(n, st) == 3 ** n
    return st["adds"]


def tri_calls(n):
    st = {"calls": 0, "adds": 0}
    tri(n, st)
    return st["calls"]


def maxdc(a, l, r, st):
    if l == r:
        return a[l]
    m = (l + r) // 2
    x = maxdc(a, l, m, st)
    y = maxdc(a, m + 1, r, st)
    st[0] += 1
    return x if x > y else y


def maxdc_comparisons(n):
    a = [random.random() for _ in range(n)]
    st = [0]
    assert maxdc(a, 0, n - 1, st) == max(a)
    return st[0]


def power(a, n, st):
    if n == 1:
        return a
    h = power(a, n // 2, st)
    if n % 2 == 0:
        st[0] += 1
        return h * h
    st[0] += 2
    return h * h * a


def fastpow_mults(n):
    st = [0]
    assert power(3, n, st) == 3 ** n
    return st[0]


def factorial_mults(n):
    st = [0]

    def F(k):
        if k == 0:
            return 1
        st[0] += 1
        return F(k - 1) * k

    assert F(n) == math.factorial(n)
    return st[0]


def split_additions(n):
    st = [0]

    def split(k):
        if k == 1:
            return 1
        v = split(k // 2) + split(k // 2)
        st[0] += 1
        return v

    split(n)
    return st[0]


ALGOS = {name: fn for name, fn in globals().items() if callable(fn) and not name.startswith("_")}

SUM_TERMS = {
    "sum_ones": lambda i: 1,
    "sum_i": lambda i: i,
    "sum_3i_minus_2": lambda i: 3 * i - 2,
    "sum_pow3": lambda i: 3 ** i,
}


def recurrence(name, n):
    if name == "c_prev_plus_n":
        x = 0
        for k in range(1, n + 1):
            x = x + k
        return x
    if name == "x_prev_plus4_x0_3":
        x = 3
        for _ in range(n):
            x += 4
        return x
    if name == "x_2prev_plus3_x0_1":
        x = 1
        for _ in range(n):
            x = 2 * x + 3
        return x
    if name == "x_prev_plus3n_x0_2":
        x = 2
        for k in range(1, n + 1):
            x += 3 * k
        return x
    if name == "x_half_plus_n2_x1_1":
        assert n & (n - 1) == 0
        return 1 if n == 1 else recurrence(name, n // 2) + n * n
    raise KeyError(name)


# ---------- числа из текста разборов ----------

CLAIMS = [
    ("Binary(100): 7 сравнений", binary_comparisons(100), 7),
    ("Binary(100): значения 100,50,25,12,6,3,1",
     [100 >> k for k in range(7)], [100, 50, 25, 12, 6, 3, 1]),
    ("цикл i←2i при n=1000: 10 итераций", floor_log2(1000) + 1, 10),
    ("SquareBound(2) = 5", sum(i * i for i in range(1, 3)), 5),
    ("UniqueElements худший тип 2 = n(n−1)/2 (n=10)",
     unique_elements(list(range(8)) + [99, 99]), 45),
    ("сумма над диагональю при n=3: 3 сложения", pairs_diff_additions(3), 3),
    ("Intervals: C(10)=220", e1_triple_dependent(10), 220),
    ("Intervals: C(160)=695520", 160 * 161 * 162 // 6, 695520),
    ("C1: (n+2)/3 при n=10 равно 4", seq_search_weighted(10), 4),
    ("C2: n=5 → 5+2+1 = 8", c2_log_inner(5), 8),
    ("Ф2: IsPrime(101) — 9 делений", isprime_divisions(101), 9),
    ("Power: a^1000 — 14 умножений", fastpow_mults(1000), 14),
    ("Power: n=1000 имеет 6 единиц", nu(1000), 6),
    ("BinRec(37): цепочка 37→18→9→4→2→1", binrec_additions(37), 5),
    ("Ханой n=64: 2^64−1 ≈ 1,8·10^19", round((2 ** 64 - 1) / 1e19, 1), 1.8),
    ("Ханой: глубина стека n=8", hanoi_depth(8), 8),
    ("Фибоначчи: вызовы с мемоизацией 2n−1 (n=7)", None, None),
    ("Робот: 2^17−1 ≤ 172800 < 2^18−1", (2 ** 17 - 1 <= 172800 < 2 ** 18 - 1), True),
    ("Фибоначчи: A(25)/A(24) ≈ 1,61804", round((fib(26) - 1) / (fib(25) - 1), 5), 1.61804),
    ("Факториал: глубина n+1 (n=5)", None, None),
]


def memo_calls(n):
    F, calls = [-1] * (n + 1), [0]

    def mf(k):
        calls[0] += 1
        if F[k] < 0:
            F[k] = k if k <= 1 else mf(k - 1) + mf(k - 2)
        return F[k]

    mf(n)
    return calls[0]


def fact_depth(n):
    d = [0, 0]

    def F(k):
        d[0] += 1
        d[1] = max(d[1], d[0])
        r = 1 if k == 0 else F(k - 1) * k
        d[0] -= 1
        return r

    F(n)
    return d[1]


CLAIMS[16] = ("Фибоначчи: вызовы с мемоизацией 2n−1 (n=7)", memo_calls(7), 13)
CLAIMS[19] = ("Факториал: глубина n+1 (n=5)", fact_depth(5), 6)


# ---------- разбор data/*.js ----------

CHECK_RE = re.compile(r"^\s*checks:\s*(\[.*\])\s*,?\s*$")


def load_checks():
    items = []
    for path in sorted(DATA.glob("*.js")):
        current = None
        for line in path.read_text(encoding="utf-8").splitlines():
            m_id = re.match(r'^\s*(?:\{\s*)?id:\s*"([^"]+)"', line)
            if m_id:
                current = m_id.group(1)
            m = CHECK_RE.match(line)
            if m:
                items.append((path.name, current, json.loads(m.group(1))))
    return items


def run_check(chk):
    kind = chk["kind"]
    if kind == "algo":
        fn = ALGOS[chk["algo"]]
        for n in chk["ns"]:
            got, want = fn(n), ev(chk["formula"], n=n)
            if got != want:
                return False, f"{chk['algo']}({n}) = {got}, формула даёт {want}"
            if "value" in chk and got != chk["value"]:
                return False, f"{chk['algo']}({n}) = {got}, в ответе {chk['value']}"
        return True, f"{chk['algo']}: {chk['formula']} на n = {chk['ns']}"
    if kind == "sum":
        term = SUM_TERMS[chk["algo"]]
        for n in chk["ns"]:
            lo, hi = ev(chk["args"][0], n=n), ev(chk["args"][1], n=n)
            got = sum(term(i) for i in range(lo, hi + 1))
            want = ev(chk["formula"], n=n)
            if got != want:
                return False, f"сумма {chk['algo']} при n={n}: {got} ≠ {want}"
        return True, f"сумма {chk['algo']} = {chk['formula']} на n = {chk['ns']}"
    if kind == "value":
        got = ev(chk["expr"], **chk["vars"])
        ok = abs(got - chk["value"]) < 1e-9
        return ok, f"{chk['expr']} при {chk['vars']} = {got}, ожидалось {chk['value']}"
    if kind == "ratio":
        for n in [10, 100, 1000]:
            got = ev(chk["expr"], n=n)
            if abs(got - chk["value"]) > 1e-9:
                return False, f"отношение при n={n}: {got}"
        return True, f"отношение = {chk['value']}"
    if kind == "recurrence":
        for n in chk["ns"]:
            got, want = recurrence(chk["rec"], n), ev(chk["formula"], n=n)
            if got != want:
                return False, f"{chk['rec']}({n}) = {got}, формула {want}"
        return True, f"рекуррентность {chk['rec']} = {chk['formula']} на n = {chk['ns']}"
    if kind == "avg":
        fn = ALGOS[chk["algo"]]
        for n in chk["ns"]:
            got, want = fn(n), ev(chk["formula"], n=n)
            if got != want:
                return False, f"{chk['algo']}({n}) = {got}, формула {want}"
        if "value_n10" in chk and fn(10) != chk["value_n10"]:
            return False, f"при n=10 получено {fn(10)}"
        return True, f"{chk['algo']}: точное ожидание = {chk['formula']}"
    if kind == "bounds":
        fn = ALGOS[chk["algo"]]
        a, b = chk["ns_range"]
        for n in range(a, b + 1):
            v = fn(n)
            if not ev(chk["lo"], n=n) <= v <= ev(chk["hi"], n=n):
                return False, f"граница нарушена при n={n}: {v}"
        return True, f"{chk['lo']} ≤ {chk['algo']}(n) ≤ {chk['hi']} для n = {a}..{b}"
    return False, f"неизвестный вид проверки {kind}"


# ---------- структура банка заданий ----------

def structure():
    errors, stats = [], {}
    qtext = (DATA / "quizzes.js").read_text(encoding="utf-8")
    parts = re.split(r"window\.QUIZ\.(\w+)\s*=\s*\[", qtext)
    for name, body in zip(parts[1::2], parts[2::2]):
        qs = re.split(r'\n\s*\{\s*\n\s*id:\s*"', body)[1:]
        stats[f"квиз {name}"] = len(qs)
        for q in qs:
            qid = q.split('"', 1)[0]
            n_opt = len(re.findall(r"\{\s*t:\s*R`", q))
            n_ok = len(re.findall(r"ok:\s*true", q))
            n_why = len(re.findall(r"why:\s*R`", q))
            if n_ok != 1:
                errors.append(f"{qid}: верных вариантов {n_ok}, нужен 1")
            if n_why != n_opt or n_opt < 3:
                errors.append(f"{qid}: вариантов {n_opt}, объяснений {n_why}")
    for path in sorted(DATA.glob("tasks-*.js")):
        t = path.read_text(encoding="utf-8")
        blocks = re.split(r'\n\s*\{\s*\n\s*id:\s*"', t)[1:]
        for b in blocks:
            tid = b.split('"', 1)[0]
            lvl = re.search(r'level:\s*"(\w)"', b).group(1)
            key = f"{path.stem} {lvl}"
            stats[key] = stats.get(key, 0) + 1
            for field in ("text", "hint", "answer", "solution"):
                if not re.search(rf"\b{field}:\s*R`", b):
                    errors.append(f"{tid}: нет поля {field}")
    return errors, stats


def main():
    failed = 0
    checks = load_checks()
    print("Проверка ответов из data/*.js")
    print("-" * 72)
    for fname, qid, lst in checks:
        for chk in lst:
            ok, msg = run_check(chk)
            failed += not ok
            print(f"{'OK  ' if ok else 'FAIL'} {fname:15} {qid:8} {msg}")
    print()
    print("Числа из текста разборов")
    print("-" * 72)
    for name, got, want in CLAIMS:
        ok = got == want
        failed += not ok
        print(f"{'OK  ' if ok else 'FAIL'} {name}" + ("" if ok else f": получено {got}, ожидалось {want}"))
    print()
    errors, stats = structure()
    print("Структура банка заданий")
    print("-" * 72)
    for e in errors:
        print("FAIL", e)
    failed += len(errors)
    for k in sorted(stats):
        print(f"     {k:20} {stats[k]}")
    n_quiz = sum(v for k, v in stats.items() if k.startswith("квиз"))
    n_tasks = sum(v for k, v in stats.items() if k.startswith("tasks"))
    print(f"     всего вопросов квизов: {n_quiz} (минимум ТЗ: 20; квиз 10 на модуль)")
    print(f"     всего задач: {n_tasks} (минимум ТЗ: 26)")
    if n_quiz < 25 or n_tasks < 26:
        failed += 1
        print("FAIL недостаточно заданий")
    print()
    total = sum(len(lst) for _, _, lst in checks) + len(CLAIMS)
    if failed:
        print(f"ИТОГ: ошибок {failed}")
        sys.exit(1)
    print(f"ИТОГ: все проверки пройдены ({total} числовых проверок, структура в порядке)")


if __name__ == "__main__":
    main()
