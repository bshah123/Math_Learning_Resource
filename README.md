# Integral Cup 2026 & Inter-IIT Math Bowl Study Platform

Standalone, local-first learning platform for the **Integral Cup 2026 Grand Prix** and **Inter-IIT Tech Fest Mathematical Competition** (with RL/ML-only sections omitted per Inter-IIT track focus), kept completely separate from the `AI-DeepDive` repository.

## Structure

- **Part 0 — Cross-Cutting Toolkit & Exam Blueprint**: Symmetry groups (Orbit-Stabilizer), probability & indicator variance, classical inequalities, matrix powers & Rayleigh quotients, growth rates, proof checklist, and exact 6-track Inter-IIT syllabus map.
- **Part I — Discrete Mathematics** (Chapters 1–8): Graph theory & Hall/Mantel/Euler, Hamiltonian cycles, bijective proofs & Prüfer codes, graph homomorphisms & tree DP, hypergraphs & Burnside/Pólya counting, coloring invariants & Ramsey theory, metric spaces, partial derivatives & Lagrange multipliers.
- **Part II — Number Theory** (Chapter 9): Prime bounds, Legendre/Kummer, Erdős's proof of Bertrand's postulate, and applications.
- **Part III — Games and Auctions** (Chapters 10–12): Nash equilibria, minimax, cyclic dominance, Shapley-Shubik/Banzhaf voting power, loopy/cycle/mean-payoff games, Richman bidding, whole-chip parity, raise ladders, sealed-bid auctions & winner's curse.
- **Part IV — Geometry** (Chapters 13–16): Euclidean toolkit, Ptolemy's theorem, 3D vectors & Platonic polyhedra, 5 three-point problems, sphere/octahedron packings & voids.
- **Part V — Cross-Topic Bridges** (Chapter 17): Pure-mathematics bridges across combinatorics, number theory, geometry, optimization, and games.
- **Part VI — Inter-IIT & Math Bowl Reference Papers** (Chapters 18–19): Complete worked solutions & Python verifications for all **18 Math Bowl 2024 Screening Test** problems and all **5 CMI Inter-IIT 2023** Olympiad problems.

## Quick Start

```bash
pnpm install
pnpm run validate-content
pnpm run dev
```

Opens at `http://localhost:3001`.
