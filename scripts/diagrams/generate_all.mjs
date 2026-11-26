import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Sketch, C } from './sketch.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const save = (relPath, s) => {
  const full = join(ROOT, relPath);
  mkdirSync(dirname(full), { recursive: true });
  writeFileSync(full, s.toString());
};

// 1. 0.1 Orbit-Stabilizer Coset Partition
{
  const s = new Sketch(880, 320, { title: 'Orbit-Stabilizer Theorem: Cosets of G_x', seed: 101 });
  s.text(440, 34, 'Orbit-Stabilizer: |G| = |Gx| * |G_x|', { size: 26, weight: 700 });
  s.rect(40, 68, 360, 210, { color: C.blue, fill: C.blueSoft, fillStyle: 'solid' });
  s.text(220, 94, 'Group G (partitioned into left cosets)', { size: 18, weight: 700, color: C.blue });
  const cosets = ['G_x (fixes x)', 'g1 G_x (x -> y1)', 'g2 G_x (x -> y2)', 'g3 G_x (x -> y3)'];
  cosets.forEach((lbl, idx) => {
    const y = 112 + idx * 38;
    s.rect(60, y, 320, 30, { color: idx === 0 ? C.green : C.muted, fill: idx === 0 ? C.greenSoft : undefined, fillStyle: 'solid' });
    s.text(220, y + 21, lbl, { font: 'mono', size: 15 });
  });

  s.rect(520, 68, 320, 210, { color: C.amber, fill: C.amberSoft, fillStyle: 'solid' });
  s.text(680, 94, 'Orbit Gx inside X', { size: 18, weight: 700, color: C.amber });
  const targets = ['x', 'y1', 'y2', 'y3'];
  targets.forEach((t, idx) => {
    const cy = 127 + idx * 38;
    s.circle(680, cy, 28, { color: C.ink, fill: C.greenSoft, fillStyle: 'solid' });
    s.text(680, cy + 6, t, { font: 'mono', size: 16, weight: 700 });
    s.arrow(390, cy, 650, cy, { color: C.blue });
  });
  save('content/part-00-toolkit-and-reference/chapter-00-toolkit-reference/diagrams/0.1-orbit-stabilizer.svg', s);
}

// 2. 1.1 Bipartite parity vs Tree Jordan center
{
  const s = new Sketch(880, 320, { title: 'Bipartite Distance Parity and Tree Jordan Center', seed: 102 });
  s.text(220, 34, 'Kőnig Bipartite Parity (d(r,v) mod 2)', { size: 22, weight: 700 });
  s.rect(30, 58, 380, 235, { color: C.muted, dash: '6 6' });
  s.circle(130, 120, 34, { color: C.blue, fill: C.blueSoft, fillStyle: 'solid' });
  s.text(130, 126, 'r (0)', { font: 'mono', size: 15 });
  s.circle(300, 110, 34, { color: C.amber, fill: C.amberSoft, fillStyle: 'solid' });
  s.text(300, 116, 'u (1)', { font: 'mono', size: 15 });
  s.circle(130, 230, 34, { color: C.blue, fill: C.blueSoft, fillStyle: 'solid' });
  s.text(130, 236, 'w (0)', { font: 'mono', size: 15 });
  s.circle(300, 230, 34, { color: C.amber, fill: C.amberSoft, fillStyle: 'solid' });
  s.text(300, 236, 'v (1)', { font: 'mono', size: 15 });
  s.line(148, 118, 282, 112, { color: C.ink });
  s.line(284, 124, 146, 218, { color: C.ink });
  s.line(148, 230, 282, 230, { color: C.ink });
  s.line(300, 128, 300, 212, { color: C.rose, dash: '5 5', width: 2.2 });
  s.text(355, 174, 'odd cycle!', { size: 18, color: C.rose, weight: 700 });

  s.text(660, 34, 'Jordan Center by Leaf Peeling', { size: 22, weight: 700 });
  s.rect(470, 58, 380, 235, { color: C.muted, dash: '6 6' });
  s.line(540, 120, 620, 170, { color: C.muted, dash: '4 4' });
  s.line(540, 220, 620, 170, { color: C.muted, dash: '4 4' });
  s.line(620, 170, 700, 170, { color: C.green, width: 3 });
  s.line(700, 170, 780, 120, { color: C.muted, dash: '4 4' });
  s.line(700, 170, 780, 220, { color: C.muted, dash: '4 4' });
  s.circle(540, 120, 24, { color: C.muted });
  s.circle(540, 220, 24, { color: C.muted });
  s.circle(780, 120, 24, { color: C.muted });
  s.circle(780, 220, 24, { color: C.muted });
  s.circle(620, 170, 32, { color: C.green, fill: C.greenSoft, fillStyle: 'solid' });
  s.circle(700, 170, 32, { color: C.green, fill: C.greenSoft, fillStyle: 'solid' });
  s.text(660, 215, 'Fixed edge center', { size: 17, color: C.green, weight: 700 });
  s.note(570, 245, 180, 38, ['Leaves peeled first'], { size: 16 });
  save('content/part-01-discrete-mathematics/chapter-01-graph-theory-foundations/diagrams/1.1-graphs-trees.svg', s);
}

