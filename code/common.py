"""Общие функции: печать таблиц сверки и построение графиков."""
from pathlib import Path

import matplotlib

matplotlib.use("Agg")  # без окна, только запись в файл
import matplotlib.pyplot as plt

IMG_DIR = Path(__file__).resolve().parent.parent / "assets" / "img"

GREY = "#808080"
ACCENT = "#3b63d8"
FORMULA = "#9a9a9a"
EXTRA = "#d0743c"


def _fmt(x, decimals):
    if isinstance(x, float):
        return f"{x:.{decimals}f}"
    return str(x)


def print_table(title, rows, tol=None, decimals=3):
    """rows: (n, счётчик, формула). tol — относительная погрешность для float.
    Возвращает True, если все строки совпали."""
    print()
    print(title)
    head = ("n", "счётчик", "формула", "совпадает")
    cells = []
    all_ok = True
    for n, c, f in rows:
        if tol is None:
            ok = c == f
        else:
            denom = abs(f) if f != 0 else 1.0
            ok = abs(c - f) / denom < tol
        all_ok = all_ok and ok
        cells.append((str(n), _fmt(c, decimals), _fmt(f, decimals), "да" if ok else "НЕТ"))
    widths = [max(len(head[i]), *(len(r[i]) for r in cells)) if cells else len(head[i])
              for i in range(4)]
    line = " | ".join(h.rjust(w) for h, w in zip(head, widths))
    print(line)
    print("-+-".join("-" * w for w in widths))
    for r in cells:
        print(" | ".join(v.rjust(w) for v, w in zip(r, widths)))
    print("Итог:", "все строки совпали" if all_ok else "ЕСТЬ РАСХОЖДЕНИЯ")
    return all_ok


def plot(ns, counts, formula_ns, formula_vals, title, xlabel, ylabel, filename,
         logy=False, extra_series=None, step=False):
    """Сохраняет SVG в assets/img/<filename>.svg."""
    IMG_DIR.mkdir(parents=True, exist_ok=True)
    plt.rcParams.update({
        "svg.fonttype": "none",
        "font.family": "sans-serif",
        "font.size": 10,
        "text.color": GREY,
        "axes.labelcolor": GREY,
        "axes.edgecolor": GREY,
        "xtick.color": GREY,
        "ytick.color": GREY,
    })
    fig, ax = plt.subplots(figsize=(6.4, 3.6))
    if formula_ns is not None and formula_vals is not None:
        ax.plot(formula_ns, formula_vals, linestyle="--", color=FORMULA,
                linewidth=1.6, label="формула", zorder=2)
    if step:
        ax.step(ns, counts, where="post", color=ACCENT, linewidth=1.4,
                label="счётчик", zorder=3)
    else:
        ax.plot(ns, counts, linestyle="none", marker="o", markersize=4.5,
                color=ACCENT, label="счётчик", zorder=3)
    for xs, ys, label, style in (extra_series or []):
        kw = {"color": EXTRA}
        kw.update(style or {})
        ax.plot(xs, ys, label=label, zorder=3, **kw)
    if logy:
        ax.set_yscale("log")
    ax.set_title(title, color=GREY)
    ax.set_xlabel(xlabel)
    ax.set_ylabel(ylabel)
    for side in ("top", "right"):
        ax.spines[side].set_visible(False)
    ax.grid(True, alpha=0.2, color=GREY)
    leg = ax.legend(frameon=False)
    for t in leg.get_texts():
        t.set_color(GREY)
    fig.tight_layout()
    path = IMG_DIR / f"{filename}.svg"
    fig.savefig(path, format="svg", transparent=True)
    plt.close(fig)
    print(f"\nГрафик сохранён: {path}")
    return path
