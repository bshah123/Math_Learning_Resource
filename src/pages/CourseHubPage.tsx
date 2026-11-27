import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  Sparkles,
  GitMerge,
  CheckCircle2,
  Calculator,
  ChevronRight,
  ExternalLink,
  RefreshCw,
  Shuffle
} from 'lucide-react';
import { parseInlineText } from '../utils/textParser';

const assetUrl = (p: string) => `${import.meta.env.BASE_URL}${p.replace(/^\/+/, '')}`;

function comb(n: number, k: number): number {
  if (k < 0 || k > n) return 0;
  let res = 1;
  for (let i = 1; i <= k; i++) {
    res = (res * (n - k + i)) / i;
  }
  return Math.round(res);
}

function decodePrufer(code: number[]) {
  const n = code.length + 2;
  const used = new Set<number>();
  const edges: Array<[number, number]> = [];
  const trace: string[] = [];
  for (let i = 0; i < code.length; i++) {
    const rem = new Set(code.slice(i));
    let leaf = 1;
    while (used.has(leaf) || rem.has(leaf)) leaf++;
    used.add(leaf);
    edges.push([leaf, code[i]]);
    trace.push(`Step ${i + 1}: smallest unused leaf not in suffix = ${leaf} → edge (${leaf}, ${code[i]})`);
  }
  const left: number[] = [];
  for (let v = 1; v <= n; v++) if (!used.has(v)) left.push(v);
  edges.push([left[0], left[1]]);
  trace.push(`Final edge: join unused pair (${left[0]}, ${left[1]})`);
  return { n, edges, trace };
}

function getCycles(perm: number[]): number[][] {
  const seen = new Array(perm.length).fill(false);
  const cycles: number[][] = [];
  for (let i = 0; i < perm.length; i++) {
    if (!seen[i]) {
      const cyc: number[] = [];
      let cur = i;
      while (!seen[cur]) {
        seen[cur] = true;
        cyc.push(cur);
        cur = perm[cur];
      }
      cycles.push(cyc);
    }
  }
  return cycles;
}

const CYCLE_COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#06b6d4', '#8b5cf6', '#f43f5e'];

const BRIDGES = [
  { bridge: 'A homomorphism G → K_k is exactly a proper k-coloring', topics: 'homomorphisms, coloring', sections: ['4.1', '6.1'] },
  { bridge: 'Prüfer codes biject labeled trees with sequences in [n]^(n-2)', topics: 'bijections, trees', sections: ['1.1', '3.2'] },
  { bridge: 'Burnside’s lemma counts colorings up to symmetry', topics: 'automorphisms, coloring', sections: ['5.1', '6.1'] },
  { bridge: 'Every automorphism of a tree fixes its Jordan center', topics: 'trees, symmetry', sections: ['1.1', '4.1'] },
  { bridge: 'The probabilistic method gives R(k, k) > 2^(k/2)', topics: 'probability, Ramsey', sections: ['0.2', '6.2'] },
  { bridge: 'Schur’s theorem is Ramsey’s theorem on difference colorings', topics: 'Ramsey, number theory', sections: ['6.2'] },
  { bridge: 'An ultrametric is a rooted tree; tree metrics obey the four-point condition', topics: 'metric spaces, trees', sections: ['7.1'] },
  { bridge: 'The p-adic distance is an ultrametric built from v_p in Legendre’s formula', topics: 'metric spaces, primes', sections: ['7.1', '9.1'] },
  { bridge: 'Ptolemy’s inequality holds in every inner-product space', topics: 'geometry, metric spaces', sections: ['7.1', '13.1'] },
  { bridge: 'The ℓ₁ unit ball in 3D is a regular octahedron', topics: 'metric spaces, packing', sections: ['7.1', '16.1'] },
  { bridge: 'Hamming balls give the sphere-packing bound for codes', topics: 'metric spaces, packing', sections: ['7.1'] },
  { bridge: 'Tetrahedron & octahedron dihedral angles sum to 180°, tiling FCC voids', topics: 'polyhedra, packing', sections: ['14.1', '16.1'] },
  { bridge: 'Odd closed walks contain odd cycles: bipartiteness, cycles, knight tours', topics: 'graphs, coloring, Hamiltonicity', sections: ['1.1', '2.1', '4.1'] },
  { bridge: 'The tie-break token is worth half a chip, so parity decides exact splits', topics: 'bidding games, parity', sections: ['12.1'] },
  { bridge: 'Raise ladders are subtraction games decided by residue mod (m + 1)', topics: 'auctions, combinatorial games', sections: ['11.1', '12.1'] },
  { bridge: 'Richman costs equal random-turn coin-flip losing probabilities', topics: 'bidding games, probability', sections: ['12.1'] },
  { bridge: 'The envelope theorem yields auction revenue equivalence', topics: 'partial derivatives, auctions', sections: ['8.1', '12.2'] },
  { bridge: 'Order statistics of uniforms give symmetric auction revenue (n-1)/(n+1)', topics: 'probability, auctions', sections: ['0.2', '12.2'] },
  { bridge: 'Hall’s Marriage Theorem extracts monochromatic k-trees in k-chromatic graphs', topics: 'matchings, coloring, Inter-IIT', sections: ['1.2', '19.2'] }
];

