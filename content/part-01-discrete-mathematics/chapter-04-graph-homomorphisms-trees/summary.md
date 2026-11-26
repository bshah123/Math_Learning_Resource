Section 4 unifies coloring, walk counting, and symmetry under edge-preserving graph homomorphisms.

Key ideas:
- $G \to K_k$ iff $\chi(G) \le k$; $C_{2k+1} \to C_{2m+1}$ iff $k \ge m$.
- Every tree on $n$ vertices maps to a $d$-regular $N$-vertex graph in $N d^{n-1}$ ways; general target graphs yield to bottom-up tree DP.
- Tree automorphisms preserve the Jordan center and multiply $m! \cdot |\operatorname{Aut}(S)|^m$ across isomorphic child-subtree classes.

Before moving on, make sure you can:
- Prove why $C_5 \to C_7$ is impossible using odd closed walks.
- Run the bottom-up DP recurrence $N_x(v)$ by hand into $P_3$.
- Compute $|\operatorname{Aut}(T)|$ for a spider or double star.
