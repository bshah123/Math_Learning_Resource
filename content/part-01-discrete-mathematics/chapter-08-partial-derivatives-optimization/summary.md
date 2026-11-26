Section 8 turns optimization in several variables into algebraic equations, second-order curvature tests, and sensitivity formulas.

Key ideas:
- Sylvester's criterion tests positive definiteness via positive leading principal minors; positive semidefinite Hessians on convex domains guarantee global minima.
- Lagrange multipliers enforce $\nabla f = \lambda \nabla g$, with $\lambda$ giving the rate of change of the optimum with respect to the constraint level.
- The Envelope theorem states $V'(\theta) = \partial f / \partial \theta$ at $x^*(\theta)$.
- Gradient descent on an $L$-smooth quadratic converges iff $0 < \eta < 2/L$.

Before moving on, make sure you can:
- Classify critical points via $D = f_{xx}f_{yy} - f_{xy}^2$ and check domain boundaries.
- Derive the origin-to-plane distance formula $|d|/\sqrt{a^2+b^2+c^2}$ via Lagrange multipliers.
- Explain why the Lagrange multiplier $\lambda$ measures the rate of change of the optimal objective with respect to $c$.