// 3. 1.2 Planar Obstructions K5 and K3,3
{
  const s = new Sketch(880, 320, { title: 'Non-Planar Graphs K5 and K3,3', seed: 103 });
  s.text(220, 32, 'K5: V=5, E=10 > 3V-6 = 9', { size: 22, weight: 700, color: C.rose });
  const k5 = [];
  for (let i = 0; i < 5; i++) {
    const ang = -Math.PI / 2 + (2 * Math.PI * i) / 5;
    k5.push([220 + 95 * Math.cos(ang), 180 + 95 * Math.sin(ang)]);
  }
  for (let i = 0; i < 5; i++) {
    for (let j = i + 1; j < 5; j++) s.line(k5[i][0], k5[i][1], k5[j][0], k5[j][1], { color: C.blue });
  }
  k5.forEach(([x, y]) => s.circle(x, y, 22, { color: C.ink, fill: C.blueSoft, fillStyle: 'solid' }));

  s.text(660, 32, 'K3,3: V=6, E=9 > 2V-4 = 8', { size: 22, weight: 700, color: C.rose });
  const top = [540, 660, 780].map(x => [x, 105]);
  const bot = [540, 660, 780].map(x => [x, 245]);
  top.forEach(([tx, ty]) => bot.forEach(([bx, by]) => s.line(tx, ty, bx, by, { color: C.amber })));
  top.forEach(([x, y]) => s.circle(x, y, 22, { color: C.ink, fill: C.amberSoft, fillStyle: 'solid' }));
  bot.forEach(([x, y]) => s.circle(x, y, 22, { color: C.ink, fill: C.greenSoft, fillStyle: 'solid' }));
  save('content/part-01-discrete-mathematics/chapter-01-graph-theory-foundations/diagrams/1.2-planar-obstructions.svg', s);
}

