Section 6 pairs board coloring invariants with finite and arithmetic Ramsey theory.

Key ideas:
- Roots-of-unity cell weights $\omega^{i+j}$ prove the de Bruijn–Klarner bar tiling theorem: an $m \times n$ rectangle tiles by $1\times k$ bars iff $k \mid m$ or $k \mid n$.
- Ramsey numbers satisfy $R(s,t) \le R(s-1,t) + R(s,t-1)$ (strict when both terms are even) and $R(k,k) > 2^{k/2}$ via the probabilistic method.
- Goodman's bound guarantees at least $\binom{n}{3} - \lfloor \frac{n}{2}\lfloor(\frac{n-1}{2})^2\rfloor\rfloor$ monochromatic triangles in any 2-colored $K_n$.
- Schur's theorem follows from Ramsey on difference colorings; Erdős–Szekeres follows from $(i, d)$ pigeonhole labeling.

Before moving on, make sure you can:
- Prove $R(3, 4) = 9$ using the 4-step template (pigeonhole, recurse, parity handshake, explicit $\mathbb{Z}_8$ coloring).
- Derive Goodman's minimum monochromatic triangle count for $n = 6$.
- Verify why the Paley(17) quadratic-residue coloring proves $R(4, 4) \ge 18$.
