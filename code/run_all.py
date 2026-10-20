"""Запускает все скрипты по очереди и печатает итоговую сводку."""
import subprocess
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent

SCRIPTS = [
    "m1_max_element.py",
    "m1_unique_elements.py",
    "m1_matrix.py",
    "m1_binary.py",
    "m1_sequential_search.py",
    "m1_selection_sort.py",
    "m1_upper_sum.py",
    "m1_dependent_loops.py",
    "m2_factorial.py",
    "m2_hanoi.py",
    "m2_binrec.py",
    "m2_fibonacci.py",
    "m2_rec_max.py",
    "m2_fast_pow.py",
    "m2_rec_sum.py",
    "tasks/m1_e1_triple_loop.py",
    "tasks/m2_e1_split.py",
]


def main():
    results = []
    for name in SCRIPTS:
        print("=" * 70)
        print(f"Запуск: {name}")
        print("=" * 70, flush=True)
        proc = subprocess.run([sys.executable, str(HERE / name)], cwd=HERE)
        results.append((name, proc.returncode == 0))
    print("\n" + "=" * 70)
    print("ИТОГ")
    for name, ok in results:
        print(f"{name} — {'OK' if ok else 'FAIL'}")
    failed = sum(not ok for _, ok in results)
    print(f"\nУспешно: {len(results) - failed} из {len(results)}")
    if failed:
        sys.exit(1)


if __name__ == "__main__":
    main()
