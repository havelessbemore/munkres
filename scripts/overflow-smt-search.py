#!/usr/bin/env python3
"""
SMT worst-case search for dual-variable magnitude in the Munkres algorithm.

Given an n×n cost matrix with cells in [-M, M], the algorithm's step1
(row reduction followed by column reduction) computes:

    dualY[y] = min over x of matrix[y][x]
    dualX[x] = min over y of (matrix[y][x] - dualY[y])     # if Y <= X
            = 0                                             # if Y > X (tall)

This script uses Z3 to find the cell values that maximize
|dualX[x]| / M (the "magnification factor" after step1). SMT
confirms or refutes the tightness for small n.

NOT a regression / unit test. Standalone research script.


Requirements
------------

Python 3.9+ and the `z3-solver` package.


Installation
------------

If your Python install allows direct `pip` (older systems, virtualenvs):

    pip install z3-solver
    python3 scripts/overflow-smt-search.py

If your Python is PEP-668-managed (modern Homebrew / Debian / Ubuntu /
Fedora — `pip install` rejected with "externally-managed-environment"),
use a virtual environment:

    python3 -m venv .venv-smt
    .venv-smt/bin/pip install z3-solver
    .venv-smt/bin/python scripts/overflow-smt-search.py

Alternatively `pipx` works:

    pipx run --spec z3-solver python scripts/overflow-smt-search.py


Expected output
---------------

For each square / wide case (n in {2, 3, 4} square plus 2x3 wide), Z3
reports `max |dualX[x]| / M = 2.000000` along with a witness matrix
whose every row spans [-1, +1] and a target column where every cell is
+1 (yielding dualX = 2). For 3x2 tall, dualX is initialized to 0 and
the reported ratio is 0. Each case runs in under 50 ms.

The "dx_intermediate" section confirms that the pre-min expression
`cell - dualY[y]` reaches 2 (= R for symmetric inputs in [-1, 1]).
"""

from __future__ import annotations

import sys
import time
from typing import Optional

try:
    import z3
except ImportError:
    print("ERROR: z3-solver not installed.")
    print("  pip install z3-solver  (or in a venv)")
    sys.exit(1)


def z3_min(a: z3.ArithRef, b: z3.ArithRef) -> z3.ArithRef:
    return z3.If(a < b, a, b)


def get_float(model: z3.ModelRef, expr: z3.ArithRef) -> float:
    v = model.eval(expr, model_completion=True)
    if z3.is_rational_value(v):
        return float(v.as_fraction())
    return float(v.as_decimal(20).rstrip("?"))


def build_step1_constraints(
    n_y: int, n_x: int, M: float = 1.0
) -> tuple[
    list[list[z3.ArithRef]], list[z3.ArithRef], list[z3.ArithRef], list[z3.BoolRef]
]:
    """Build symbolic cells + dualY + dualX with step1 semantics.

    Returns (cells, dualY, dualX, constraints).
    """
    cells = [[z3.Real(f"c_{y}_{x}") for x in range(n_x)] for y in range(n_y)]
    constraints: list[z3.BoolRef] = []
    # Cells bounded.
    for y in range(n_y):
        for x in range(n_x):
            constraints.append(cells[y][x] >= -M)
            constraints.append(cells[y][x] <= M)
    # dualY[y] = min over x of cells[y][x].
    dual_y = [z3.Real(f"dy_{y}") for y in range(n_y)]
    for y in range(n_y):
        expr = cells[y][0]
        for x in range(1, n_x):
            expr = z3_min(expr, cells[y][x])
        constraints.append(dual_y[y] == expr)
    # dualX[x] = min over y of (cells[y][x] - dualY[y]), or 0 if tall.
    dual_x = [z3.Real(f"dx_{x}") for x in range(n_x)]
    if n_y <= n_x:
        for x in range(n_x):
            expr = cells[0][x] - dual_y[0]
            for y in range(1, n_y):
                expr = z3_min(expr, cells[y][x] - dual_y[y])
            constraints.append(dual_x[x] == expr)
    else:
        for x in range(n_x):
            constraints.append(dual_x[x] == 0)
    return cells, dual_y, dual_x, constraints


