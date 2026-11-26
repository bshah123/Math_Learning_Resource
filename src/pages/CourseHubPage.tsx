import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  Sparkles,
  GitMerge,
  CheckCircle2,
  Calculator,
  ChevronRight,
  ExternalLink
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

  // Catalan explorer state
  const [catalanN, setCatalanN] = useState(4);
  const totalPaths = comb(2 * catalanN, catalanN);
  const badPaths = comb(2 * catalanN, catalanN - 1);
  const catalanVal = totalPaths - badPaths;

  // Poker / Auction calculator state
  const [pot] = useState(100);
  const [bet, setBet] = useState(50);
  const [bidders, setBidders] = useState(4);
  const alphaBluff = bet / (pot + 2 * bet);
  const mdfCall = pot / (pot + bet);
  const auctionRev = (bidders - 1) / (bidders + 1);

  // Modular power explorer (Math Bowl P16)
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
          Browse the uploaded Math Bowl 2024 Screening Test (18 problems) and CMI Inter-IIT 2023 Solutions (5 problems), run live combinatorics and modular arithmetic calculators, and review the 19 pure-math bridges.
        </p>

        <div className="flex flex-wrap gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
          {[
            { id: 'papers', label: 'Reference Papers Vault', icon: FileText },
            { id: 'simulators', label: 'Interactive Calculators', icon: Calculator },
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
                3. Integral Cup 2026 Beyond-Syllabus Guide
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                All pure-mathematics chapters (Toolkit + Sections 1–16 + Pure-Math Bridges) are built into Parts 0–5, with the RL/ML track skipped for Inter-IIT preparation.
              </p>
              <Link to="/lesson/0.3" className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600 hover:underline">
                <span>View Full Track Mapping in §0.3</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              1. Catalan Reflection Explorer
            </h3>
            <p className="text-xs text-slate-500">
              {parseInlineText('Lattice paths from $(0,0)$ to $(n,n)$ never crossing $y = x$.')}
            </p>
            <div>
              <label className="text-xs font-semibold flex justify-between mb-1">
                <span>Grid size n</span>
                <span className="font-mono text-brand-600">{catalanN}</span>
              </label>
              <input
                type="range"
                min={1}
                max={8}
                value={catalanN}
                onChange={e => setCatalanN(Number(e.target.value))}
                className="w-full accent-indigo-600"
              />
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 font-mono text-xs space-y-1">
              <div>Total E/N paths C(2n,n): <span className="font-bold">{totalPaths}</span></div>
              <div>Bad paths C(2n,n-1): <span className="font-bold text-rose-500">{badPaths}</span></div>
              <div>Good Catalan C_n: <span className="font-bold text-emerald-500">{catalanVal}</span></div>
            </div>
            <Link to="/lesson/3.1" className="text-xs text-brand-600 hover:underline font-semibold block">
              Read §3.1 Reflection Principle →
            </Link>
          </div>

          <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              2. Poker & Auction Calculator
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
              3. Quartic Product Mod 2017 (P16)
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
