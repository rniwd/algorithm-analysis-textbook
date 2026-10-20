/* Module 1 tasks. The checks lines are strict JSON for code/verify_answers.py */
(function () {
  var R = String.raw;
  window.TASKS = window.TASKS || {};

  window.TASKS.m1 = [
    {
      id: "m1-a1", level: "A", label: "A1", title: "Counting negatives",
      checks: [{"kind": "algo", "algo": "count_negatives", "formula": "n", "ns": [1, 2, 10, 100]}],
      text: R`<pre class="pseudo">ALGORITHM CountNegatives(A[0..n − 1])
//Counts the negative elements of an array
c ← 0
for i ← 0 to n − 1 do
    if A[i] < 0  c ← c + 1
return c</pre>
<p>Analyze the algorithm following the general plan: input size, basic operation, whether the cases depend on the input, the number $C(n)$ of times the basic operation is executed, and the efficiency class.</p>`,
      hint: R`Which operation is executed on <em>every</em> iteration of the loop, and which only sometimes?`,
      answer: R`The basic operation is the comparison $A[i] < 0$; $C(n) = n \in \Theta(n)$, and the cases do not differ.`,
      solution: R`<ol class="steps">
<li>The input size is the number of elements $n$.</li>
<li>The loop body contains the comparison $A[i] < 0$ and the increment $c \leftarrow c + 1$. The comparison is executed on every iteration, the increment only for negative elements. The basic operation is the comparison.</li>
<li>The number of comparisons depends only on $n$: the loop never terminates early. The worst, best, and average cases coincide. (The number of increments of $c$ ranges from 0 to $n$, but it is not the basic operation.)</li>
<li>One comparison for each $i$ from $0$ to $n-1$: $C(n) = \sum_{i=0}^{n-1} 1$.</li>
<li>By formula (S1): $C(n) = (n-1) - 0 + 1 = n \in \Theta(n)$.</li>
</ol>`
    },
    {
      id: "m1-a2", level: "A", label: "A2", title: "Three sums",
      checks: [{"kind": "sum", "algo": "sum_ones", "args": ["4", "n+1"], "formula": "n-2", "ns": [3, 4, 10, 50]}, {"kind": "sum", "algo": "sum_3i_minus_2", "args": ["1", "n"], "formula": "(3*n*n-n)//2", "ns": [1, 2, 3, 10, 40]}, {"kind": "sum", "algo": "sum_pow3", "args": ["0", "n"], "formula": "(3**(n+1)-1)//2", "ns": [0, 1, 2, 5, 12]}],
      text: R`<p>Find closed-form formulas:</p>
<p>a) $\displaystyle\sum_{i=4}^{n+1} 1$ for $n \ge 3$; &nbsp; b) $\displaystyle\sum_{i=1}^{n} (3i - 2)$; &nbsp; c) $\displaystyle\sum_{i=0}^{n} 3^i$.</p>`,
      hint: R`a) Formula (S1); do not forget the $+1$. b) Split the sum using rules (R1), (R2). c) A geometric series with ratio 3.`,
      answer: R`a) $n - 2$; &nbsp; b) $\dfrac{3n^2 - n}{2}$; &nbsp; c) $\dfrac{3^{n+1} - 1}{2}$.`,
      solution: R`<p>a) By (S1): $u - l + 1 = (n+1) - 4 + 1 = n - 2$. Check for $n = 3$: the sum $\sum_{i=4}^{4} 1 = 1 = 3 - 2$.</p>
<p>b) By (R2) and (R1):
$$\sum_{i=1}^{n}(3i-2) = 3\sum_{i=1}^{n} i - 2\sum_{i=1}^{n} 1 = 3\cdot\frac{n(n+1)}{2} - 2n = \frac{3n^2 + 3n - 4n}{2} = \frac{3n^2 - n}{2}.$$
Check: $n = 3$ gives $1 + 4 + 7 = 12$ and $\frac{27 - 3}{2} = 12$.</p>
<p>c) The geometric series formula $\sum_{i=0}^{n} a^i = \frac{a^{n+1}-1}{a-1}$ with $a = 3$:
$$\sum_{i=0}^{n} 3^i = \frac{3^{n+1}-1}{2}.$$
Check: $n = 2$ gives $1 + 3 + 9 = 13 = \frac{27-1}{2}$.</p>`
    },
    {
      id: "m1-a3", level: "A", label: "A3", title: "Zeros in a matrix",
      checks: [{"kind": "algo", "algo": "count_zeros_matrix", "formula": "n*n", "ns": [1, 2, 5, 20]}],
      text: R`<pre class="pseudo">ALGORITHM CountZeros(A[0..n − 1, 0..n − 1])
z ← 0
for i ← 0 to n − 1 do
    for j ← 0 to n − 1 do
        if A[i, j] = 0  z ← z + 1
return z</pre>
<p>Find the number of comparisons $C(n)$ and the efficiency class. Then express the same count in terms of the total number of matrix elements $N = n^2$. How does the conclusion about the class change?</p>`,
      hint: R`The size can be measured by the matrix order $n$ or by the number of elements $N$. Count the comparisons, then substitute $n = \sqrt N$.`,
      answer: R`$C(n) = n^2 \in \Theta(n^2)$; in terms of $N$: $C = N \in \Theta(N)$, i.e., the algorithm is linear in the number of elements.`,
      solution: R`<ol class="steps">
<li>Size: the order $n$ (or the number of elements $N = n^2$).</li>
<li>The basic operation is the comparison $A[i,j] = 0$: it is in the innermost loop and is always executed.</li>
<li>There is no early exit; the cases do not differ.</li>
<li>$C(n) = \sum_{i=0}^{n-1}\sum_{j=0}^{n-1} 1 = \sum_{i=0}^{n-1} n = n^2$.</li>
<li>$C(n) \in \Theta(n^2)$. But $n^2 = N$, so in terms of the number of elements $C = N \in \Theta(N)$: each element is examined once. The class depends on the chosen measure of size, so it must be stated explicitly.</li>
</ol>`
    },
    {
      id: "m1-a4", level: "A", label: "A4", title: "Nested loop with a constant bound",
      checks: [{"kind": "algo", "algo": "inner_const5", "formula": "5*n", "ns": [1, 2, 10, 33]}],
      text: R`<pre class="pseudo">ALGORITHM Weighted(A[1..n])
s ← 0
for i ← 1 to n do
    for j ← 1 to 5 do
        s ← s + A[i] ∗ j
return s</pre>
<p>How many multiplications does the algorithm perform? What is its efficiency class? Is it true that “two nested loops are always $\Theta(n^2)$”?</p>`,
      hint: R`How many times is the inner loop executed? Does that depend on $n$?`,
      answer: R`$M(n) = 5n \in \Theta(n)$. No: the inner loop has a constant bound.`,
      solution: R`<ol class="steps">
<li>The size is $n$.</li>
<li>The basic operation is the multiplication $A[i] \ast j$ (one per iteration of the inner loop).</li>
<li>The cases do not differ: the loops always run through all values.</li>
<li>$M(n) = \sum_{i=1}^{n}\sum_{j=1}^{5} 1 = \sum_{i=1}^{n} 5 = 5n$.</li>
<li>$M(n) = 5n \in \Theta(n)$. Nesting of loops by itself says nothing: what matters is how many times the inner loop is executed. Here it is the constant 5.</li>
</ol>`
    },
    {
      id: "m1-b1", level: "B", label: "B1", title: "Comparisons with itself",
      checks: [{"kind": "algo", "algo": "b1_dependent", "formula": "n*(n+1)//2", "ns": [1, 2, 5, 30]}],
      text: R`<pre class="pseudo">ALGORITHM CountGreaterAfter(A[0..n − 1])
c ← 0
for i ← 0 to n − 1 do
    for j ← i to n − 1 do
        if A[i] > A[j]  c ← c + 1
return c</pre>
<p>Find the exact number of comparisons $C(n)$ and the efficiency class. How does the answer differ from UniqueElements?</p>`,
      hint: R`The inner loop starts at $j = i$, not at $i+1$. Count its repetitions for a fixed $i$ using the formula $u - l + 1$.`,
      answer: R`$C(n) = \dfrac{n(n+1)}{2} \in \Theta(n^2)$, which is $n$ more than in UniqueElements.`,
      solution: R`<ol class="steps">
<li>The size is $n$.</li>
<li>The basic operation is the comparison $A[i] > A[j]$.</li>
<li>There is no early exit: the number of comparisons depends only on $n$.</li>
<li>For a fixed $i$, the inner loop is executed $(n-1) - i + 1 = n - i$ times:
$$C(n) = \sum_{i=0}^{n-1}\sum_{j=i}^{n-1} 1 = \sum_{i=0}^{n-1} (n - i).$$</li>
<li>The terms $n, n-1, \dots, 1$ form the sum (S2):
$$C(n) = n + (n-1) + \dots + 1 = \frac{n(n+1)}{2} \in \Theta(n^2).$$
Compared with UniqueElements, there are $n$ extra comparisons of an element with itself ($j = i$), which always yield “false”. The order of growth is the same.</li>
</ol>`
    },
    {
      id: "m1-b2", level: "B", label: "B2", title: "Triple loop",
      checks: [{"kind": "algo", "algo": "b2_triple", "formula": "n*n*(n+1)//2", "ns": [1, 2, 3, 6, 15]}],
      text: R`<pre class="pseudo">ALGORITHM Triple(n)
x ← 0
for i ← 0 to n − 1 do
    for j ← 0 to n − 1 do
        for k ← 0 to j do
            x ← x + 1
return x</pre>
<p>Find the exact number of additions $x \leftarrow x + 1$ and the efficiency class.</p>`,
      hint: R`Count from the inside out. The innermost sum depends only on $j$, and the outer loop over $i$ simply repeats the result $n$ times (rule (R1)).`,
      answer: R`$A(n) = \dfrac{n^2(n+1)}{2} \in \Theta(n^3)$.`,
      solution: R`<ol class="steps">
<li>The size is $n$.</li>
<li>The basic operation is the addition $x \leftarrow x + 1$ in the innermost loop.</li>
<li>The cases do not differ: the input is $n$ itself; there is no data.</li>
<li>$$A(n) = \sum_{i=0}^{n-1}\sum_{j=0}^{n-1}\sum_{k=0}^{j} 1 = \sum_{i=0}^{n-1}\sum_{j=0}^{n-1} (j+1).$$</li>
<li>The inner sum: $\sum_{j=0}^{n-1}(j+1) = 1 + 2 + \dots + n = \frac{n(n+1)}{2}$. It does not depend on $i$, so
$$A(n) = n\cdot\frac{n(n+1)}{2} = \frac{n^2(n+1)}{2} \approx \frac{n^3}{2} \in \Theta(n^3).$$
Check: $n = 2$: for each $i$ we get $1 + 2 = 3$ additions, $6 = \frac{4\cdot3}{2}$ in total.</li>
</ol>`
    },
    {
      id: "m1-b3", level: "B", label: "B3", title: "Is there a zero row",
      checks: [{"kind": "algo", "algo": "zero_row_worst", "formula": "n*n", "ns": [1, 2, 5, 12]}, {"kind": "algo", "algo": "zero_row_best", "formula": "n", "ns": [1, 2, 5, 12]}],
      text: R`<pre class="pseudo">ALGORITHM HasZeroRow(A[0..n − 1, 0..n − 1])
//Checks whether the matrix has a row consisting only of zeros
for i ← 0 to n − 1 do
    j ← 0
    while j < n and A[i, j] = 0 do
        j ← j + 1
    if j = n  return true
return false</pre>
<p>The basic operation is the comparison $A[i,j] = 0$ (the index comparison $j < n$ is not counted). Find $C_{worst}(n)$ and $C_{best}(n)$ and describe the corresponding inputs.</p>`,
      hint: R`For each row, the inner loop stops at the first nonzero element. How many comparisons does a row starting with a nonzero element cost? And a zero row? How many rows must be examined if there is no zero row?`,
      answer: R`$C_{worst}(n) = n^2$, $C_{best}(n) = n$.`,
      solution: R`<ol class="steps">
<li>The size is the matrix order $n$.</li>
<li>The basic operation is the comparison $A[i,j] = 0$.</li>
<li>There are two early exits (the end of the while loop and return true), so the cases differ.</li>
<li><strong>Worst case.</strong> Row $i$ costs $k_i$ comparisons, where $k_i$ is the position of the first nonzero element plus 1, or $n$ if the row is zero. The maximum is $k_i = n$. For the algorithm to reach the last row, none of the first $n-1$ rows may be zero. Hence, in each of them the only nonzero element is in the last column. The last row is any such row or a zero row. Then
$$C_{worst}(n) = \sum_{i=0}^{n-1} n = n^2.$$</li>
<li><strong>Best case.</strong> Each examined nonzero row costs at least 1 comparison, a zero row exactly $n$. If there is no zero row, all $n$ rows are examined, i.e., at least $n$ comparisons, with equality when $A[i,0] \ne 0$ for all $i$. If there is a zero row, it alone costs $n$, with equality when it is row 0. Thus $C_{best}(n) = n$. This is an example showing that the best case need not cost $1$: the size $n$ is fixed, and fewer than $n$ comparisons are impossible.</li>
</ol>`
    },
    {
      id: "m1-b4", level: "B", label: "B4", title: "Inner loop with step 2",
      checks: [{"kind": "algo", "algo": "b4_step2", "formula": "(n+1)**2//4", "ns": [1, 2, 3, 4, 7, 10, 25]}],
      text: R`<pre class="pseudo">ALGORITHM Odd(n)
x ← 0
for i ← 1 to n do
    j ← 1
    while j ≤ i do
        x ← x + 1
        j ← j + 2
return x</pre>
<p>Find the exact number of additions $x \leftarrow x + 1$ for even $n = 2m$ and for any $n$. What is the efficiency class?</p>`,
      hint: R`For a fixed $i$, the variable $j$ runs through $1, 3, 5, \dots$ while $j \le i$. How many such odd numbers are there? Write out the values for $i = 1, 2, 3, 4$.`,
      answer: R`For $n = 2m$: $m(m+1)$. For any $n$: $\left\lfloor \frac{(n+1)^2}{4} \right\rfloor \in \Theta(n^2)$.`,
      solution: R`<ol class="steps">
<li>The size is $n$.</li>
<li>The basic operation is the addition $x \leftarrow x + 1$.</li>
<li>There is no data; the cases do not differ.</li>
<li>For a fixed $i$, the body of the while loop is executed for $j = 1, 3, \dots$, the odd numbers not exceeding $i$. There are $\lceil i/2 \rceil$ of them: for $i = 1,2,3,4$ these are $1,1,2,2$. Hence
$$A(n) = \sum_{i=1}^{n} \left\lceil \frac{i}{2} \right\rceil.$$</li>
<li>For $n = 2m$ the terms come in pairs $1,1,2,2,\dots,m,m$:
$$A(2m) = 2(1 + 2 + \dots + m) = m(m+1).$$
For $n = 2m-1$ the last $m$ is missing: $A = m(m+1) - m = m^2$. Both formulas agree with $\left\lfloor \frac{(n+1)^2}{4} \right\rfloor$: for $n = 2m$ it is $\lfloor m^2 + m + \tfrac14 \rfloor = m^2 + m$, for $n = 2m-1$ it is $m^2$. Overall, $A(n) \approx \frac{n^2}{4} \in \Theta(n^2)$.</li>
</ol>`
    },
    {
      id: "m1-c1", level: "C", label: "C1", title: "Average case with unequal probabilities",
      checks: [{"kind": "avg", "algo": "seq_search_weighted", "formula": "Fraction(n+2,3)", "ns": [1, 2, 3, 10, 50], "value_n10": 4}],
      text: R`<p>Sequential search (SequentialSearch from §2.1) looks for a key $K$ in an array of $n$ distinct elements. The key is known to be always in the array, but it tends to be closer to the beginning: the probability that it is in position $i$ ($i = 1, \dots, n$, numbering from one) is
$$p_i = \frac{2(n + 1 - i)}{n(n+1)}.$$
Verify that $\sum p_i = 1$, find the average number of key comparisons $C_{avg}(n)$, and compare it with the equiprobable case $\frac{n+1}{2}$ for $n = 10$.</p>`,
      hint: R`If the key is in position $i$, there are exactly $i$ comparisons. Hence $C_{avg} = \sum_{i=1}^{n} i\cdot p_i$. Expand $i(n+1-i) = (n+1)i - i^2$ and apply the formulas for $\sum i$ and $\sum i^2$.`,
      answer: R`$C_{avg}(n) = \dfrac{n+2}{3}$; for $n = 10$ this is $4$ versus $5.5$ with equal probabilities.`,
      solution: R`<ol class="steps">
<li>The size is $n$; the basic operation is the key comparison $A[i] \ne K$.</li>
<li>The number of comparisons depends on the key's position, so the average case is needed. Assumptions: the key is always present and is in position $i$ with probability $p_i$.</li>
<li>Checking the distribution: $\sum_{i=1}^{n} (n+1-i) = n + (n-1) + \dots + 1 = \frac{n(n+1)}{2}$, so $\sum p_i = \frac{2}{n(n+1)}\cdot\frac{n(n+1)}{2} = 1$.</li>
<li>The key in position $i$ means $i$ comparisons:
$$C_{avg}(n) = \sum_{i=1}^{n} i\,p_i = \frac{2}{n(n+1)}\sum_{i=1}^{n}\big((n+1)i - i^2\big).$$</li>
<li>Substituting $\sum i = \frac{n(n+1)}{2}$ and $\sum i^2 = \frac{n(n+1)(2n+1)}{6}$:
$$C_{avg}(n) = \frac{2}{n(n+1)}\left[\frac{(n+1)\,n(n+1)}{2} - \frac{n(n+1)(2n+1)}{6}\right] = (n+1) - \frac{2n+1}{3} = \frac{n+2}{3}.$$</li>
<li>Check: $n = 1$ gives $1$ (one position, one comparison). For $n = 10$: $\frac{12}{3} = 4$, whereas with equal probabilities $\frac{11}{2} = 5.5$. The class is the same, $\Theta(n)$, but the constant is smaller: $\frac13$ instead of $\frac12$.</li>
</ol>`
    },
    {
      id: "m1-c2", level: "C", label: "C2", title: "Logarithmic loop inside a linear one",
      checks: [{"kind": "algo", "algo": "c2_log_inner", "formula": "2*n-nu(n)", "ns": [1, 2, 3, 5, 8, 16, 100, 1000]}],
      text: R`<pre class="pseudo">ALGORITHM Doubling(n)
x ← 0
for i ← 1 to n do
    j ← i
    while j ≤ n do
        x ← x + 1
        j ← 2 ∗ j
return x</pre>
<p>It seems that the answer is $\Theta(n\log n)$: the outer loop is linear, the inner one logarithmic. Find the exact number of additions $A(n)$ for $n = 2^k$ and prove that in fact $A(n) \in \Theta(n)$.</p>`,
      hint: R`Change the order of counting: instead of “for each $i$, how many steps of $j$”, ask “for each $t$ (the doubling number), how many $i$ satisfy $i\cdot 2^t \le n$”.`,
      answer: R`$A(n) = \sum_{t \ge 0} \lfloor n/2^t \rfloor$; for $n = 2^k$ this is $2n - 1$; in general $n \le A(n) < 2n$, $A(n) \in \Theta(n)$. Exactly: $A(n) = 2n - \nu(n)$, where $\nu(n)$ is the number of ones in the binary representation of $n$.`,
      solution: R`<ol class="steps">
<li>The size is $n$; the basic operation is $x \leftarrow x + 1$; there is no data, the cases do not differ.</li>
<li>For a fixed $i$, the variable $j$ takes the values $i, 2i, 4i, \dots, 2^t i$ while $2^t i \le n$. Each pair $(i, t)$ with $i\cdot2^t \le n$ corresponds to one addition.</li>
<li>Count the pairs by $t$: for a fixed $t$, the suitable values are $i = 1, \dots, \lfloor n/2^t \rfloor$. Hence
$$A(n) = \sum_{t=0}^{\lfloor \log_2 n \rfloor} \left\lfloor \frac{n}{2^t} \right\rfloor.$$</li>
<li>For $n = 2^k$ there is no rounding, and by the geometric series formula
$$A(2^k) = 2^k + 2^{k-1} + \dots + 1 = 2^{k+1} - 1 = 2n - 1.$$</li>
<li>For any $n$: the first term equals $n$, so $A(n) \ge n$; and $A(n) \le n\left(1 + \tfrac12 + \tfrac14 + \dots\right) < 2n$. Therefore $A(n) \in \Theta(n)$, not $\Theta(n\log n)$: for large $i$ the inner loop is short.</li>
<li>The exact formula. Let $n = \sum_k b_k 2^k$. Then $\lfloor n/2^t \rfloor = \sum_{k \ge t} b_k 2^{k-t}$, and after summing over $t$ each bit $b_k$ contributes $2^k + 2^{k-1} + \dots + 1 = 2^{k+1} - 1$. Hence $A(n) = \sum_k b_k(2^{k+1}-1) = 2n - \nu(n)$. For example, $n = 5 = 101_2$: $5 + 2 + 1 = 8 = 10 - 2$.</li>
</ol>`
    },
    {
      id: "m1-f1", level: "F", label: "F1", title: "Find the error: sum of absolute differences",
      checks: [{"kind": "algo", "algo": "pairs_diff_additions", "formula": "n*(n-1)//2", "ns": [2, 3, 10]}, {"kind": "value", "expr": "n*(n+1)//2-1", "vars": {"n": 2}, "value": 2}],
      text: R`<pre class="pseudo">ALGORITHM PairDiff(A[0..n − 1])
s ← 0
for i ← 0 to n − 2 do
    for j ← i + 1 to n − 1 do
        s ← s + |A[i] − A[j]|
return s</pre>
<p>A student's solution:</p>
<blockquote class="def"><p>The basic operation is the addition $s \leftarrow s + \dots$; the cases do not differ. For a fixed $i$ the inner loop is executed $n - i$ times, so
$$A(n) = \sum_{i=0}^{n-2} (n - i) = n + (n-1) + \dots + 2 = \frac{n(n+1)}{2} - 1 = \frac{n^2 + n - 2}{2} \in \Theta(n^2).$$</p></blockquote>
<p>Find the error and correct the solution.</p>`,
      hint: R`Test the student's answer on the smallest input, $n = 2$. How many times is the inner loop actually executed for $i = 0$?`,
      answer: R`An off-by-one error in the number of repetitions of the inner loop: it is $n - 1 - i$, not $n - i$. The correct count is $A(n) = \frac{n(n-1)}{2}$; the student stated the class $\Theta(n^2)$ correctly.`,
      solution: R`<ol class="steps">
<li>Check for $n = 2$: the inner loop is executed once ($i = 0$, $j = 1$), i.e., $A(2) = 1$. The student's formula gives $\frac{4 + 2 - 2}{2} = 2$, so it is wrong.</li>
<li>The cause: by (S1), the number of repetitions of the loop for $j \leftarrow i+1$ to $n-1$ is $u - l + 1 = (n-1) - (i+1) + 1 = n - 1 - i$. The student wrote $n - i$, a typical off-by-one error.</li>
<li>The corrected sum:
$$A(n) = \sum_{i=0}^{n-2}(n-1-i) = (n-1) + (n-2) + \dots + 1 = \frac{(n-1)n}{2}.$$</li>
<li>The class $\Theta(n^2)$ is unaffected by the error, but the exact formula is needed, for example, for checking with a counter: for $n = 100$ the difference is $n - 1 = 99$ operations.</li>
</ol>`
    },
    {
      id: "m1-f2", level: "F", label: "F2", title: "Find the error: a fast primality test",
      checks: [{"kind": "algo", "algo": "isprime_divisions", "formula": "isqrt(n)-1", "ns": [101, 997, 7919]}],
      text: R`<pre class="pseudo">ALGORITHM IsPrime(n)
//Input: an integer n ≥ 2
for d ← 2 to ⌊√n⌋ do
    if n mod d = 0  return false
return true</pre>
<p>A student's solution:</p>
<blockquote class="def"><p>The input size is $n$. The basic operation is the division $n \bmod d$. The worst case is when $n$ is prime; then there are $\lfloor\sqrt n\rfloor - 1$ divisions, i.e., $C_{worst}(n) \in \Theta(\sqrt n)$. This is faster than linear, so the algorithm is efficient and polynomial in the input size.</p></blockquote>
<p>What is wrong with the conclusion? Rewrite the estimate in terms of the input size.</p>`,
      hint: R`How much memory does the number $n$ occupy? Express $\sqrt n$ in terms of the number of bits $b$.`,
      answer: R`A “size versus value” error. The input size is the number of bits $b = \lfloor\log_2 n\rfloor + 1$, and $\sqrt n \approx 2^{b/2}$. In the worst case $C_{worst} \in \Theta(2^{b/2})$, which is exponential in the input size.`,
      solution: R`<ol class="steps">
<li>The count of divisions is correct: for a prime $n$, all $d = 2, \dots, \lfloor\sqrt n\rfloor$ are checked, which is $\lfloor\sqrt n\rfloor - 1$ divisions. For example, for $n = 101$ there are $10 - 1 = 9$ of them.</li>
<li>The conclusion is wrong. The input is a single number, and its size, as Levitin emphasizes (§2.1, formula 2.1), is the number of bits $b = \lfloor\log_2 n\rfloor + 1$, not the value $n$.</li>
<li>Since $2^{b-1} \le n < 2^b$, we get $\sqrt n \in \Theta(2^{b/2})$ and $C_{worst}(b) \in \Theta(2^{b/2})$: the number of divisions grows exponentially in the length of the number's representation.</li>
<li>Conclusion: “$\Theta(\sqrt n)$” is a correct estimate in terms of the value, but the algorithm cannot be called polynomial. For a 100-digit decimal number ($b \approx 333$) about $10^{50}$ divisions would be needed.</li>
</ol>`
    },
    {
      id: "m1-e1", level: "E", label: "E1", title: "Triple loop with a counter",
      checks: [{"kind": "algo", "algo": "e1_triple_dependent", "formula": "n*(n+1)*(n+2)//6", "ns": [1, 2, 3, 4, 5, 10, 20, 40]}],
      text: R`<pre class="pseudo">ALGORITHM Intervals(n)
count ← 0
for i ← 1 to n do
    for j ← i to n do
        for k ← i to j do
            count ← count + 1
return count</pre>
<ol>
<li>Derive a formula for the number of additions $C(n)$.</li>
<li>Write a Python program with a counter, run it for $n = 1, 2, 3, 4, 5, 10, 20, 40, 80, 160$, and compare the values with the formula.</li>
<li>Compute the ratios $C(2n)/C(n)$ and explain what they tend to.</li>
</ol>`,
      hint: R`For fixed $i, j$, the inner loop performs $j - i + 1$ additions. Let $t = j - i + 1$: for a fixed $i$ it runs through $1, \dots, n - i + 1$.`,
      answer: R`$C(n) = \dfrac{n(n+1)(n+2)}{6} \in \Theta(n^3)$; the ratios $C(2n)/C(n) \to 8$. Code: <code>code/tasks/m1_e1_triple_loop.py</code>.`,
      solution: R`<ol class="steps">
<li>The basic operation is $\mathit{count} \leftarrow \mathit{count} + 1$; the cases do not differ.</li>
<li>$$C(n) = \sum_{i=1}^{n}\sum_{j=i}^{n}(j-i+1) = \sum_{i=1}^{n}\sum_{t=1}^{n-i+1} t = \sum_{i=1}^{n}\frac{(n-i+1)(n-i+2)}{2}.$$
Let $m = n - i + 1$ ($m$ runs through $1..n$):
$$C(n) = \frac12\sum_{m=1}^{n}(m^2 + m) = \frac12\left[\frac{n(n+1)(2n+1)}{6} + \frac{n(n+1)}{2}\right] = \frac{n(n+1)(n+2)}{6}.$$</li>
<li>The program:
<pre><code class="language-python">def intervals(n):
    count = 0
    for i in range(1, n + 1):
        for j in range(i, n + 1):
            for k in range(i, j + 1):
                count += 1          # basic operation
    return count

for n in [1, 2, 3, 4, 5, 10, 20, 40, 80, 160]:
    c = intervals(n)
    f = n * (n + 1) * (n + 2) // 6
    print(n, c, f, c == f)</code></pre></li>
<li>The counter values agree with the formula for all $n$ (for example, $C(10) = 220$, $C(160) = 695\,520$).</li>
<li>$\frac{C(2n)}{C(n)} = \frac{2n(2n+1)(2n+2)}{n(n+1)(n+2)} \to 8$; experimentally, $C(160)/C(80) \approx 7.85$. A ratio close to 8 is a sign of a cubic algorithm (§2.6).</li>
<li><img src="../assets/img/task-m1-e1.svg" alt="The Intervals counter matches n(n+1)(n+2)/6"></li>
</ol>`
    }
  ];
})();
