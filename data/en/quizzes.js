/* Quizzes. The checks lines are strict JSON, read by code/verify_answers.py */
(function () {
  var R = String.raw;
  window.QUIZ = window.QUIZ || {};

  window.QUIZ.intro = [
    {
      id: "i1",
      q: R`The input of an algorithm is a single integer $n$ (for example, a primality test). Which parameter does Levitin suggest for measuring the size of such an input?`,
      options: [
        { t: R`The value of $n$ itself`, ok: false, why: R`The value grows exponentially relative to the length of the number's representation. For such problems Levitin recommends counting bits.` },
        { t: R`The number of bits $b = \lfloor \log_2 n \rfloor + 1$`, ok: true, why: R`Correct: the input size is the length of the binary representation of $n$, formula (2.1) in Levitin.` },
        { t: R`The number of divisions performed`, ok: false, why: R`That is the number of basic operations, i.e., what we are looking for, not the input size.` },
        { t: R`The number of digits in the answer`, ok: false, why: R`The answer is the algorithm's output. Size is measured on the input.` }
      ]
    },
    {
      id: "i2",
      q: R`What is a basic operation?`,
      options: [
        { t: R`The very first operation of the algorithm`, ok: false, why: R`Position in the code does not matter: the first line is usually executed only once.` },
        { t: R`The operation contributing the most to the running time, usually in the innermost loop`, ok: true, why: R`Correct: its execution count $C(n)$ determines the estimate $T(n) \approx c_{op} C(n)$.` },
        { t: R`Any assignment`, ok: false, why: R`An assignment may not be executed on every iteration, as in MaxElement, where the basic operation is the comparison.` },
        { t: R`The operation the processor executes fastest`, ok: false, why: R`On the contrary, we choose the operation that contributes the most to the total running time.` }
      ]
    },
    {
      id: "i3",
      q: R`Let $t(n) = 3n^2 + 10n\log_2 n$. Which statement is true?`,
      options: [
        { t: R`$t(n) \in O(n)$`, ok: false, why: R`The term $3n^2$ grows faster than any $c\cdot n$, so $t \notin O(n)$.` },
        { t: R`$t(n) \in \Theta(n\log n)$`, ok: false, why: R`$n\log n$ grows slower than $n^2$: the limit $t(n)/(n\log n) = \infty$.` },
        { t: R`$t(n) \in \Theta(n^2)$`, ok: true, why: R`Correct: $\lim_{n\to\infty} t(n)/n^2 = 3$, a positive constant.` },
        { t: R`$t(n) \in \Omega(n^3)$`, ok: false, why: R`$t(n)/n^3 \to 0$, so $t$ grows slower than $n^3$ and is not in $\Omega(n^3)$.` }
      ]
    },
    {
      id: "i4",
      q: R`What is the best case for sequential search in an array of $n$ elements?`,
      options: [
        { t: R`An array of one element`, ok: false, why: R`The best case is not a small input. The size $n$ is fixed; we choose the most favorable contents.` },
        { t: R`The search key is in the first position: $C_{best}(n) = 1$`, ok: true, why: R`Correct: for any $n$, a single comparison suffices.` },
        { t: R`The key is not in the array`, ok: false, why: R`Then all $n$ elements are checked; this is the worst case.` },
        { t: R`The average of the worst and best cases`, ok: false, why: R`This is the definition of neither case. The average case is not such an average either.` }
      ]
    },
    {
      id: "i5",
      q: R`An algorithm performs $C(n) \approx \tfrac16 n^3$ basic operations. Roughly how many times longer will it run if $n$ is doubled?`,
      checks: [{"kind": "ratio", "expr": "((2*n)**3/6)/(n**3/6)", "value": 8}],
      options: [
        { t: R`2 times`, ok: false, why: R`That is how a linear function grows; here it is cubic.` },
        { t: R`4 times`, ok: false, why: R`That is how the quadratic function $n^2$ grows.` },
        { t: R`8 times`, ok: true, why: R`Correct: $\frac{(2n)^3/6}{n^3/6} = 8$; the constant $\tfrac16$ cancels.` },
        { t: R`6 times`, ok: false, why: R`The constant $\tfrac16$ cancels in the ratio and does not affect the answer.` }
      ]
    }
  ];

  window.QUIZ.m1 = [
    {
      id: "m1q1",
      q: R`In MaxElement, the loop body contains the comparison $A[i] > \mathit{maxval}$ and the assignment $\mathit{maxval} \leftarrow A[i]$. Which one is the basic operation?`,
      options: [
        { t: R`The comparison $A[i] > \mathit{maxval}$`, ok: true, why: R`Correct: it is executed on every iteration, exactly $n-1$ times for any input.` },
        { t: R`The assignment $\mathit{maxval} \leftarrow A[i]$`, ok: false, why: R`The assignment is not always executed: from 0 to $n-1$ times depending on the input.` },
        { t: R`Incrementing $i$`, ok: false, why: R`This is loop-control overhead; it is not considered the basic operation.` },
        { t: R`Returning the result`, ok: false, why: R`It is executed once and does not affect the growth of the running time.` }
      ]
    },
    {
      id: "m1q2",
      q: R`What is the sum $\displaystyle\sum_{i=3}^{n+2} 1$?`,
      checks: [{"kind": "sum", "algo": "sum_ones", "args": ["3", "n+2"], "formula": "n", "ns": [1, 2, 5, 10]}],
      options: [
        { t: R`$n+2$`, ok: false, why: R`That is the upper limit, but we need the number of terms $u-l+1$.` },
        { t: R`$n$`, ok: true, why: R`Correct: $u - l + 1 = (n+2) - 3 + 1 = n$.` },
        { t: R`$n-1$`, ok: false, why: R`The 1 in the formula $u - l + 1$ is forgotten: a typical off-by-one error.` },
        { t: R`$n+3$`, ok: false, why: R`The lower limit must be subtracted, not added.` }
      ]
    },
    {
      id: "m1q3",
      q: R`What is the sum $\displaystyle\sum_{i=0}^{n-1} i$?`,
      checks: [{"kind": "sum", "algo": "sum_i", "args": ["0", "n-1"], "formula": "n*(n-1)//2", "ns": [1, 2, 7, 100]}],
      options: [
        { t: R`$\frac{n(n+1)}{2}$`, ok: false, why: R`That is the sum up to and including $n$, but here the upper limit is $n-1$.` },
        { t: R`$\frac{n(n-1)}{2}$`, ok: true, why: R`Correct: formula (S2) with upper limit $n-1$ gives $\frac{(n-1)n}{2}$.` },
        { t: R`$\frac{(n-1)^2}{2}$`, ok: false, why: R`For $n = 3$ the sum is $0+1+2 = 3$, but the formula gives $2$.` },
        { t: R`$\frac{n^2}{2}$`, ok: false, why: R`This is only an approximation for large $n$, not the exact value.` }
      ]
    },
    {
      id: "m1q4",
      q: R`What is the order of growth of the sum $\displaystyle\sum_{i=1}^{n} i^3$?`,
      options: [
        { t: R`$\Theta(n^3)$`, ok: false, why: R`Half of the terms are at least $(n/2)^3$, so the sum is $\ge \frac n2\cdot\frac{n^3}{8} = \frac{n^4}{16}$, which grows faster than $n^3$.` },
        { t: R`$\Theta(n^4)$`, ok: true, why: R`Correct: $\sum_{i=1}^{n} i^k \approx \frac{n^{k+1}}{k+1}$; for $k=3$ this is $\frac{n^4}{4} \in \Theta(n^4)$.` },
        { t: R`$\Theta(n^3\log n)$`, ok: false, why: R`No logarithm arises here: a sum of powers gives a power one higher.` },
        { t: R`$\Theta(2^n)$`, ok: false, why: R`A sum of polynomial terms remains a polynomial.` }
      ]
    },
    {
      id: "m1q5",
      q: R`What is the order of the number of times the loop body is executed: $i \leftarrow n$; while $i > 1$ do $i \leftarrow \lfloor i/3 \rfloor$?`,
      options: [
        { t: R`$\Theta(n)$`, ok: false, why: R`That would be the case for $i \leftarrow i - 1$. Here $i$ is divided by 3.` },
        { t: R`$\Theta(n/3)$`, ok: false, why: R`This is the same class $\Theta(n)$, and it is wrong: $i$ is divided by 3, not decreased by 3.` },
        { t: R`$\Theta(\log n)$`, ok: true, why: R`Correct: after $k$ steps $i \approx n/3^k$; the loop ends when $k \approx \log_3 n$.` },
        { t: R`$\Theta(\sqrt n)$`, ok: false, why: R`A square root would arise from a condition like $i \cdot i \le n$ with the step $i \leftarrow i + 1$.` }
      ]
    },
    {
      id: "m1q6",
      q: R`How many multiplications $M(n)$ does the definition-based algorithm for multiplying two $n \times n$ matrices perform?`,
      checks: [{"kind": "algo", "algo": "matrix_mult", "formula": "n**3", "ns": [1, 2, 3, 5]}],
      options: [
        { t: R`$n^2$`, ok: false, why: R`That is the number of elements in the product matrix, but each one takes $n$ multiplications.` },
        { t: R`$n^3$`, ok: true, why: R`Correct: $n^2$ elements with $n$ multiplications each, $M(n)=\sum\sum\sum 1 = n^3$.` },
        { t: R`$2n^3$`, ok: false, why: R`That counts multiplications and additions together; the question is about multiplications only.` },
        { t: R`$n^2(n-1)$`, ok: false, why: R`That would be the count of additions if $C[i,j]$ were initialized with the first product; the question is about multiplications.` }
      ]
    },
    {
      id: "m1q7",
      q: R`Which input is the best case for UniqueElements with an array of size $n \ge 2$?`,
      checks: [{"kind": "algo", "algo": "unique_best", "formula": "1", "ns": [2, 3, 10]}],
      options: [
        { t: R`$A[0] = A[1]$, then $C_{best}(n) = 1$`, ok: true, why: R`Correct: the very first comparison finds an equal pair, and the algorithm terminates.` },
        { t: R`All elements are distinct`, ok: false, why: R`This is the worst case: all $\frac{n(n-1)}{2}$ pairs are checked.` },
        { t: R`The array is sorted`, ok: false, why: R`Order without equal elements does not help: all pairs are still compared.` },
        { t: R`An array of two elements`, ok: false, why: R`The best case is not a small input; we look for a favorable input of the given size $n$.` }
      ]
    },
    {
      id: "m1q8",
      q: R`Sequential search, $n = 9$, probability of a successful search $p = \tfrac12$. What is the average number of comparisons $C_{avg}$?`,
      checks: [{"kind": "value", "expr": "p*(n+1)/2 + n*(1-p)", "vars": {"n": 9, "p": 0.5}, "value": 7}],
      options: [
        { t: R`$4.5$`, ok: false, why: R`This is $n/2$, which is wrong: the formula also accounts for unsuccessful search.` },
        { t: R`$5$`, ok: false, why: R`This is $(n+1)/2$, the answer only for $p = 1$.` },
        { t: R`$7$`, ok: true, why: R`Correct: $\frac{p(n+1)}{2} + n(1-p) = \frac{0.5\cdot10}{2} + 9\cdot0.5 = 2.5 + 4.5 = 7$.` },
        { t: R`$9$`, ok: false, why: R`This is the answer for $p = 0$, when the key is certainly absent.` }
      ]
    },
    {
      id: "m1q9",
      q: R`The loop for $i \leftarrow 1$ to $n$ is executed $n$ times. What does this count look like as a function of the number of bits $b$ in the representation of $n$?`,
      options: [
        { t: R`$\Theta(b)$`, ok: false, why: R`It would be linear in $b$ if the loop ran over the bits.` },
        { t: R`$\Theta(2^b)$`, ok: true, why: R`Correct: $n \ge 2^{b-1}$, so $n \in \Theta(2^b)$. “Linear in the value” means exponential in the size.` },
        { t: R`$\Theta(b^2)$`, ok: false, why: R`No square arises here: $n$ is related to $b$ exponentially.` },
        { t: R`$\Theta(\log b)$`, ok: false, why: R`On the contrary, $b \approx \log_2 n$, so $n$ grows exponentially in $b$.` }
      ]
    },
    {
      id: "m1q10",
      q: R`How many times is the comparison $n > 1$ executed in the algorithm Binary for $n = 100$?`,
      checks: [{"kind": "algo", "algo": "binary_comparisons", "formula": "floor_log2(n)+1", "ns": [100], "value": 7}],
      options: [
        { t: R`$6$`, ok: false, why: R`That is how many times the loop body is executed. There is one more comparison: the last one yields “false”.` },
        { t: R`$7$`, ok: true, why: R`Correct: $\lfloor \log_2 100 \rfloor + 1 = 6 + 1 = 7$, the number of bits in 1100100.` },
        { t: R`$8$`, ok: false, why: R`Off-by-one error: $2^7 = 128 > 100$, so there are 7 bits.` },
        { t: R`$50$`, ok: false, why: R`$n$ is halved at each step, not decreased by 2.` }
      ]
    }
  ];

  window.QUIZ.m2 = [
    {
      id: "m2q1",
      q: R`Recursive factorial: if $n = 0$ return 1 else return $F(n-1) \cdot n$. What is the initial condition for the number of multiplications $M(n)$?`,
      options: [
        { t: R`$M(0) = 1$`, ok: false, why: R`This confuses it with the value $F(0) = 0! = 1$. For $n = 0$ there are no multiplications.` },
        { t: R`$M(0) = 0$`, ok: true, why: R`Correct: for $n = 0$ the algorithm immediately returns 1 without performing any multiplication.` },
        { t: R`$M(1) = 1$`, ok: false, why: R`The recursion stops at $n = 0$, not at 1; besides, $M(1) = M(0) + 1 = 1$ is a consequence, not a condition.` },
        { t: R`No initial condition is needed`, ok: false, why: R`Without it, $M(n) = M(n-1) + 1$ has infinitely many solutions of the form $n + c$.` }
      ]
    },
    {
      id: "m2q2",
      q: R`Which recurrence describes the number of moves $M(n)$ in the Tower of Hanoi puzzle?`,
      options: [
        { t: R`$M(n) = 2M(n-1) + 1$, $M(1) = 1$`, ok: true, why: R`Correct: move $n-1$ disks, move the largest disk, then move the $n-1$ disks again.` },
        { t: R`$M(n) = M(n-1) + 1$`, ok: false, why: R`This counts only one transfer of the tower of $n-1$ disks, but there are two.` },
        { t: R`$M(n) = 2M(n/2) + 1$`, ok: false, why: R`The problem is not split in half: the subproblems have size $n-1$.` },
        { t: R`$M(n) = M(n-1) + 2$`, ok: false, why: R`That would give linear growth, whereas the number of moves doubles.` }
      ]
    },
    {
      id: "m2q3",
      q: R`How many moves are needed to transfer a tower of 10 disks?`,
      checks: [{"kind": "algo", "algo": "hanoi_moves", "formula": "2**n-1", "ns": [10], "value": 1023}],
      options: [
        { t: R`$1024$`, ok: false, why: R`This is $2^{10}$: the “−1” from the sum $1 + 2 + \dots + 2^{n-1} = 2^n - 1$ is lost.` },
        { t: R`$1023$`, ok: true, why: R`Correct: $M(10) = 2^{10} - 1 = 1023$.` },
        { t: R`$512$`, ok: false, why: R`This is $2^9$, exactly the number of moves made by the smallest disk alone.` },
        { t: R`$2047$`, ok: false, why: R`This is $2^{11} - 1$, the answer for 11 disks.` }
      ]
    },
    {
      id: "m2q4",
      q: R`How many additions does BinRec$(37)$ perform?`,
      checks: [{"kind": "algo", "algo": "binrec_additions", "formula": "floor_log2(n)", "ns": [37], "value": 5}],
      options: [
        { t: R`$5$`, ok: true, why: R`Correct: $A(n) = \lfloor \log_2 n \rfloor$, and $\lfloor \log_2 37 \rfloor = 5$: the chain $37 \to 18 \to 9 \to 4 \to 2 \to 1$.` },
        { t: R`$6$`, ok: false, why: R`This is the number of bits of 37 (the result of BinRec), not the number of additions.` },
        { t: R`$18$`, ok: false, why: R`The argument is halved, not decreased by 1.` },
        { t: R`$\log_2 37 \approx 5.2$`, ok: false, why: R`The number of additions is an integer; the exact formula is $\lfloor \log_2 n \rfloor$.` }
      ]
    },
    {
      id: "m2q5",
      q: R`Why is the BinRec recurrence $A(n) = A(\lfloor n/2 \rfloor) + 1$ first solved for $n = 2^k$?`,
      options: [
        { t: R`The algorithm works only for powers of two`, ok: false, why: R`BinRec is correct for any positive $n$.` },
        { t: R`For $n = 2^k$ the rounding disappears, backward substitutions go through cleanly, and the smoothness rule extends the order of growth to all $n$`, ok: true, why: R`Correct: $\lfloor 2^k/2 \rfloor = 2^{k-1}$. $A(n)$ is nondecreasing and $\log n$ is smooth, hence $A(n) \in \Theta(\log n)$ for all $n$.` },
        { t: R`For other $n$ the recursion does not terminate`, ok: false, why: R`It terminates for any $n \ge 1$: the argument decreases down to 1.` },
        { t: R`It immediately yields an exact formula for all $n$`, ok: false, why: R`For powers of two we get $\log_2 n$, but the exact formula $\lfloor \log_2 n \rfloor$ must be proved separately.` }
      ]
    },
    {
      id: "m2q6",
      q: R`What is the efficiency class of the naive recursive Fibonacci algorithm (number of additions $A(n)$)?`,
      options: [
        { t: R`$\Theta(n)$`, ok: false, why: R`That is the number of additions in the iterative algorithm, not the naive recursion.` },
        { t: R`$\Theta(n^2)$`, ok: false, why: R`The growth is exponential: $A(n) = F(n+1) - 1$.` },
        { t: R`$\Theta(\varphi^n)$, $\varphi \approx 1.618$`, ok: true, why: R`Correct: $A(n) = F(n+1) - 1$, and $F(n) \in \Theta(\varphi^n)$.` },
        { t: R`$\Theta(2^n)$`, ok: false, why: R`$2^n$ is an upper bound $O(2^n)$, but not a tight one: $\varphi^n / 2^n \to 0$.` }
      ]
    },
    {
      id: "m2q7",
      q: R`What is the maximum depth of the call stack for the recursive solution of the Tower of Hanoi with $n$ disks?`,
      checks: [{"kind": "algo", "algo": "hanoi_depth", "formula": "n", "ns": [1, 3, 8]}],
      options: [
        { t: R`$2^n - 1$`, ok: false, why: R`That is the total number of calls, but they are not on the stack simultaneously.` },
        { t: R`$n$`, ok: true, why: R`Correct: each call decreases $n$ by 1; the chain $n, n-1, \dots, 1$ has at most $n$ entries.` },
        { t: R`$\log_2 n$`, ok: false, why: R`The size decreases by 1, not by half.` },
        { t: R`$1$`, ok: false, why: R`Recursive calls are nested inside one another, so the stack grows.` }
      ]
    },
    {
      id: "m2q8",
      q: R`Which line contains a tail-recursive call?`,
      options: [
        { t: R`return Sum$(A[0..n-2]) + A[n-1]$`, ok: false, why: R`An addition is still performed after the call returns; the call is not the last action.` },
        { t: R`return $n \cdot F(n-1)$`, ok: false, why: R`After the call, the result must be multiplied by $n$.` },
        { t: R`return SumAcc$(A, i+1, \mathit{acc} + A[i])$`, ok: true, why: R`Correct: the result of the call is returned immediately; everything needed is passed in the accumulator.` },
        { t: R`return $F(n-1) + F(n-2)$`, ok: false, why: R`Two calls followed by an addition; neither of them is a tail call.` }
      ]
    },
    {
      id: "m2q9",
      q: R`How many additions does Fibonacci with memoization (memory function) perform when computing $F(n)$, $n \ge 1$?`,
      checks: [{"kind": "algo", "algo": "memo_fib_additions", "formula": "n-1", "ns": [1, 2, 5, 20]}],
      options: [
        { t: R`$F(n+1) - 1$`, ok: false, why: R`That is the naive recursion without a table.` },
        { t: R`$n - 1$`, ok: true, why: R`Correct: each $F(k)$ with $2 \le k \le n$ is computed once and costs one addition.` },
        { t: R`$2n - 1$`, ok: false, why: R`That is the number of calls (including lookups of already computed values), not additions.` },
        { t: R`$n^2$`, ok: false, why: R`The table eliminates repetitions; the work is linear.` }
      ]
    },
    {
      id: "m2q10",
      q: R`Solve: $C(n) = C(n-1) + n$ for $n > 0$, $C(0) = 0$. What is the efficiency class?`,
      checks: [{"kind": "recurrence", "rec": "c_prev_plus_n", "formula": "n*(n+1)//2", "ns": [0, 1, 5, 30]}],
      options: [
        { t: R`$\Theta(n)$`, ok: false, why: R`Each step adds not 1 but $n$; the terms grow.` },
        { t: R`$\Theta(n\log n)$`, ok: false, why: R`That would be the result for $C(n) = 2C(n/2) + n$.` },
        { t: R`$\Theta(n^2)$`, ok: true, why: R`Correct: backward substitutions give $C(n) = 1 + 2 + \dots + n = \frac{n(n+1)}{2}$.` },
        { t: R`$\Theta(2^n)$`, ok: false, why: R`An exponential appears with two calls, e.g., $2C(n-1)$.` }
      ]
    }
  ];
})();
