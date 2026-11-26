import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Layers, Zap, Award, Compass, Code, FileText, GitMerge } from 'lucide-react';
import curriculumData from '../../data/curriculum.json';
import { getStoredProgress } from '../utils/storage';
import { ProgressTracker } from '../components/ProgressTracker';
import { Part } from '../types/curriculum';
import { parseInlineText } from '../utils/textParser';

export const HomePage: React.FC = () => {
  const progress = getStoredProgress();
  const lastLessonId = progress.lastVisitedLessonId || '0.1';

  let lastLessonTitle = 'Symmetry Groups & Orbit-Stabilizer';
  let totalChapters = 0;
  let totalLessons = 0;

  curriculumData.parts.forEach(p => {
    totalChapters += p.chapters.length;
    p.chapters.forEach(c => {
      totalLessons += c.lessons.length;
      c.lessons.forEach(l => {
        if (l.id === lastLessonId) lastLessonTitle = l.title;
      });
    });
  });

  return (
    <div className="space-y-16 py-8 px-4 max-w-6xl mx-auto">
      <section className="text-center space-y-6 pt-6 pb-4">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400 border border-brand-200 dark:border-brand-800 text-xs font-medium">
          <Zap className="w-3.5 h-3.5 text-brand-500 fill-current" />
          <span>Inter-IIT & Integral Cup 2026 • {totalChapters} Chapters • {totalLessons} Lessons</span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-slate-900 dark:text-slate-50 tracking-tight leading-tight max-w-4xl mx-auto">
          Integral Cup & <span className="text-brand-600 dark:text-brand-400">Inter-IIT Math Bowl</span>
        </h1>

        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Focused pure-mathematics study guide and reference archive: Discrete Math, Number Theory, Games & Auctions, Geometry & Packing, plus complete walkthroughs of the 2024 Screening Test and CMI Inter-IIT 2023 papers.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <Link
            to={`/lesson/${lastLessonId}`}
            className="flex items-center space-x-2 px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all"
          >
            <span>Continue Studying ({lastLessonId})</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            to="/curriculum"
            className="flex items-center space-x-2 px-6 py-3 rounded-xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-semibold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
          >
            <Layers className="w-4 h-4" />
            <span>Explore {totalChapters} Chapters</span>
          </Link>

          <Link
            to="/course"
            className="flex items-center space-x-2 px-6 py-3 rounded-xl border border-indigo-300 dark:border-indigo-800 bg-indigo-50/70 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-semibold text-sm hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-all"
          >
            <FileText className="w-4 h-4" />
            <span>Math Lab & Past Papers</span>
          </Link>
        </div>
      </section>

      <section className="p-6 rounded-2xl border border-brand-200 dark:border-brand-900/60 bg-gradient-to-r from-brand-50/80 via-white to-brand-50/40 dark:from-brand-950/40 dark:via-slate-900 dark:to-brand-950/20 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <span className="text-[11px] font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
            Current Study Landmark
          </span>
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            Lesson {lastLessonId} — {parseInlineText(lastLessonTitle)}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Resume your theorems, Olympiad proofs, Python verifications, and past paper drills.
          </p>
        </div>

        <Link
          to={`/lesson/${lastLessonId}`}
          className="px-5 py-2.5 rounded-lg bg-brand-600 text-white text-xs font-semibold hover:bg-brand-500 flex-shrink-0 transition-colors"
        >
          Resume Lesson →
        </Link>
      </section>

      <section>
        <ProgressTracker curriculumParts={curriculumData.parts as Part[]} progress={progress} />
      </section>

      <section className="space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Complete Competition Curriculum
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Toolkit → Discrete Math → Number Theory → Games & Auctions → Geometry & Packing → Bridges → 2023 & 2024 Past Papers
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {curriculumData.parts.map(part => (
            <Link
              key={part.id}
              to={`/part/${part.id}`}
              className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-brand-500/50 hover:shadow-md transition-all group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-brand-600 dark:text-brand-400 uppercase tracking-wider">
                  {part.number === 0 ? 'Foundation & Blueprint' : `Part ${part.number}`}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  {part.chapters.length} {part.chapters.length === 1 ? 'Chapter' : 'Chapters'}
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                {parseInlineText(part.title)}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                {parseInlineText(part.description)}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-6">
        <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Compass className="w-5 h-5 text-brand-500" />
          Built Specifically for Inter-IIT Math Bowl Prep
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
          <div className="space-y-2">
            <div className="font-bold text-slate-900 dark:text-slate-200 flex items-center space-x-1.5">
              <Award className="w-4 h-4 text-emerald-500" />
              <span>1. Proofs & Real Screening Papers</span>
            </div>
            <p>
              Covers every pure-math section from the Integral Cup guide plus full worked proofs for all 18 Math Bowl 2024 Screening questions and 5 CMI Inter-IIT 2023 problems.
            </p>
          </div>

          <div className="space-y-2">
            <div className="font-bold text-slate-900 dark:text-slate-200 flex items-center space-x-1.5">
              <Code className="w-4 h-4 text-amber-500" />
              <span>2. Runnable Python Sanity Checks</span>
            </div>
            <p>
              Test recurrences, modular products mod 2017, matrix eigenvalues, Paley Ramsey graphs, and graph rumor absorption live in your browser.
            </p>
          </div>

          <div className="space-y-2">
            <div className="font-bold text-slate-900 dark:text-slate-200 flex items-center space-x-1.5">
              <GitMerge className="w-4 h-4 text-purple-500" />
              <span>3. Pure-Math Isolation</span>
            </div>
            <p>
              Completely isolated from your AI-DeepDive GitHub repo, with RL/ML-only material omitted so your study focus stays strictly on Olympiad mathematics.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