export const CourseHubPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'papers' | 'simulators' | 'bridges' | 'checklist'>('papers');

  // 1. Catalan SVG reflection explorer state
  const [catalanN, setCatalanN] = useState(4);
  const [showReflectedBad, setShowReflectedBad] = useState(true);
  const totalPaths = comb(2 * catalanN, catalanN);
  const badPaths = comb(2 * catalanN, catalanN - 1);
  const catalanVal = totalPaths - badPaths;

  const catalanPoints = useMemo(() => {
    const n = catalanN;
    if (!showReflectedBad) {
      // Valid alternating-ish Dyck path: E, E, N, E, N... ending at (n,n) without touching y=x+1
      const pts: Array<[number, number]> = [[0, 0]];
      let x = 0;
      let y = 0;
      while (x < n || y < n) {
        if (x < n && (x === y || x - y < 2)) {
          x++;
        } else if (y < x) {
          y++;
        } else {
          x++;
        }
        pts.push([x, y]);
      }
      return { prefix: pts, origSuffix: [] as Array<[number, number]>, reflSuffix: [] as Array<[number, number]> };
    }
    // Canonical bad path hitting y=x+1 at (1, 2): E -> N -> N, then (n-1) E's and (n-2) N's
    const prefix: Array<[number, number]> = [
      [0, 0],
      [1, 0],
      [1, 1],
      [1, 2]
    ];
    const origSuffix: Array<[number, number]> = [[1, 2]];
    const reflSuffix: Array<[number, number]> = [[1, 2]];
    let ox = 1;
    let oy = 2;
    let rx = 1;
    let ry = 2;
    for (let i = 0; i < n - 1; i++) {
      ox += 1;
      origSuffix.push([ox, oy]);
      ry += 1;
      reflSuffix.push([rx, ry]);
    }
    for (let j = 0; j < n - 2; j++) {
      oy += 1;
      origSuffix.push([ox, oy]);
      rx += 1;
      reflSuffix.push([rx, ry]);
    }
    return { prefix, origSuffix, reflSuffix };
  }, [catalanN, showReflectedBad]);

  // 2. Prüfer code SVG decoder state (n = 6 -> length 4)
  const [pruferCode, setPruferCode] = useState<number[]>([4, 4, 5, 5]);
  const pruferDecoded = useMemo(() => decodePrufer(pruferCode), [pruferCode]);

  // 3. Burnside necklace vs bracelet SVG explorer
  const [beads, setBeads] = useState(6);
  const [colors, setColors] = useState(2);
  const [includeFlips, setIncludeFlips] = useState(false);
  const [selectedSymIdx, setSelectedSymIdx] = useState(1);

  const burnsideData = useMemo(() => {
    const syms: Array<{ label: string; perm: number[]; cycles: number[][]; fixed: number }> = [];
    for (let r = 0; r < beads; r++) {
      const perm = Array.from({ length: beads }, (_, i) => (i + r) % beads);
      const cycles = getCycles(perm);
      syms.push({
        label: r === 0 ? 'Identity' : `Rot ${r}`,
        perm,
        cycles,
        fixed: Math.pow(colors, cycles.length)
      });
    }
    if (includeFlips) {
      for (let s = 0; s < beads; s++) {
        const perm = Array.from({ length: beads }, (_, i) => (s - i + beads) % beads);
        const cycles = getCycles(perm);
        syms.push({
          label: `Flip ${s + 1}`,
          perm,
          cycles,
          fixed: Math.pow(colors, cycles.length)
        });
      }
    }
    const totalFixed = syms.reduce((acc, g) => acc + g.fixed, 0);
    return { syms, orbitCount: totalFixed / syms.length };
  }, [beads, colors, includeFlips]);

  const activeSym = burnsideData.syms[Math.min(selectedSymIdx, burnsideData.syms.length - 1)] || burnsideData.syms[0];

  // 4. Loopy game retrograde W/L/D stepper (§11.1)
  const [shortcutEtoD, setShortcutEtoD] = useState(false);
  const [retroRound, setRetroRound] = useState(0);

  const retroState = useMemo(() => {
    const nodes = ['a', 'b', 'c', 'd', 'e'];
    const adj: Record<string, string[]> = {
      a: ['b', 'c'],
      b: ['a', 'd'],
      c: ['e'],
      d: [],
      e: shortcutEtoD ? ['c', 'd'] : ['c']
    };
    const snapshots: Array<Record<string, 'W' | 'L' | 'D' | '?'>> = [];
    let cur: Record<string, 'W' | 'L' | 'D' | '?'> = { a: '?', b: '?', c: '?', d: 'L', e: '?' };
    snapshots.push({ ...cur });
    for (let r = 0; r < 4; r++) {
      const next = { ...cur };
      let changed = false;
      for (const u of nodes) {
        if (next[u] !== '?') continue;
        const succ = adj[u];
        if (succ.some(v => cur[v] === 'L')) {
          next[u] = 'W';
          changed = true;
        } else if (succ.length > 0 && succ.every(v => cur[v] === 'W')) {
          next[u] = 'L';
          changed = true;
        }
      }
      if (!changed) break;
      cur = next;
      snapshots.push({ ...cur });
    }
    const finalSnap = { ...cur };
    for (const u of nodes) {
      if (finalSnap[u] === '?') finalSnap[u] = 'D';
    }
    snapshots.push(finalSnap);
    return { adj, snapshots };
  }, [shortcutEtoD]);

  const clampedRound = Math.min(retroRound, retroState.snapshots.length - 1);
  const activeRetro = retroState.snapshots[clampedRound];

  // 5. Poker / Auction calculator state
  const [pot] = useState(100);
  const [bet, setBet] = useState(50);
  const [bidders, setBidders] = useState(4);
  const alphaBluff = bet / (pot + 2 * bet);
  const mdfCall = pot / (pot + bet);
  const auctionRev = (bidders - 1) / (bidders + 1);

  // 6. Modular power explorer (Math Bowl P16)
  const [modA, setModA] = useState(5);
  const modRes = useMemo(() => {
    let prod = 1;
    for (let i = 1; i <= 2016; i++) {
      prod = (prod * (((i * i * i * i) % 2017) + modA)) % 2017;
    }
    return prod;
  }, [modA]);

  // Bridge filter
  const [bridgeFilter, setBridgeFilter] = useState('');
  const filteredBridges = BRIDGES.filter(b =>
    b.bridge.toLowerCase().includes(bridgeFilter.toLowerCase()) ||
    b.topics.toLowerCase().includes(bridgeFilter.toLowerCase())
  );

  return (
    <div className="py-8 px-4 max-w-6xl mx-auto space-y-8">
      <div className="p-6 rounded-2xl border border-indigo-200 dark:border-indigo-900/60 bg-gradient-to-br from-indigo-50/70 via-white to-slate-50 dark:from-indigo-950/30 dark:via-slate-900 dark:to-slate-950 shadow-sm space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Inter-IIT Math Bowl & Integral Cup 2026 — Reference Papers & Lab</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight">
          Math Lab & Past Papers Vault
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-3xl leading-relaxed">
          Browse the uploaded Math Bowl 2024 Screening Test (18 problems) and CMI Inter-IIT 2023 Solutions (5 problems), explore interactive SVG math playgrounds, and review the 19 pure-math bridges.
        </p>

        <div className="flex flex-wrap gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
          {[
            { id: 'papers', label: 'Reference Papers Vault', icon: FileText },
            { id: 'simulators', label: 'Interactive Visual Lab', icon: Calculator },
            { id: 'bridges', label: '19 Pure-Math Bridges', icon: GitMerge },
            { id: 'checklist', label: 'Proof Checklist & Traps', icon: CheckCircle2 }
          ].map(tab => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition ${
                  active
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {activeTab === 'papers' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 space-y-4">
            <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  1. Math Bowl 2024 Screening Test (18 Problems)
                </h2>
                <a
                  href={assetUrl('assets/Math-Bowl-2024-Screening.pdf')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600 hover:underline"
                >
                  <span>Open PDF</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {parseInlineText('Complete screening paper dated 10-11-2024 covering integral AM-GM, circle angle optimization, $K_n$ increasing trails, $abcd=1$ inequalities, three matrix/commutator problems, totient sums, functional equations, Buffon matchsticks, permutation variance, and graph rumor spread.')}
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                <Link to="/lesson/18.1" className="px-3 py-1.5 rounded-lg bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-300 text-xs font-semibold hover:underline">
                  18.1 Inequalities & FE →
                </Link>
                <Link to="/lesson/18.2" className="px-3 py-1.5 rounded-lg bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-300 text-xs font-semibold hover:underline">
                  18.2 Matrices & Prob →
                </Link>
                <Link to="/lesson/18.3" className="px-3 py-1.5 rounded-lg bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-300 text-xs font-semibold hover:underline">
                  18.3 Number Theory & Geo →
                </Link>
              </div>
            </div>

            <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  2. CMI Inter-IIT Math Bowl 2023 (5 Problems & Solutions)
                </h2>
                <a
                  href={assetUrl('assets/CMI-Inter-IIT-Math-Bowl-2023-Soln.pdf')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600 hover:underline"
                >
                  <span>Open PDF</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Five Olympiad problems curated by CMI: South Korea USCM symmetric matrix eigenvalue bounds, Serbian NMO Cauchy–Schwarz, IMC 2003 uncountability diagonalization, Miklós Schweitzer Hall-matching monochromatic $k$-tree, and Korea Winter infinite deficient sumsets.
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                <Link to="/lesson/19.1" className="px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-xs font-semibold hover:underline">
                  19.1 Eigenvalues & Cardinality →
                </Link>
                <Link to="/lesson/19.2" className="px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-xs font-semibold hover:underline">
                  19.2 Hall Trees & Deficient Sumsets →
                </Link>
              </div>
            </div>

            <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-2">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                3. Integral Cup 2026 Beyond-Syllabus Guide & Primer
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                All pure-mathematics chapters (Toolkit + Bridge Primer §0.4 + Sections 1–16 + Pure-Math Bridges) are built into Parts 0–5, with the RL/ML track skipped for Inter-IIT preparation.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link to="/lesson/0.3" className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600 hover:underline">
                  <span>View Track Mapping in §0.3</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
                <Link to="/lesson/0.4" className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:underline">
                  <span>Read Algebra & Martingale Primer §0.4</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-3">
            <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Attached Reference Image (Meme Exam)
            </h2>
            <img
              src={assetUrl('assets/previous-year-math-bowl-paper.jpg')}
              alt="Attached meme exam reference"
              className="w-full rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm"
            />
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              {parseInlineText('Satirical "final exam" meme (Collatz Conjecture, Riemann Hypothesis with $\\zeta:\\mathbb{Z}\\to\\mathbb{Z}$ typo, Fermat without Taniyama–Shimura). See §0.3 for the formal breakdown.')}
            </p>
          </div>
        </div>
      )}

      {activeTab === 'simulators' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Playground 1: Catalan Reflection SVG */}
            <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                    1. Live Catalan Reflection Explorer (§3.1)
                  </h3>
                  <p className="text-xs text-slate-500">
                    {parseInlineText('Lattice paths $(0,0)\\to(n,n)$ vs reflection across $y = x + 1$.')}
                  </p>
                </div>
                <button
                  onClick={() => setShowReflectedBad(v => !v)}
                  className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800"
                >
                  {showReflectedBad ? 'Bad Path + Reflection' : 'Valid Dyck Path'}
                </button>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <label className="text-xs font-semibold flex justify-between mb-1">
                    <span>Grid size n</span>
                    <span className="font-mono text-brand-600">{catalanN}</span>
                  </label>
                  <input
                    type="range"
                    min={2}
                    max={6}
                    value={catalanN}
                    onChange={e => setCatalanN(Number(e.target.value))}
                    className="w-full accent-indigo-600"
                  />
                </div>
                <div className="text-xs font-mono space-y-0.5 text-right">
                  <div>Total: <span className="font-bold">{totalPaths}</span></div>
                  <div>Bad: <span className="font-bold text-rose-500">{badPaths}</span></div>
                  <div>Good C_n: <span className="font-bold text-emerald-500">{catalanVal}</span></div>
                </div>
              </div>

              {(() => {
                const pad = 22;
                const W = 250;
                const H = 250;
                const cols = catalanN;
                const rows = catalanN + 1;
                const step = Math.min((W - 2 * pad) / cols, (H - 2 * pad) / rows);
                const px = (x: number) => pad + x * step;
                const py = (y: number) => H - pad - y * step;
                const toPoly = (pts: Array<[number, number]>) => pts.map(([x, y]) => `${px(x)},${py(y)}`).join(' ');
                return (
                  <div className="rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-2 flex justify-center">
                    <svg viewBox={`0 0 ${W} ${H}`} className="w-60 h-60 overflow-visible">
                      {Array.from({ length: cols + 1 }, (_, x) => (
                        <line key={`vx-${x}`} x1={px(x)} y1={py(0)} x2={px(x)} y2={py(rows)} stroke="currentColor" className="text-slate-200 dark:text-slate-800" strokeWidth={1} />
                      ))}
                      {Array.from({ length: rows + 1 }, (_, y) => (
                        <line key={`hy-${y}`} x1={px(0)} y1={py(y)} x2={px(cols)} y2={py(y)} stroke="currentColor" className="text-slate-200 dark:text-slate-800" strokeWidth={1} />
                      ))}
                      <line x1={px(0)} y1={py(0)} x2={px(cols)} y2={py(cols)} stroke="#10b981" strokeWidth={1.5} />
                      <line x1={px(0)} y1={py(1)} x2={px(cols)} y2={py(cols + 1)} stroke="#f43f5e" strokeWidth={1.5} strokeDasharray="4 3" />
                      {catalanPoints.origSuffix.length > 1 && (
                        <polyline fill="none" stroke="#94a3b8" strokeWidth={2} strokeDasharray="3 3" points={toPoly(catalanPoints.origSuffix)} />
                      )}
                      {catalanPoints.reflSuffix.length > 1 && (
                        <polyline fill="none" stroke="#f43f5e" strokeWidth={2.5} points={toPoly(catalanPoints.reflSuffix)} />
                      )}
                      <polyline fill="none" stroke="#6366f1" strokeWidth={2.8} points={toPoly(catalanPoints.prefix)} />
                      <circle cx={px(cols)} cy={py(cols)} r={3.5} fill="#10b981" />
                      {showReflectedBad && (
                        <>
                          <circle cx={px(1)} cy={py(2)} r={4} fill="#f59e0b" />
                          <circle cx={px(cols - 1)} cy={py(cols + 1)} r={4} fill="#f43f5e" />
                          <text x={px(cols - 1) + 6} y={py(cols + 1) + 4} className="fill-rose-500 text-[9px] font-mono">({cols - 1},{cols + 1})</text>
                        </>
                      )}
                      <text x={px(cols) + 5} y={py(cols) + 4} className="fill-emerald-600 text-[9px] font-mono">({cols},{cols})</text>
                    </svg>
                  </div>
                );
              })()}
            </div>

            {/* Playground 2: Prüfer Code Decoder SVG */}
            <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                    2. Prüfer Code Tree Decoder (§3.2)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Pick or randomize a 4-digit code on vertices {'{1..6}'}; green highlights the final edge.
                  </p>
                </div>
                <button
                  onClick={() => setPruferCode(Array.from({ length: 4 }, () => 1 + Math.floor(Math.random() * 6)))}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                >
                  <Shuffle className="w-3 h-3" />
                  <span>Random Code</span>
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {[
                  { label: '[4, 4, 5, 5]', val: [4, 4, 5, 5] },
                  { label: '[1, 1, 1, 1] Star', val: [1, 1, 1, 1] },
                  { label: '[2, 3, 4, 5] Path', val: [2, 3, 4, 5] },
                  { label: '[6, 1, 4, 2]', val: [6, 1, 4, 2] }
                ].map(p => (
                  <button
                    key={p.label}
                    onClick={() => setPruferCode(p.val)}
                    className={`px-2 py-1 rounded text-[11px] font-mono border ${
                      JSON.stringify(pruferCode) === JSON.stringify(p.val)
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                <div className="rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-2 flex justify-center">
                  <svg viewBox="0 0 200 190" className="w-48 h-44">
                    {pruferDecoded.edges.map(([u, v], idx) => {
                      const pos = (k: number) => {
                        const ang = ((k - 1) / pruferDecoded.n) * 2 * Math.PI - Math.PI / 2;
                        return [100 + 68 * Math.cos(ang), 95 + 68 * Math.sin(ang)];
                      };
                      const [x1, y1] = pos(u);
                      const [x2, y2] = pos(v);
                      const isFinal = idx === pruferDecoded.edges.length - 1;
                      return (
                        <line key={idx} x1={x1} y1={y1} x2={x2} y2={y2} stroke={isFinal ? '#10b981' : '#6366f1'} strokeWidth={isFinal ? 2.8 : 2} />
                      );
                    })}
                    {Array.from({ length: pruferDecoded.n }, (_, i) => i + 1).map(v => {
                      const ang = ((v - 1) / pruferDecoded.n) * 2 * Math.PI - Math.PI / 2;
                      const x = 100 + 68 * Math.cos(ang);
                      const y = 95 + 68 * Math.sin(ang);
                      return (
                        <g key={v}>
                          <circle cx={x} cy={y} r={12} className="fill-white dark:fill-slate-900 stroke-slate-700 dark:stroke-slate-300" strokeWidth={1.8} />
                          <text x={x} y={y + 4} textAnchor="middle" className="fill-slate-800 dark:fill-slate-100 text-[11px] font-bold font-mono">{v}</text>
                        </g>
                      );
                    })}
                  </svg>
                </div>
                <div className="text-[11px] font-mono space-y-1.5 text-slate-600 dark:text-slate-300">
                  <div className="font-bold text-indigo-600 dark:text-indigo-400">Code: [{pruferCode.join(', ')}]</div>
                  {pruferDecoded.trace.map((line, i) => (
                    <div key={i} className="leading-snug">{line}</div>
                  ))}
                </div>
              </div>
            </div>

            {/* Playground 3: Burnside Necklace vs Bracelet Explorer */}
            <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                    3. Burnside Symmetry Counter (§5.1)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Click any group symmetry to inspect its colored cycles and fixed count.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setIncludeFlips(f => !f);
                    setSelectedSymIdx(0);
                  }}
                  className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800"
                >
                  {includeFlips ? `Bracelets (D_${beads})` : `Necklaces (C_${beads})`}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="font-semibold flex justify-between mb-1">
                    <span>Beads n</span>
                    <span className="font-mono text-brand-600">{beads}</span>
                  </label>
                  <input type="range" min={3} max={7} value={beads} onChange={e => { setBeads(Number(e.target.value)); setSelectedSymIdx(0); }} className="w-full accent-indigo-600" />
                </div>
                <div>
                  <label className="font-semibold flex justify-between mb-1">
                    <span>Colors k</span>
                    <span className="font-mono text-brand-600">{colors}</span>
                  </label>
                  <input type="range" min={2} max={3} value={colors} onChange={e => setColors(Number(e.target.value))} className="w-full accent-indigo-600" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                <div className="rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-2 flex flex-col items-center">
                  <svg viewBox="0 0 180 180" className="w-40 h-40">
                    <circle cx={90} cy={90} r={58} fill="none" stroke="currentColor" className="text-slate-300 dark:text-slate-700" strokeDasharray="3 3" />
                    {Array.from({ length: beads }, (_, idx) => {
                      const cycIdx = activeSym.cycles.findIndex(c => c.includes(idx));
                      const fill = CYCLE_COLORS[cycIdx % CYCLE_COLORS.length];
                      const ang = (idx / beads) * 2 * Math.PI - Math.PI / 2;
                      const x = 90 + 58 * Math.cos(ang);
                      const y = 90 + 58 * Math.sin(ang);
                      return (
                        <g key={idx}>
                          <circle cx={x} cy={y} r={12} fill={fill} opacity={0.9} />
                          <text x={x} y={y + 4} textAnchor="middle" className="fill-white text-[10px] font-bold font-mono">{idx + 1}</text>
                        </g>
                      );
                    })}
                  </svg>
                  <div className="text-[11px] font-mono text-slate-500">
                    {activeSym.label}: {activeSym.cycles.length} cycles → {colors}^{activeSym.cycles.length} = {activeSym.fixed} fixed
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-xs font-mono">
                    <div>Distinct {includeFlips ? 'bracelets' : 'necklaces'}: <span className="font-bold text-indigo-600 dark:text-indigo-300">{burnsideData.orbitCount}</span></div>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {burnsideData.syms.map((g, idx) => (
                      <button
                        key={g.label}
                        onClick={() => setSelectedSymIdx(idx)}
                        className={`px-2 py-0.5 rounded text-[10px] font-mono border ${
                          idx === Math.min(selectedSymIdx, burnsideData.syms.length - 1)
                            ? 'bg-indigo-600 text-white border-indigo-600'
                            : 'bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800'
                        }`}
                      >
                        {g.label} ({g.fixed})
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Playground 4: Loopy Game Retrograde W/L/D Stepper */}
            <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                    4. Loopy Retrograde W/L/D Stepper (§11.1)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Step backward from dead-end `d` or toggle shortcut `e → d` to collapse draws!
                  </p>
                </div>
                <button
                  onClick={() => { setShortcutEtoD(s => !s); setRetroRound(0); }}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border ${
                    shortcutEtoD
                      ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                      : 'bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800'
                  }`}
                >
                  {shortcutEtoD ? 'Shortcut e→d ON' : 'Add Shortcut e→d'}
                </button>
              </div>

              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-mono text-slate-500">
                  {clampedRound === retroState.snapshots.length - 1 ? 'Stabilized (remaining = D)' : `Propagation Round ${clampedRound}`}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setRetroRound(0)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-800 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Reset</span>
                  </button>
                  <button
                    onClick={() => setRetroRound(r => Math.min(r + 1, retroState.snapshots.length - 1))}
                    disabled={clampedRound >= retroState.snapshots.length - 1}
                    className="px-3 py-1 rounded-lg bg-indigo-600 disabled:opacity-40 text-white text-xs font-semibold"
                  >
                    Next Round →
                  </button>
                </div>
              </div>

              <div className="rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-2 flex justify-center">
                <svg viewBox="0 0 290 175" className="w-72 h-44">
                  <defs>
                    <marker id="retro-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                      <path d="M 0 1 L 10 5 L 0 9 z" fill="#64748b" />
                    </marker>
                  </defs>
                  {(() => {
                    const pos: Record<string, [number, number]> = {
                      a: [45, 45],
                      b: [145, 45],
                      d: [245, 45],
                      c: [45, 130],
                      e: [145, 130]
                    };
                    const lines: React.ReactNode[] = [];
                    Object.entries(retroState.adj).forEach(([u, outs]) => {
                      outs.forEach(v => {
                        const [x1, y1] = pos[u];
                        const [x2, y2] = pos[v];
                        const dx = x2 - x1;
                        const dy = y2 - y1;
                        const len = Math.hypot(dx, dy) || 1;
                        const ox = -dy / len * 5;
                        const oy = dx / len * 5;
                        const sx = x1 + (dx / len) * 20 + ox;
                        const sy = y1 + (dy / len) * 20 + oy;
                        const ex = x2 - (dx / len) * 21 + ox;
                        const ey = y2 - (dy / len) * 21 + oy;
                        lines.push(
                          <line key={`${u}-${v}`} x1={sx} y1={sy} x2={ex} y2={ey} stroke="#64748b" strokeWidth={1.6} markerEnd="url(#retro-arrow)" />
                        );
                      });
                    });
                    return (
                      <>
                        {lines}
                        {Object.entries(pos).map(([u, [x, y]]) => {
                          const st = activeRetro[u];
                          const bg = st === 'W' ? '#10b981' : st === 'L' ? '#f43f5e' : st === 'D' ? '#f59e0b' : '#475569';
                          return (
                            <g key={u}>
                              <circle cx={x} cy={y} r={18} fill={bg} />
                              <text x={x} y={y + 4} textAnchor="middle" className="fill-white text-xs font-bold font-mono">
                                {u}:{st}
                              </text>
                            </g>
                          );
                        })}
                      </>
                    );
                  })()}
                </svg>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                5. Poker & Auction Calculator (§10.1 & §12.2)
              </h3>
              <p className="text-xs text-slate-500">
                {parseInlineText('Indifference bluff ratio $\\alpha$, minimum defense $c$, and Uniform $[0,1]$ auction revenue.')}
              </p>
              <div className="space-y-2 text-xs">
                <div>Pot P = {pot}, Bet S = {bet}</div>
                <input type="range" min={10} max={200} step={10} value={bet} onChange={e => setBet(Number(e.target.value))} className="w-full accent-indigo-600" />
                <div>Auction Bidders n = {bidders}</div>
                <input type="range" min={2} max={12} value={bidders} onChange={e => setBidders(Number(e.target.value))} className="w-full accent-indigo-600" />
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 font-mono text-xs space-y-1">
                <div>Bluff frac α = S/(P+2S): <span className="font-bold text-indigo-500">{(alphaBluff * 100).toFixed(1)}%</span></div>
                <div>MDF c = P/(P+S): <span className="font-bold text-emerald-500">{(mdfCall * 100).toFixed(1)}%</span></div>
                <div>E[Rev] = (n-1)/(n+1): <span className="font-bold text-amber-500">{auctionRev.toFixed(4)}</span></div>
              </div>
              <Link to="/lesson/10.1" className="text-xs text-brand-600 hover:underline font-semibold block">
                Read §10 & §12 Games/Auctions →
              </Link>
            </div>

            <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                6. Quartic Product Mod 2017 (Screening P16)
              </h3>
              <p className="text-xs text-slate-500">
                {parseInlineText('Computes $\\prod_{i=1}^{2016} (i^4 + a) \\pmod{2017}$ for Screening Problem 16 ($a=5$).')}
              </p>
              <div>
                <label className="text-xs font-semibold flex justify-between mb-1">
                  <span>Constant a</span>
                  <span className="font-mono text-brand-600">{modA}</span>
                </label>
                <input
                  type="range"
                  min={0}
                  max={20}
                  value={modA}
                  onChange={e => setModA(Number(e.target.value))}
                  className="w-full accent-indigo-600"
                />
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 font-mono text-xs space-y-1">
                <div>Product mod 2017: <span className="font-bold text-emerald-500">{modRes}</span></div>
                <div>Signed mod 2017: <span className="font-bold">{modRes > 1008 ? modRes - 2017 : modRes}</span></div>
              </div>
              <Link to="/lesson/18.3" className="text-xs text-brand-600 hover:underline font-semibold block">
                Read Proof in §18.3 →
              </Link>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'bridges' && (
        <div className="space-y-4">
          <input
            type="text"
            value={bridgeFilter}
            onChange={e => setBridgeFilter(e.target.value)}
            placeholder="Filter the 19 pure-math bridges (e.g. Hall, Ramsey, ultrametric, auction, Ptolemy)..."
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredBridges.map((item, idx) => (
              <div key={idx} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col justify-between gap-2">
                <div className="text-xs font-semibold text-slate-800 dark:text-slate-100 leading-relaxed">
                  {parseInlineText(item.bridge)}
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px]">
                  <span className="text-slate-400">{item.topics}</span>
                  <div className="flex items-center gap-2">
                    {item.sections.map(sec => (
                      <Link key={sec} to={`/lesson/${sec}`} className="px-2 py-0.5 rounded bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400 font-mono hover:underline">
                        §{sec}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'checklist' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              5-Point Proof-Writing Checklist (Page 2)
            </h3>
            <ol className="list-decimal list-inside space-y-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              <li>State the claim with every quantifier: for all, there exists, at least, exactly.</li>
              <li>For existence, give the construction and check every required property.</li>
              <li>For impossibility, name the invariant or coloring, show each move or tile respects it, then compare totals.</li>
              <li>For extremal answers, prove the bound and exhibit an object that attains it.</li>
              <li>In a case analysis, say why the cases are exhaustive.</li>
            </ol>
          </div>
          <div className="p-6 rounded-2xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/40 dark:bg-rose-950/20 space-y-3">
            <h3 className="text-lg font-bold text-rose-900 dark:text-rose-200">
              High-Frequency Competition Traps
            </h3>
            <ul className="list-disc list-inside space-y-2 text-xs text-rose-900/90 dark:text-rose-200/90 leading-relaxed">
              <li>{parseInlineText('$A^k$ counts walks (may repeat vertices), never simple paths.')}</li>
              <li>Dirac & Ore are sufficient, not necessary; balanced parts never suffice alone.</li>
              <li>{parseInlineText('Ptolemy equality requires cyclic order $A, B, C, D$.')}</li>
              <li>Fermat-point closed form fails if any triangle angle is 120° or larger.</li>
              <li>In Richman bidding, the winner pays the opponent, not a bank.</li>
              <li>Check whether a graph problem asks for an edge-simple trail vs vertex-simple path.</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