// 4. 3.1 Catalan Reflection Principle
{
  const s = new Sketch(880, 340, { title: 'Catalan Reflection Principle Across y = x + 1', seed: 104 });
  s.text(440, 32, 'Reflection Principle: Bad Paths Biject to (n-1, n+1)', { size: 24, weight: 700 });
  const ox = 250, oy = 290, step = 46;
  for (let i = 0; i <= 4; i++) {
    s.line(ox, oy - i * step, ox + 4 * step, oy - i * step, { color: C.muted, width: 0.7 });
    s.line(ox + i * step, oy, ox + i * step, oy - 5 * step, { color: C.muted, width: 0.7 });
  }
  s.line(ox, oy, ox + 4 * step, oy - 4 * step, { color: C.green, width: 2 });
  s.line(ox, oy - step, ox + 4 * step, oy - 5 * step, { color: C.rose, dash: '6 5', width: 2.2 });
  s.text(ox + 4 * step + 18, oy - 5 * step + 6, 'y = x + 1', { anchor: 'start', size: 17, color: C.rose, font: 'mono' });
  s.text(ox + 4 * step + 18, oy - 4 * step + 6, '(n, n)', { anchor: 'start', size: 17, color: C.green, font: 'mono' });
  s.text(ox + 3 * step, oy - 5 * step - 14, '(n-1, n+1)', { size: 16, color: C.violet, font: 'mono' });

  const pre = [[0,0],[1,0],[1,1],[1,2]];
  for (let i = 0; i < pre.length - 1; i++) {
    s.line(ox + pre[i][0]*step, oy - pre[i][1]*step, ox + pre[i+1][0]*step, oy - pre[i+1][1]*step, { color: C.blue, width: 3 });
  }
  const suf = [[1,2],[2,2],[3,2],[3,3],[4,3],[4,4]];
  for (let i = 0; i < suf.length - 1; i++) {
    s.line(ox + suf[i][0]*step, oy - suf[i][1]*step, ox + suf[i+1][0]*step, oy - suf[i+1][1]*step, { color: C.amber, width: 3 });
  }
  const ref = [[1,2],[1,3],[1,4],[2,4],[2,5],[3,5]];
  for (let i = 0; i < ref.length - 1; i++) {
    s.line(ox + ref[i][0]*step, oy - ref[i][1]*step, ox + ref[i+1][0]*step, oy - ref[i+1][1]*step, { color: C.violet, dash: '5 4', width: 3 });
  }
  s.circle(ox + 1 * step, oy - 2 * step, 14, { color: C.rose, fill: C.roseSoft, fillStyle: 'solid' });
  s.note(530, 120, 310, 120, ['First touch at (1, 2)', 'Swap E <-> N after first touch', 'Bad suffix (amber) reflects', 'bijectively to (n-1, n+1)!'], { size: 18 });
  save('content/part-01-discrete-mathematics/chapter-03-bijective-proofs-double-counting/diagrams/3.1-catalan-reflection.svg', s);
}

// 5. 5.1 Fano Plane
{
  const s = new Sketch(880, 330, { title: 'The Fano Plane PG(2, 2): 7 Points and 7 Lines', seed: 105 });
  s.text(440, 30, 'Fano Plane: 7 Points, 7 Three-Point Lines, |Aut| = 168', { size: 24, weight: 700 });
  const cx = 310, cy = 205, R = 125;
  const A = [cx, cy - R];
  const B = [cx - R * Math.sqrt(3) / 2, cy + R / 2];
  const Cpt = [cx + R * Math.sqrt(3) / 2, cy + R / 2];
  const Mab = [(A[0] + B[0]) / 2, (A[1] + B[1]) / 2];
  const Mbc = [(B[0] + Cpt[0]) / 2, (B[1] + Cpt[1]) / 2];
  const Mca = [(Cpt[0] + A[0]) / 2, (Cpt[1] + A[1]) / 2];
  const O = [cx, cy];

  s.line(A[0], A[1], B[0], B[1], { color: C.blue, width: 2 });
  s.line(B[0], B[1], Cpt[0], Cpt[1], { color: C.blue, width: 2 });
  s.line(Cpt[0], Cpt[1], A[0], A[1], { color: C.blue, width: 2 });
  s.line(A[0], A[1], Mbc[0], Mbc[1], { color: C.green, width: 2 });
  s.line(B[0], B[1], Mca[0], Mca[1], { color: C.green, width: 2 });
  s.line(Cpt[0], Cpt[1], Mab[0], Mab[1], { color: C.green, width: 2 });
  s.circle(O[0], O[1], R, { color: C.amber, width: 2.2 });

  [A, B, Cpt, Mab, Mbc, Mca, O].forEach(([x, y], i) => {
    s.circle(x, y, 22, { color: C.ink, fill: C.blueSoft, fillStyle: 'solid' });
    s.text(x, y + 6, String(i + 1), { font: 'mono', size: 15, weight: 700 });
  });
  s.note(520, 95, 320, 140, ['Every 2 points lie on 1 line', 'Every 2 lines meet in 1 point', 'Choose images of 3 non-collinear', 'points: 7 x 6 x 4 = 168'], { size: 19 });
  save('content/part-01-discrete-mathematics/chapter-05-hypergraphs-automorphisms-symmetry/diagrams/5.1-fano-plane.svg', s);
}

