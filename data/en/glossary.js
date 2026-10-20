/* Glossary. short: plain text for the tooltip, full: HTML with formulas for the glossary page */
(function () {
  var R = String.raw;
  window.GLOSSARY = {
    "input-size": {
      term: "Input size",
      short: "The parameter n on which the amount of work depends: array length, matrix order, number of bits of a number.",
      full: R`The parameter $n$ that characterizes the amount of input data: the number of array elements, the matrix order, the number of bits $b = \lfloor \log_2 n \rfloor + 1$ in the binary representation of a number. Efficiency is expressed as a function of the input size.`,
      see: "intro.html#size"
    },
    "basic-operation": {
      term: "Basic operation",
      short: "The operation contributing the most to the running time; usually the most time-consuming operation of the innermost loop.",
      full: R`The operation that contributes the most to the total running time. As a rule, it is the most time-consuming operation in the innermost loop: a key comparison in sorting and searching, a multiplication in matrix multiplication. The time is estimated as $T(n) \approx c_{op}\,C(n)$, where $C(n)$ is the number of times it is executed.`,
      see: "intro.html#basic-op"
    },
    "order-of-growth": {
      term: "Order of growth",
      short: "How fast the number of operations grows as n → ∞, up to a constant multiple.",
      full: R`The behavior of the function $C(n)$ as $n \to \infty$, up to a constant multiple. It is the order of growth that distinguishes efficient algorithms from inefficient ones on large inputs.`,
      see: "intro.html#growth"
    },
    "big-o": {
      term: "O-notation",
      short: "t(n) ∈ O(g(n)): t(n) ≤ c·g(n) for all n ≥ n₀, an upper bound.",
      full: R`$t(n) \in O(g(n))$ if there exist $c > 0$ and $n_0 \ge 0$ such that $t(n) \le c\,g(n)$ for all $n \ge n_0$. The order of growth of $t$ is no higher than that of $g$.`,
      see: "intro.html#notation"
    },
    "big-omega": {
      term: "Ω-notation",
      short: "t(n) ∈ Ω(g(n)): t(n) ≥ c·g(n) for all n ≥ n₀, a lower bound.",
      full: R`$t(n) \in \Omega(g(n))$ if there exist $c > 0$ and $n_0 \ge 0$ such that $t(n) \ge c\,g(n)$ for all $n \ge n_0$. The order of growth of $t$ is no lower than that of $g$.`,
      see: "intro.html#notation"
    },
    "big-theta": {
      term: "Θ-notation",
      short: "t(n) ∈ Θ(g(n)): c₂·g(n) ≤ t(n) ≤ c₁·g(n) for all n ≥ n₀, the same order of growth.",
      full: R`$t(n) \in \Theta(g(n))$ if there exist $c_1, c_2 > 0$ and $n_0 \ge 0$ such that $c_2\,g(n) \le t(n) \le c_1\,g(n)$ for all $n \ge n_0$. The functions have the same order of growth.`,
      see: "intro.html#notation"
    },
    "worst-case": {
      term: "Worst case",
      short: "An input of size n on which the algorithm performs the largest number of basic operations.",
      full: R`The efficiency on the input (or inputs) of size $n$ for which the algorithm runs the longest among all inputs of that size. $C_{worst}(n)$ guarantees that no input of size $n$ requires more operations.`,
      see: "intro.html#cases"
    },
    "best-case": {
      term: "Best case",
      short: "An input of size n on which the algorithm performs the fewest operations. It is not a “small input”.",
      full: R`The efficiency on the input of size $n$ for which the algorithm runs the fastest among all inputs of that size. The best case is not a small input: the size $n$ is fixed, only the contents vary.`,
      see: "intro.html#cases"
    },
    "average-case": {
      term: "Average case",
      short: "The expected number of operations on a “random” input of size n under explicit probabilistic assumptions.",
      full: R`The expected value of the number of basic operations on inputs of size $n$ for a given distribution of inputs. It requires explicit assumptions; it is not equal to the arithmetic mean of the worst and best cases.`,
      see: "module1.html#average"
    },
    "efficiency-class": {
      term: "Efficiency class",
      short: "The simplest function g(n) for which C(n) ∈ Θ(g(n)): 1, log n, n, n log n, n², n³, 2ⁿ, n!.",
      full: R`The simplest function $g(n)$ for which $C(n) \in \Theta(g(n))$. The basic classes: $1,\ \log n,\ n,\ n\log n,\ n^2,\ n^3,\ 2^n,\ n!$.`,
      see: "module1.html#growth"
    },
    "general-plan": {
      term: "General plan for analyzing time efficiency",
      short: "Five steps: input size → basic operation → cases → sum or recurrence → solution and class.",
      full: R`A sequence of five steps (Levitin, §2.3 and §2.4): decide on the input size; identify the basic operation; check whether the number of operations depends only on $n$; set up a sum (for nonrecursive algorithms) or a recurrence relation with an initial condition (for recursive ones); find a closed-form formula or at least the order of growth.`,
      see: "module1.html#plan"
    },
    "closed-form": {
      term: "Closed-form formula",
      short: "An explicit expression in n with no summation sign and no reference to other terms of the sequence.",
      full: R`An explicit expression in $n$ with no summation sign $\sum$ and no recursion. For example, $\sum_{i=1}^{n} i = \frac{n(n+1)}{2}$.`,
      see: "module1.html#sums"
    },
    "dependent-bound": {
      term: "Dependent loop bound",
      short: "The bound of the inner loop depends on the outer loop variable, e.g., j from i+1 to n−1.",
      full: R`The bound of the inner loop depends on the variable of the outer loop, for example, $j$ from $i+1$ to $n-1$. The number of repetitions of the inner loop is computed by the formula $u - l + 1$ separately for each $i$.`,
      see: "module1.html#dependent"
    },
    "geometric-series": {
      term: "Geometric series",
      short: "1 + a + … + aⁿ = (aⁿ⁺¹ − 1)/(a − 1); in particular, 1 + 2 + … + 2ⁿ = 2ⁿ⁺¹ − 1.",
      full: R`$\sum_{i=0}^{n} a^i = \frac{a^{n+1}-1}{a-1}$ for $a \ne 1$; in particular, $\sum_{i=0}^{n} 2^i = 2^{n+1}-1$ (Levitin, Appendix A).`,
      see: "module1.html#sums"
    },
    "multiplicative-loop": {
      term: "Multiplicative loop",
      short: "The loop variable is multiplied or divided by a constant (i ← 2i, n ← ⌊n/2⌋); the number of steps is ≈ log n.",
      full: R`A loop in which the variable is multiplied or divided by a constant: $i \leftarrow 2i$ or $n \leftarrow \lfloor n/2 \rfloor$. The number of repetitions is logarithmic, for example, $\lfloor \log_2 n \rfloor + 1$.`,
      see: "module1.html#multiplicative"
    },
    "off-by-one": {
      term: "Off-by-one error",
      short: "A wrong count of the number of terms: u − l instead of u − l + 1, or a shifted loop bound.",
      full: R`A count of repetitions that is off by $\pm1$: for example, $u - l$ instead of $u - l + 1$. The order of growth usually does not change, but the exact formula becomes wrong.`,
      see: "module1.html#mistakes"
    },
    "early-exit": {
      term: "Early exit",
      short: "Leaving a loop via return or a condition before the bounds are exhausted; it gives rise to different cases.",
      full: R`Termination of a loop (via return or a while condition) before the variable has gone through all its values. Because of an early exit, the number of operations depends not only on $n$, and the worst, best and average cases must be analyzed.`,
      see: "module1.html#mistakes"
    },
    "hidden-cost": {
      term: "Hidden cost",
      short: "An operation that looks like one step but costs Θ(n): the search x in list, a list slice, copying.",
      full: R`A line of code that looks like a single operation but executes a loop: the test <code>x in list</code>, the slice <code>A[1:]</code>, string concatenation. Its cost must be taken into account when counting.`,
      see: "module1.html#mistakes"
    },
    "empirical-analysis": {
      term: "Empirical analysis",
      short: "Checking efficiency by experiment: a basic-operation counter or time measurement on a sample of inputs.",
      full: R`Investigating efficiency by experiment (Levitin, §2.6): a counter of the basic operation is inserted into the program (or the time is measured), the program is run on a sample of inputs, and the data are analyzed, for example, the ratios $M(2n)/M(n)$.`,
      see: "module1.html#empirical"
    },
    "operation-counter": {
      term: "Operation counter",
      short: "A variable incremented by 1 each time the basic operation is executed, in every place in the program.",
      full: R`A variable in the program that is incremented each time the basic operation is executed. If the basic operation occurs in several places in the code, all of them must be counted.`,
      see: "module1.html#empirical"
    },
    "recurrence": {
      term: "Recurrence relation",
      short: "An equation expressing x(n) through its values at smaller arguments, e.g., M(n) = M(n−1) + 1.",
      full: R`An equation that defines a term of a sequence through previous terms, for example, $M(n) = M(n-1) + 1$. Together with an initial condition, it defines the sequence uniquely.`,
      see: "module2.html#plan"
    },
    "initial-condition": {
      term: "Initial condition",
      short: "The value of the sequence at the smallest n, where the recursion stops, e.g., M(0) = 0.",
      full: R`The value at the smallest argument, where the recursion stops, for example, $M(0) = 0$. It is found from the exit line of the algorithm. Without it, a recurrence relation has infinitely many solutions.`,
      see: "module2.html#plan"
    },
    "backward-substitution": {
      term: "Method of backward substitutions",
      short: "Repeatedly substitute x(n−1), x(n−2), … into the original equation, spot the pattern and reach the initial condition.",
      full: R`A method of solving recurrence relations: express $x(n-1)$ through $x(n-2)$ and substitute, repeat, notice the general formula after $i$ substitutions, and choose $i$ so as to reach the initial condition. The result is checked by induction or by substitution.`,
      see: "module2.html#backward"
    },
    "induction": {
      term: "Mathematical induction",
      short: "A proof: basis (the statement holds for the initial n) + step (truth for n−1 implies truth for n).",
      full: R`A method of proving a statement $P(n)$ for all $n \ge n_0$: check the basis $P(n_0)$ and prove the step $P(n-1) \Rightarrow P(n)$ (in the strong form, from truth for all smaller values).`,
      see: "module2.html#induction"
    },
    "recursion-tree": {
      term: "Tree of recursive calls",
      short: "Nodes are calls with their parameters; children are calls made from within. Number of nodes = number of calls.",
      full: R`A tree whose nodes correspond to recursive calls (labeled with the parameter values), and the children of a node correspond to the calls made from it. Counting nodes level by level gives the total number of calls, for example, $\sum_{l=0}^{n-1} 2^l = 2^n - 1$ for the Tower of Hanoi.`,
      see: "module2.html#hanoi"
    },
    "call-stack": {
      term: "Call stack",
      short: "Memory that stores unfinished calls. Recursion depth = extra memory.",
      full: R`The memory area that stores the records of active (unfinished) calls. The maximum recursion depth determines the extra memory: $\Theta(n)$ for the recursive factorial, $n$ records for the Tower of Hanoi.`,
      see: "module2.html#recursion-vs-iteration"
    },
    "tail-recursion": {
      term: "Tail recursion",
      short: "The recursive call is the last action of the function. It can be replaced by a loop; Python does not do this.",
      full: R`Recursion in which the recursive call is the last action of the function (its result is returned immediately). Such a call can be replaced by a loop without stack growth (see CLRS). Python does not perform this replacement.`,
      see: "module2.html#tail"
    },
    "memoization": {
      term: "Memoization (memory functions)",
      short: "Storing already computed results in a table so as not to solve the same subproblem again (Levitin, §8.2).",
      full: R`A technique in which a recursive function first looks up the result in a table and computes it only if it is absent. Levitin calls these <i>memory functions</i>, §8.2. For Fibonacci numbers it reduces the number of additions from $F(n+1)-1$ to $n-1$.`,
      see: "module2.html#fibonacci"
    },
    "repeated-subproblems": {
      term: "Repeated subproblems",
      short: "The same subproblem is solved by the recursion many times, like F(2) in the tree of the naive Fibonacci algorithm.",
      full: R`A situation in which a recursive algorithm solves the same subproblem many times (for example, $F(n-2)$ is computed both from $F(n)$ and from $F(n-1)$). A sign of exponential inefficiency and a reason to apply memoization or iteration.`,
      see: "module2.html#fibonacci"
    },
    "smoothness-rule": {
      term: "Smoothness rule",
      short: "If T(n) is nondecreasing, T(n) ∈ Θ(f(n)) for n = 2ᵏ, and f is smooth, then T(n) ∈ Θ(f(n)) for all n.",
      full: R`Theorem (Levitin, Appendix B): if $T(n)$ is eventually nondecreasing, $f(n)$ is smooth ($f(2n) \in \Theta(f(n))$), and $T(n) \in \Theta(f(n))$ for $n = b^k$, then $T(n) \in \Theta(f(n))$ for all $n$. The functions $\log n,\ n,\ n\log n,\ n^\alpha$ are smooth; $2^n$ is not.`,
      see: "module2.html#binrec"
    },
    "golden-ratio": {
      term: "Golden ratio φ",
      short: "φ = (1 + √5)/2 ≈ 1.618; Fibonacci numbers grow as φⁿ.",
      full: R`$\varphi = \frac{1+\sqrt5}{2} \approx 1.61803$. The formula $F(n) = \frac{1}{\sqrt5}(\varphi^n - \hat\varphi^n)$ implies $F(n) \in \Theta(\varphi^n)$.`,
      see: "module2.html#fibonacci"
    },
    "floor": {
      term: "Floor ⌊x⌋",
      short: "The greatest integer not exceeding x: ⌊3.8⌋ = 3. The number of bits of n is ⌊log₂ n⌋ + 1.",
      full: R`$\lfloor x \rfloor$ is the greatest integer not larger than $x$; $\lceil x \rceil$ is the smallest integer not smaller than $x$. For example, $\lfloor 3.8 \rfloor = 3$, $\lceil 3.8 \rceil = 4$. Useful: $\lfloor n/2 \rfloor + \lceil n/2 \rceil = n$.`,
      see: "module1.html#multiplicative"
    }
  };
})();