def search_worst_dualx(
    n_y: int, n_x: int, timeout_ms: int = 60_000
) -> Optional[dict]:
    """For each (column, sign), maximize sign * dualX[column], then take
    the witness with the largest absolute value."""
    M = 1.0
    cells, dual_y, dual_x, constraints = build_step1_constraints(n_y, n_x, M)

    best = {"ratio": -1.0}
    start = time.time()
    for target_idx in range(n_x):
        for target_sign in (1, -1):
            opt = z3.Optimize()
            opt.set("timeout", timeout_ms)
            for c in constraints:
                opt.add(c)
            obj = dual_x[target_idx] * target_sign
            opt.maximize(obj)
            res = opt.check()
            if res != z3.sat:
                continue
            model = opt.model()
            val = get_float(model, obj)
            if val > best["ratio"]:
                best["ratio"] = val
                best["target"] = (target_idx, target_sign)
                best["matrix"] = [
                    [get_float(model, cells[y][x]) for x in range(n_x)]
                    for y in range(n_y)
                ]
                best["dualY"] = [get_float(model, dy) for dy in dual_y]
                best["dualX"] = [get_float(model, dx) for dx in dual_x]
    wall_ms = (time.time() - start) * 1000
    if best["ratio"] < 0:
        return None
    return {**best, "wall_ms": wall_ms}


def search_worst_dx_intermediate(
    n_y: int, n_x: int, timeout_ms: int = 30_000
) -> Optional[dict]:
    """Maximize |cells[y][x] - dualY[y]| — the pre-min intermediate."""
    M = 1.0
    cells, dual_y, _, constraints = build_step1_constraints(n_y, n_x, M)

    best = {"ratio": -1.0}
    start = time.time()
    for y in range(n_y):
        for x in range(n_x):
            for sign in (1, -1):
                opt = z3.Optimize()
                opt.set("timeout", timeout_ms)
                for c in constraints:
                    opt.add(c)
                obj = (cells[y][x] - dual_y[y]) * sign
                opt.maximize(obj)
                if opt.check() != z3.sat:
                    continue
                model = opt.model()
                val = get_float(model, obj)
                if val > best["ratio"]:
                    best["ratio"] = val
                    best["target"] = (y, x, sign)
                    best["matrix"] = [
                        [get_float(model, cells[i][j]) for j in range(n_x)]
                        for i in range(n_y)
                    ]
    wall_ms = (time.time() - start) * 1000
    if best["ratio"] < 0:
        return None
    return {**best, "wall_ms": wall_ms}


def print_matrix(matrix: list[list[float]]) -> None:
    for row in matrix:
        print("    [" + ", ".join(f"{v:+.4f}" for v in row) + "]")


def main() -> None:
    print("=" * 70)
    print("SMT worst-case search: max |dualX[x]| / M after step1")
    print("=" * 70)

    for label, n_y, n_x in [
        ("2×2 square", 2, 2),
        ("3×3 square", 3, 3),
        ("4×4 square", 4, 4),
        ("2×3 wide", 2, 3),
        ("3×2 tall", 3, 2),
    ]:
        print(f"\n[{label}]")
        result = search_worst_dualx(n_y, n_x)
        if result is None:
            print("  TIMEOUT or UNSAT")
            continue
        print(f"  Wall time: {result['wall_ms']:.0f} ms")
        print(f"  max |dualX[x]| / M = {result['ratio']:.6f}")
        print(
            f"  Target: column {result['target'][0]}, sign {result['target'][1]:+d}"
        )
        print("  Witness matrix:")
        print_matrix(result["matrix"])
        print(f"  dualY: {[f'{v:+.4f}' for v in result['dualY']]}")
        print(f"  dualX: {[f'{v:+.4f}' for v in result['dualX']]}")

    print()
    print("=" * 70)
    print("SMT worst-case: max |cell - dualY| / M (pre-min intermediate)")
    print("=" * 70)
    for label, n_y, n_x in [("2×2", 2, 2), ("3×3", 3, 3), ("4×4", 4, 4)]:
        print(f"\n[{label}]")
        result = search_worst_dx_intermediate(n_y, n_x)
        if result is None:
            print("  TIMEOUT or UNSAT")
            continue
        print(f"  Wall time: {result['wall_ms']:.0f} ms")
        print(f"  max |cell - dualY| / M = {result['ratio']:.6f}")
        print("  Witness matrix:")
        print_matrix(result["matrix"])


if __name__ == "__main__":
    main()