// 6. 6.1 Moser Spindle
{
  const s = new Sketch(880, 320, { title: 'The 7-Vertex Moser Spindle (Unit-Distance Graph)', seed: 106 });
  s.text(440, 30, 'Moser Spindle: 7 Points, 11 Unit-Distance Edges (No 3-Coloring)', { size: 22, weight: 700 });
  const pts = {
    T: [310, 70],
    A1: [235, 130], A2: [285, 155], B1: [215, 220],
    C1: [385, 130], C2: [335, 155], D1: [405, 220]
  };
  const edges = [
    ['T', 'A1'], ['T', 'A2'], ['A1', 'A2'], ['A1', 'B1'], ['A2', 'B1'],
    ['T', 'C1'], ['T', 'C2'], ['C1', 'C2'], ['C1', 'D1'], ['C2', 'D1'],
    ['B1', 'D1']
  ];
  edges.forEach(([u, v]) => s.line(pts[u][0], pts[u][1], pts[v][0], pts[v][1], { color: u === 'B1' && v === 'D1' ? C.rose : C.ink, width: 2 }));
  const colors = { T: C.blueSoft, A1: C.amberSoft, A2: C.greenSoft, B1: C.blueSoft, C1: C.amberSoft, C2: C.greenSoft, D1: C.blueSoft };
  Object.entries(pts).forEach(([k, [x, y]]) => {
    s.circle(x, y, 26, { color: k === 'B1' || k === 'D1' ? C.rose : C.ink, fill: colors[k], fillStyle: 'solid' });
    s.text(x, y + 5, k === 'T' ? '1' : (k === 'B1' || k === 'D1') ? '1!' : '2/3', { font: 'mono', size: 13, weight: 700 });
  });
  s.note(510, 95, 330, 135, ['If 3 colors suffice:', 'Top vertex = Color 1', 'Both diamond bases forced', 'to Color 1 -> clash on bottom edge!'], { size: 18 });
  save('content/part-01-discrete-mathematics/chapter-06-coloring-arguments-ramsey-theory/diagrams/6.1-moser-spindle.svg', s);
}

// 7. 13.1 Ptolemy Theorem
{
  const s = new Sketch(880, 330, { title: 'Ptolemy Theorem Cyclic Quadrilateral', seed: 107 });
  s.text(440, 30, 'Ptolemy: AC * BD = AB * CD + AD * BC (Cyclic Order)', { size: 23, weight: 700 });
  const cx = 270, cy = 185, R = 115;
  s.circle(cx, cy, 2 * R, { color: C.muted, width: 1.5 });
  const angs = [-2.2, -0.7, 0.7, 2.3];
  const labels = ['A', 'B', 'C', 'D'];
  const P = angs.map(a => [cx + R * Math.cos(a), cy + R * Math.sin(a)]);
  for (let i = 0; i < 4; i++) {
    s.line(P[i][0], P[i][1], P[(i + 1) % 4][0], P[(i + 1) % 4][1], { color: C.blue, width: 2.2 });
  }
  s.line(P[0][0], P[0][1], P[2][0], P[2][1], { color: C.rose, width: 2.2 });
  s.line(P[1][0], P[1][1], P[3][0], P[3][1], { color: C.green, width: 2.2 });
  P.forEach(([x, y], i) => {
    s.circle(x, y, 22, { color: C.ink, fill: C.amberSoft, fillStyle: 'solid' });
    s.text(x, y + 5, labels[i], { font: 'mono', size: 15, weight: 700 });
  });
  s.note(470, 95, 370, 145, ['Complex identity:', '(a-c)(b-d) = (a-b)(c-d) + (a-d)(b-c)', 'Triangle inequality gives <=', 'Equality iff cyclic in order A,B,C,D'], { size: 18 });
  save('content/part-04-geometry/chapter-13-euclidean-toolkit-ptolemy/diagrams/13.1-ptolemy.svg', s);
}

