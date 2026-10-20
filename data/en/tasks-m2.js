/* Module 2 tasks. The checks lines are strict JSON for code/verify_answers.py */
(function () {
  var R = String.raw;
  window.TASKS = window.TASKS || {};

  window.TASKS.m2 = [
    {
      id: "m2-a1", level: "A", label: "A1", title: "A simple recurrence",
      checks: [{"kind": "recurrence", "rec": "x_prev_plus4_x0_3", "formula": "4*n+3", "ns": [0, 1, 2, 10, 50]}],
      text: R`<p>Solve by the method of backward substitutions: $x(n) = x(n-1) + 4$ for $n > 0$, $x(0) = 3$.</p>`,
      hint: R`After $i$ substitutions you get $x(n-i)$ plus some number of fours. Which $i$ leads to the initial condition?`,
      answer: R`$x(n) = 4n + 3$.`,
      solution: R`<ol class="steps">
<li>$x(n) = x(n-1) + 4 = [x(n-2) + 4] + 4 = x(n-2) + 2\cdot4 = [x(n-3) + 4] + 2\cdot 4 = x(n-3) + 3\cdot4$.</li>
<li>Pattern after $i$ substitutions: $x(n) = x(n-i) + 4i$.</li>
<li>The initial condition is given at $0$, so take $i = n$: $x(n) = x(0) + 4n = 4n + 3$.</li>
<li>Check: $x(0) = 3$ (correct); $4n + 3 = (4(n-1) + 3) + 4$ (correct).</li>
</ol>`
    },
    {
      id: "m2-a2", level: "A", label: "A2", title: "Recursive search from the end",
      checks: [{"kind": "algo", "algo": "rec_search_worst", "formula": "n", "ns": [0, 1, 5, 40]}, {"kind": "algo", "algo": "rec_search_best", "formula": "1", "ns": [1, 5, 40]}],
      text: R`<pre class="pseudo">ALGORITHM RecSearch(A[0..n − 1], K)
//Is K in the array? Scans from the end
if n = 0  return false
if A[n − 1] = K  return true
return RecSearch(A[0..n − 2], K)</pre>
<p>Set up a recurrence relation and initial condition for the number of key comparisons $C(n)$ in the worst case and solve it. What is $C_{best}(n)$ for $n \ge 1$?</p>`,
      hint: R`The worst case is when the key is absent. Each call makes one comparison and calls itself on an array shorter by 1. How many comparisons are made for $n = 0$?`,
      answer: R`$C_{worst}(n) = C_{worst}(n-1) + 1$, $C_{worst}(0) = 0$, hence $C_{worst}(n) = n$; $C_{best}(n) = 1$ (the key is in $A[n-1]$).`,
      solution: R`<ol class="steps">
<li>Input size is $n$; the basic operation is the comparison $A[n-1] = K$ (the check $n = 0$ is not counted).</li>
<li>Because of the early exit (return true), the worst and best cases differ.</li>
<li>Worst case: the key is absent or is only in $A[0]$; every call compares and recurses. $C(n) = C(n-1) + 1$ for $n > 0$; for $n = 0$ there are no comparisons, $C(0) = 0$.</li>
<li>Substitutions: $C(n) = C(n-1) + 1 = C(n-2) + 2 = \dots = C(n-i) + i$; with $i = n$ we get $C(n) = n \in \Theta(n)$.</li>
<li>Best case: $A[n-1] = K$, one comparison, $C_{best}(n) = 1$.</li>
</ol>`
    },
    {
      id: "m2-a3", level: "A", label: "A3", title: "A robot and the Tower of Hanoi",
      checks: [{"kind": "value", "expr": "max(k for k in range(1,64) if 2**k-1 <= 2*86400)", "vars": {}, "value": 17}],
      text: R`<p>A robot makes 2 moves per second and moves disks using the optimal recursive algorithm. What is the largest number of disks $n$ it can move within one day?</p>`,
      hint: R`The number of moves is $M(n) = 2^n - 1$. How many moves can the robot make in $24\cdot3600$ seconds?`,
      answer: R`$n = 17$.`,
      solution: R`<ol class="steps">
<li>In one day the robot makes $2\cdot 86\,400 = 172\,800$ moves.</li>
<li>We need the largest $n$ such that $2^n - 1 \le 172\,800$.</li>
<li>$2^{17} - 1 = 131\,071 \le 172\,800$, while $2^{18} - 1 = 262\,143 > 172\,800$. Answer: $n = 17$.</li>
<li>Each additional disk doubles the time: 18 disks would take about 36 hours.</li>
</ol>`
    },
    {
      id: "m2-a4", level: "A", label: "A4", title: "Decimal digits",
      checks: [{"kind": "algo", "algo": "digits_additions", "formula": "len(str(n))-1", "ns": [1, 9, 10, 99, 100, 12345, 1000000]}],
      text: R`<pre class="pseudo">ALGORITHM Digits(n)
//Number of decimal digits of a positive integer n
if n < 10  return 1
return Digits(⌊n/10⌋) + 1</pre>
<p>Set up a recurrence relation and initial condition for the number of additions $A(n)$. Solve it for $n = 10^k$. Compare with BinRec.</p>`,
      hint: R`It is structured just like BinRec, except that the argument is divided by 10. Convenient values of $n$ are powers of ten.`,
      answer: R`$A(n) = A(\lfloor n/10 \rfloor) + 1$ for $n \ge 10$, $A(n) = 0$ for $1 \le n \le 9$. For $n = 10^k$: $A = k = \log_{10} n$; exactly, $A(n) = \lfloor \log_{10} n \rfloor \in \Theta(\log n)$.`,
      solution: R`<ol class="steps">
<li>Input size is $n$; the basic operation is the addition $+1$.</li>
<li>There are no separate worst and best cases: everything is determined by the value of $n$.</li>
<li>$A(n) = A(\lfloor n/10\rfloor) + 1$ for $n \ge 10$; for $n < 10$ there are no additions: $A(n) = 0$, in particular $A(1) = 0$.</li>
<li>For $n = 10^k$: $A(10^k) = A(10^{k-1}) + 1 = \dots = A(10^{k-i}) + i$; with $i = k$ we get $A(1) + k = k = \log_{10} n$.</li>
<li>By the smoothness rule, $A(n) \in \Theta(\log n)$ for all $n$; the exact formula is $\lfloor \log_{10} n\rfloor$ (the number of digits minus 1). As with <a href="module2.html#binrec">BinRec</a>, the base of the logarithm affects only the constant.</li>
</ol>`
    },
    {
      id: "m2-b1", level: "B", label: "B1", title: "Doubling plus a constant",
      checks: [{"kind": "recurrence", "rec": "x_2prev_plus3_x0_1", "formula": "2**(n+2)-3", "ns": [0, 1, 2, 3, 10, 20]}],
      text: R`<p>Solve: $x(n) = 2x(n-1) + 3$ for $n > 0$, $x(0) = 1$. Verify the answer by substituting it into the equation and the initial condition.</p>`,
      hint: R`Proceed as with the Tower of Hanoi: after $i$ substitutions you get $2^i x(n-i)$ plus three times a geometric series.`,
      answer: R`$x(n) = 2^{n+2} - 3$.`,
      solution: R`<ol class="steps">
<li>$x(n) = 2x(n-1) + 3 = 2[2x(n-2) + 3] + 3 = 2^2x(n-2) + 3(2 + 1) = 2^3x(n-3) + 3(2^2 + 2 + 1)$.</li>
<li>After $i$ substitutions: $x(n) = 2^i x(n-i) + 3(2^{i-1} + \dots + 1) = 2^i x(n-i) + 3(2^i - 1)$.</li>
<li>$i = n$: $x(n) = 2^n\cdot1 + 3(2^n - 1) = 4\cdot2^n - 3 = 2^{n+2} - 3$.</li>
<li>Check: $x(0) = 4 - 3 = 1$ (correct); $2(2^{n+1} - 3) + 3 = 2^{n+2} - 3$ (correct).</li>
</ol>`
    },
    {
      id: "m2-b2", level: "B", label: "B2", title: "A growing term",
      checks: [{"kind": "recurrence", "rec": "x_prev_plus3n_x0_2", "formula": "2+3*n*(n+1)//2", "ns": [0, 1, 2, 5, 40]}],
      text: R`<p>Solve: $x(n) = x(n-1) + 3n$ for $n > 0$, $x(0) = 2$. What is the order of growth?</p>`,
      hint: R`After $i$ substitutions the sum $3(n - i + 1) + \dots + 3n$ is added. For $i = n$ this is $3(1 + 2 + \dots + n)$.`,
      answer: R`$x(n) = 2 + \dfrac{3n(n+1)}{2} \in \Theta(n^2)$.`,
      solution: R`<ol class="steps">
<li>$x(n) = x(n-1) + 3n = x(n-2) + 3(n-1) + 3n = x(n-3) + 3(n-2) + 3(n-1) + 3n$.</li>
<li>After $i$ substitutions: $x(n) = x(n-i) + 3\sum_{j=n-i+1}^{n} j$.</li>
<li>$i = n$: $x(n) = x(0) + 3\sum_{j=1}^{n} j = 2 + \frac{3n(n+1)}{2}$.</li>
<li>Check: $x(1) = 2 + 3 = 5$, and the formula gives $2 + 3 = 5$ (correct). The order of growth is $\Theta(n^2)$.</li>
</ol>`
    },
    {
      id: "m2-b3", level: "B", label: "B3", title: "Halving with a square",
      checks: [{"kind": "recurrence", "rec": "x_half_plus_n2_x1_1", "formula": "(4*n*n-1)//3", "ns": [1, 2, 4, 8, 64, 1024]}],
      text: R`<p>Solve for $n = 2^k$: $x(n) = x(n/2) + n^2$ for $n > 1$, $x(1) = 1$. What is the order of growth for all $n$, assuming $x$ is nondecreasing?</p>`,
      hint: R`Switch to $k$: $x(2^k) = x(2^{k-1}) + 4^k$. You get a geometric series in powers of four.`,
      answer: R`$x(n) = \dfrac{4n^2 - 1}{3}$ for $n = 2^k$; $x(n) \in \Theta(n^2)$ for all $n$ by the smoothness rule.`,
      solution: R`<ol class="steps">
<li>For $n = 2^k$: $x(2^k) = x(2^{k-1}) + 4^k$, $x(2^0) = 1$.</li>
<li>Substitutions: $x(2^k) = x(2^{k-2}) + 4^{k-1} + 4^k = \dots = x(2^{k-i}) + \sum_{j=k-i+1}^{k} 4^j$.</li>
<li>$i = k$: $x(2^k) = 1 + \sum_{j=1}^{k}4^j = \sum_{j=0}^{k}4^j = \frac{4^{k+1}-1}{3}$.</li>
<li>Back to $n$: $4^k = n^2$, hence $x(n) = \frac{4n^2 - 1}{3}$. Check: $x(2) = x(1) + 4 = 5 = \frac{16 - 1}{3}$ (correct).</li>
<li>$n^2$ is a smooth function and $x(n)$ is nondecreasing, so by the smoothness rule $x(n) \in \Theta(n^2)$ for all $n$. The dominant contribution comes from the largest term $n^2$.</li>
</ol>`
    },
    {
      id: "m2-b4", level: "B", label: "B4", title: "Three identical calls",
      checks: [{"kind": "algo", "algo": "tri_additions", "formula": "3**n-1", "ns": [0, 1, 2, 3, 6]}, {"kind": "algo", "algo": "tri_calls", "formula": "(3**(n+1)-1)//2", "ns": [0, 1, 2, 3, 6]}],
      text: R`<pre class="pseudo">ALGORITHM Pow3(n)
//Computes 3^n
if n = 0  return 1
return Pow3(n − 1) + Pow3(n − 1) + Pow3(n − 1)</pre>
<p>a) Set up and solve a recurrence relation for the number of additions $A(n)$.<br>
b) Set up a separate recurrence relation for the number of calls $C(n)$, solve it, and verify the answer by counting the nodes of the tree of recursive calls level by level.<br>
c) Compare with two corrected versions: one with a single call (return $3 \ast$ Pow3$(n-1)$) and one using exponentiation by halving the exponent. How many multiplications does each make?</p>`,
      hint: R`Each call with $n > 0$ makes two additions and three calls for $n - 1$. For the number of calls, do not forget the current call itself: that is the “+1” in the recurrence.`,
      answer: R`a) $A(n) = 3A(n-1) + 2$, $A(0) = 0$, hence $A(n) = 3^n - 1$. b) $C(n) = 3C(n-1) + 1$, $C(0) = 1$, hence $C(n) = \frac{3^{n+1}-1}{2} = \sum_{l=0}^{n}3^l$. c) One call: $n$ multiplications, $\Theta(n)$; halving the exponent: $\Theta(\log n)$ multiplications.`,
      solution: R`<ol class="steps">
<li>Input size is $n$; the basic operation is addition; there are no separate worst and best cases.</li>
<li>$A(n) = 3A(n-1) + 2$ for $n > 0$; $A(0) = 0$.</li>
<li>Substitutions: $A(n) = 3^2A(n-2) + 2(3 + 1) = 3^3A(n-3) + 2(3^2 + 3 + 1) = \dots = 3^iA(n-i) + 2\cdot\frac{3^i-1}{2} = 3^iA(n-i) + 3^i - 1$. With $i = n$: $A(n) = 3^n - 1$.</li>
<li>Calls: the current call plus three nested ones, $C(n) = 3C(n-1) + 1$ for $n > 0$, $C(0) = 1$. Substitutions: $C(n) = 3^iC(n-i) + \frac{3^i - 1}{2}$; with $i = n$ we get $C(n) = 3^n + \frac{3^n-1}{2} = \frac{3^{n+1}-1}{2}$.</li>
<li>Check by the tree: the root is $n$, and every node with parameter $m > 0$ has three children $m - 1$; level $l$ contains $3^l$ nodes, levels are $0..n$, and $\sum_{l=0}^{n} 3^l = \frac{3^{n+1}-1}{2}$. For $n = 1$ there are four calls (correct).</li>
<li>The calls are identical, so one suffices: return $3 \ast$ Pow3$(n-1)$ makes $n$ multiplications instead of $3^n - 1$ additions. It is even better to halve the exponent, as in <a href="module2.html#own-power">Power</a>: from $\lfloor\log_2 n\rfloor$ to $2\lfloor\log_2 n\rfloor$ multiplications. This is the same situation as with naive Fibonacci: a concise recursion hides exponential work.</li>
</ol>`
    },
    {
      id: "m2-c1", level: "C", label: "C1", title: "Proof by induction: maximum by halving",
      checks: [{"kind": "algo", "algo": "maxdc_comparisons", "formula": "n-1", "ns": [1, 2, 3, 5, 6, 7, 100, 1000]}],
      text: R`<p>For the algorithm <a href="module2.html#own-maxdc">MaxDC</a>, the number of comparisons satisfies
$$C(n) = C(\lceil n/2 \rceil) + C(\lfloor n/2 \rfloor) + 1 \ \text{ for } n > 1, \qquad C(1) = 0.$$
In the worked example, the formula $C(n) = n - 1$ was derived only for $n = 2^k$. Prove it for <em>all</em> $n \ge 1$ by strong mathematical induction.</p>`,
      hint: R`In the inductive step, assume the formula holds for all values less than $n$. The identity from Appendix A will be useful: $\lfloor n/2 \rfloor + \lceil n/2 \rceil = n$.`,
      answer: R`$C(n) = n - 1$ for all $n \ge 1$. Proof: basis $n = 1$; step $C(n) = (\lceil n/2\rceil - 1) + (\lfloor n/2\rfloor - 1) + 1 = n - 1$.`,
      solution: R`<ol class="steps">
<li><strong>Statement</strong> $P(n)$: $C(n) = n - 1$.</li>
<li><strong>Basis</strong> $n = 1$: $C(1) = 0 = 1 - 1$ (correct).</li>
<li><strong>Hypothesis</strong>: let $n \ge 2$ and let $P(m)$ hold for all $1 \le m < n$.</li>
<li><strong>Step.</strong> For $n \ge 2$, both $\lceil n/2\rceil$ and $\lfloor n/2\rfloor$ lie in the interval $[1, n-1]$, so the hypothesis applies to them:
$$C(n) = \left(\left\lceil \tfrac n2 \right\rceil - 1\right) + \left(\left\lfloor \tfrac n2 \right\rfloor - 1\right) + 1 = \left\lceil \tfrac n2 \right\rceil + \left\lfloor \tfrac n2 \right\rfloor - 1 = n - 1.$$</li>
<li>By the principle of strong induction, $C(n) = n - 1$ for all $n \ge 1$. Hence the smoothness rule is not even needed here: the formula is exact for every $n$. Fewer comparisons are impossible: each comparison can eliminate at most one candidate for the maximum, and $n - 1$ candidates must be eliminated.</li>
</ol>`
    },
    {
      id: "m2-c2", level: "C", label: "C2", title: "Fast exponentiation: exact bounds",
      checks: [{"kind": "algo", "algo": "fastpow_mults", "formula": "floor_log2(n)+nu(n)-1", "ns": [1, 2, 3, 7, 8, 15, 31, 100, 1000]}, {"kind": "bounds", "algo": "fastpow_mults", "lo": "floor_log2(n)", "hi": "2*floor_log2(n)", "ns_range": [1, 3000]}],
      text: R`<p>For the algorithm <a href="module2.html#own-power">Power(a, n)</a>, the number of multiplications satisfies
$$M(n) = M(\lfloor n/2 \rfloor) + 1 + (n \bmod 2) \ \text{ for } n > 1, \qquad M(1) = 0.$$</p>
<ol>
<li>Prove by induction that $\lfloor\log_2 n\rfloor \le M(n) \le 2\lfloor\log_2 n\rfloor$ for all $n \ge 1$.</li>
<li>Find the values of $n$ at which the lower and upper bounds are attained.</li>
<li>Draw a conclusion about the efficiency class.</li>
</ol>`,
      hint: R`For $n \ge 2$, $\lfloor \log_2 \lfloor n/2\rfloor \rfloor = \lfloor\log_2 n\rfloor - 1$ (the last bit is dropped). In the step, bound $1 + (n \bmod 2)$ below by 1 and above by 2.`,
      answer: R`The bounds hold; the lower one is attained for $n = 2^k$ ($M = k$), the upper one for $n = 2^k - 1$ ($M = 2(k-1)$). Conclusion: $M(n) \in \Theta(\log n)$; exactly, $M(n) = \lfloor\log_2 n\rfloor + \nu(n) - 1$.`,
      solution: R`<ol class="steps">
<li>Let $L(n) = \lfloor\log_2 n\rfloor$. For $n \ge 2$, the binary representation of $\lfloor n/2\rfloor$ is obtained from that of $n$ by dropping the last bit, so $L(\lfloor n/2\rfloor) = L(n) - 1$.</li>
<li><strong>Basis</strong> $n = 1$: $M(1) = 0$, $L(1) = 0$, and $0 \le 0 \le 0$ (correct).</li>
<li><strong>Step</strong> (strong induction, $n \ge 2$, the statement holds for $m = \lfloor n/2\rfloor < n$).
Lower bound: $M(n) \ge M(m) + 1 \ge L(m) + 1 = L(n)$.
Upper bound: $M(n) \le M(m) + 2 \le 2L(m) + 2 = 2L(n)$ (correct).</li>
<li>The lower bound is attained when every increment equals 1, i.e., all dropped bits are zero: $n = 2^k$, $M = k$. The upper bound is attained when every increment equals 2: $n = 2^k - 1 = 11\dots1_2$. Then $M = 2(k-1) = 2L(n)$.</li>
<li>Hence $M(n) \in \Theta(\log n)$: for a fixed number of bits $b$, the number of multiplications depends on the number of ones in the binary representation of $n$: from $b - 1$ to $2(b-1)$. Each one except the leading one costs one extra multiplication, so $M(n) = L(n) + \nu(n) - 1$.</li>
</ol>`
    },
    {
      id: "m2-f1", level: "F", label: "F1", title: "Find the error: Tower of Hanoi",
      checks: [{"kind": "value", "expr": "2**(n+1)-1", "vars": {"n": 1}, "value": 3}, {"kind": "algo", "algo": "hanoi_moves", "formula": "2**n-1", "ns": [1, 2, 3, 10]}],
      text: R`<p>A student's solution:</p>
<blockquote class="def"><p>$M(n) = 2M(n-1) + 1$, $M(1) = 1$. After $i$ substitutions, $M(n) = 2^iM(n-i) + 2^i - 1$. To go all the way down, take $i = n$: $M(n) = 2^nM(0) + 2^n - 1$. Since $M(0) = 1$ (just like $M(1)$), we get $M(n) = 2^{n+1} - 1$.</p></blockquote>
<p>Find the error and obtain the correct answer.</p>`,
      hint: R`For which $n$ is the initial condition given? What does the student's formula give for $n = 1$?`,
      answer: R`The error is in the initial condition: $M(0)$ is not given, and “$M(0) = 1$” is wrong. One should take $i = n - 1$ and use $M(1) = 1$: $M(n) = 2^{n-1} + 2^{n-1} - 1 = 2^n - 1$.`,
      solution: R`<ol class="steps">
<li>Check: the student's formula gives $M(1) = 2^2 - 1 = 3$, but one disk is moved in one move. So there is an error.</li>
<li>The pattern $M(n) = 2^iM(n-i) + 2^i - 1$ is correct. The error is in the choice of $i$ and in the value of $M(0)$. The initial condition is given at $n = 1$, so we need $n - i = 1$, i.e., $i = n - 1$.</li>
<li>$M(n) = 2^{n-1}M(1) + 2^{n-1} - 1 = 2^{n-1} + 2^{n-1} - 1 = 2^n - 1$.</li>
<li>If you really want to go down to zero, $M(0)$ must be derived, not invented: zero disks means zero moves, $M(0) = 0$. Then $i = n$ gives the same answer $2^n - 1$. The initial condition is taken from the algorithm, not by analogy.</li>
</ol>`
    },
    {
      id: "m2-f2", level: "F", label: "F2", title: "Find the error: values instead of operations",
      checks: [{"kind": "algo", "algo": "factorial_mults", "formula": "n", "ns": [0, 1, 5, 20]}],
      text: R`<p>A student's solution for the recursive factorial $F(n) = F(n-1)\cdot n$, $F(0) = 1$:</p>
<blockquote class="def"><p>The algorithm computes $F(n) = n\cdot F(n-1)$, so the number of multiplications also satisfies $M(n) = n\cdot M(n-1)$. With $M(1) = 1$ we get $M(n) = n!$, i.e., the algorithm is factorial, $\Theta(n!)$.</p></blockquote>
<p>Find the error and correct the analysis.</p>`,
      hint: R`Distinguish between two recurrences: one for the <em>value</em> of the function and one for the <em>number of operations</em>. How many multiplications does a single call make by itself, not counting the nested call?`,
      answer: R`The recurrence for the values $F(n)$ was confused with the recurrence for the number of multiplications $M(n)$. The correct one is $M(n) = M(n-1) + 1$, $M(0) = 0$, hence $M(n) = n \in \Theta(n)$.`,
      solution: R`<ol class="steps">
<li>$F(n) = F(n-1)\cdot n$ describes <em>what</em> is computed. The number of multiplications describes <em>how much</em> work is done: $M(n-1)$ multiplications are spent on computing $F(n-1)$, and one more on multiplying the result by $n$.</li>
<li>Therefore $M(n) = M(n-1) + 1$ for $n > 0$. The initial condition comes from the exit line: for $n = 0$ there are no multiplications, $M(0) = 0$.</li>
<li>Backward substitutions: $M(n) = M(n-i) + i$; with $i = n$ we get $M(n) = n$.</li>
<li>Conclusion: $\Theta(n)$, not $\Theta(n!)$. The values grow as $n!$, but the number of operations is linear. Levitin specifically stresses this distinction in §2.4.</li>
</ol>`
    },
    {
      id: "m2-e1", level: "E", label: "E1", title: "Two identical calls on half the input",
      checks: [{"kind": "algo", "algo": "split_additions", "formula": "2**floor_log2(n)-1", "ns": [1, 2, 3, 7, 8, 9, 15, 16, 17, 100, 1000, 1024]}],
      text: R`<pre class="pseudo">ALGORITHM Split(n)
if n = 1  return 1
return Split(⌊n/2⌋) + Split(⌊n/2⌋)</pre>
<ol>
<li>Set up a recurrence relation for the number of additions $A(n)$ and solve it for $n = 2^k$.</li>
<li>Write a program with an addition counter, check all $n$ from 1 to 2000, and find an exact formula for arbitrary $n$.</li>
<li>Plot $A(n)$ together with the line $n - 1$. How does the result agree with the smoothness rule?</li>
</ol>`,
      hint: R`For $n = 2^k$: $A(2^k) = 2A(2^{k-1}) + 1$, the same recurrence as for the Tower of Hanoi, but in terms of $k$. For arbitrary $n$, look at which values of $n$ give the same value of $A$.`,
      answer: R`$A(n) = 2A(\lfloor n/2\rfloor) + 1$, $A(1) = 0$. For $n = 2^k$: $A = 2^k - 1 = n - 1$. Exactly: $A(n) = 2^{\lfloor\log_2 n\rfloor} - 1$, i.e., $\frac n2 - 1 < A(n) \le n - 1$, $A(n) \in \Theta(n)$. Code: <code>code/tasks/m2_e1_split.py</code>.`,
      solution: R`<ol class="steps">
<li>Input size is $n$; the basic operation is addition; there are no separate worst and best cases.</li>
<li>$A(n) = 2A(\lfloor n/2\rfloor) + 1$ for $n > 1$, $A(1) = 0$.</li>
<li>For $n = 2^k$: $A(2^k) = 2A(2^{k-1}) + 1 = 2^2A(2^{k-2}) + 2 + 1 = \dots = 2^kA(1) + 2^k - 1 = n - 1$.</li>
<li>Program:
<pre><code class="language-python">adds = 0

def split(n):
    global adds
    if n == 1:
        return 1
    a = split(n // 2)
    b = split(n // 2)
    adds += 1                     # basic operation
    return a + b

for n in range(1, 2001):
    adds = 0
    split(n)
    assert adds == 2 ** (n.bit_length() - 1) - 1</code></pre></li>
<li>The experiment shows that $A(n)$ is constant on the intervals $[2^k, 2^{k+1})$ and equals $2^k - 1$. The argument $\lfloor n/2\rfloor$ depends only on the leading bits, and the tree of recursive calls is a full binary tree of depth $\lfloor\log_2 n\rfloor$. Hence $A(n) = 2^{\lfloor\log_2 n\rfloor} - 1$.</li>
<li>Since $2^{\lfloor\log_2 n\rfloor} > n/2$, we have $\frac n2 - 1 < A(n) \le n - 1$. On the plot, the steps lie between the lines $n/2$ and $n$. This agrees with the smoothness rule: for powers of two $A(n) = n - 1 \in \Theta(n)$, $n$ is smooth, and $A$ is nondecreasing, so $A(n) \in \Theta(n)$ for all $n$. Empirically, the ratio $A(n)/n$ for $n$ from 100 to 2000 lies between 0.496 and 0.999; theoretically, $A(n)/n \in \left(\tfrac12 - \tfrac1n,\ 1\right)$.</li>
<li><img src="../assets/img/task-m2-e1.svg" alt="Step plot of A(n) = 2^floor(log2 n) − 1 between the lines n/2 and n − 1"></li>
</ol>`
    }
  ];
})();