// 8. 15.1 Fermat Point Rotation
{
  const s = new Sketch(880, 330, { title: 'Fermat Point 60-Degree Rotation Proof', seed: 108 });
  s.text(440, 30, 'Fermat Point: Rotate Triangle APB by 60 deg Around B', { size: 23, weight: 700 });
  const B = [240, 250], A = [150, 120], Cpt = [430, 230], F = [255, 195];
  const Ap = [105, 255], Fp = [210, 200];
  s.line(A[0], A[1], B[0], B[1], { color: C.ink, width: 2 });
  s.line(B[0], B[1], Cpt[0], Cpt[1], { color: C.ink, width: 2 });
  s.line(Cpt[0], Cpt[1], A[0], A[1], { color: C.ink, width: 2 });
  s.line(A[0], A[1], F[0], F[1], { color: C.blue, width: 2 });
  s.line(B[0], B[1], F[0], F[1], { color: C.blue, width: 2 });
  s.line(Cpt[0], Cpt[1], F[0], F[1], { color: C.blue, width: 2 });

  s.line(Ap[0], Ap[1], B[0], B[1], { color: C.amber, dash: '5 4', width: 2 });
  s.line(Ap[0], Ap[1], Fp[0], Fp[1], { color: C.amber, dash: '5 4', width: 2 });
  s.line(Fp[0], Fp[1], F[0], F[1], { color: C.green, width: 2.5 });
  s.line(B[0], B[1], Fp[0], Fp[1], { color: C.amber, dash: '5 4', width: 2 });

  [[A, 'A'], [B, 'B'], [Cpt, 'C'], [F, 'P'], [Ap, "A'"], [Fp, "P'"]].forEach(([[x, y], lbl]) => {
    s.circle(x, y, 20, { color: C.ink, fill: lbl === 'P' ? C.greenSoft : C.blueSoft, fillStyle: 'solid' });
    s.text(x, y + 5, lbl, { font: 'mono', size: 13, weight: 700 });
  });
  s.note(490, 95, 350, 145, ['Triangle PBP\' is equilateral => PB = PP\'', 'PA + PB + PC = A\'P\' + P\'P + PC >= A\'C', 'Minimum when A\', P\', P, C collinear', 'Watch out: >= 120 deg uses obtuse vertex!'], { size: 18 });
  save('content/part-04-geometry/chapter-15-three-point-problems/diagrams/15.1-fermat-point.svg', s);
}

// 9. 16.1 Cubic Packings SC, BCC, FCC
{
  const s = new Sketch(880, 310, { title: 'SC, BCC, and FCC Unit Cells', seed: 109 });
  s.text(440, 30, 'Cubic Unit-Cell Counting: SC (1), BCC (2), FCC (4)', { size: 24, weight: 700 });
  const boxes = [
    { x: 60, label: 'SC: 8 x 1/8 = 1', density: 'pi/6 = 52.4%', color: C.blue, center: false, faces: false },
    { x: 330, label: 'BCC: 1 + 8 x 1/8 = 2', density: 'pi*sqrt(3)/8 = 68.0%', color: C.amber, center: true, faces: false },
    { x: 600, label: 'FCC: 6 x 1/2 + 8 x 1/8 = 4', density: 'pi/(3*sqrt(2)) = 74.0%', color: C.green, center: false, faces: true }
  ];
  boxes.forEach(b => {
    s.rect(b.x, 70, 150, 150, { color: b.color, fill: b.color === C.blue ? C.blueSoft : b.color === C.amber ? C.amberSoft : C.greenSoft, fillStyle: 'solid' });
    [[b.x, 70], [b.x + 150, 70], [b.x, 220], [b.x + 150, 220]].forEach(([cx, cy]) =>
      s.circle(cx, cy, 24, { color: C.ink, fill: C.note, fillStyle: 'solid' })
    );
    if (b.center) s.circle(b.x + 75, 145, 34, { color: C.rose, fill: C.roseSoft, fillStyle: 'solid' });
    if (b.faces) {
      [[b.x + 75, 70], [b.x + 75, 220], [b.x, 145], [b.x + 150, 145]].forEach(([fx, fy]) =>
        s.circle(fx, fy, 26, { color: C.green, fill: C.greenSoft, fillStyle: 'solid' })
      );
    }
    s.text(b.x + 75, 252, b.label, { size: 17, weight: 700 });
    s.text(b.x + 75, 276, b.density, { font: 'mono', size: 14, color: b.color });
  });
  save('content/part-04-geometry/chapter-16-packing-efficiency/diagrams/16.1-cubic-packings.svg', s);
}

console.log('Generated all 9 hand-drawn SVG math diagrams successfully.');
