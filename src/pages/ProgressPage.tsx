import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BarChart2, RotateCcw, CheckCircle2, Clock, Trash2, ArrowRight } from 'lucide-react';
import curriculumData from '../../data/curriculum.json';
import { getStoredProgress, markReviewCompleted, toggleReviewQueue } from '../utils/storage';
import { ProgressTracker } from '../components/ProgressTracker';
import { Part, LessonMeta } from '../types/curriculum';
import { parseInlineText } from '../utils/textParser';

export const ProgressPage: React.FC = () => {
  const [progress, setProgress] = useState(getStoredProgress());

  let totalLessons = 0;
  let totalQuizzes = 0;
  const lessonLookup: Record<string, LessonMeta> = {};
  curriculumData.parts.forEach(p => {
    p.chapters.forEach(c => {
      totalLessons += c.lessons.length;
      totalQuizzes++;
      c.lessons.forEach(l => {
        lessonLookup[l.id] = l as LessonMeta;
      });
    });
  });

  const completedLessonsCount = progress.completedLessons.length;
  const completedQuizzesCount = Object.keys(progress.completedQuizzes).length;
  const reviewEntries = Object.entries(progress.reviewQueue || {}).sort((a, b) => a[1] - b[1]);
  const now = Date.now();

  return (
    <div className="py-8 px-4 max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight flex items-center gap-2">
          <BarChart2 className="w-7 h-7 text-brand-500" />
          Learning Analytics & Progress Dashboard
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Detailed metrics tracking completed lessons, chapter quizzes, and your blind re-solve queue.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-1">
          <span className="text-xs text-slate-400 uppercase font-semibold">Completed Lessons</span>
          <div className="text-2xl font-black text-slate-900 dark:text-slate-100">
            {completedLessonsCount} / {totalLessons}
          </div>
        </div>

        <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-1">
          <span className="text-xs text-slate-400 uppercase font-semibold">Quizzes Attempted</span>
          <div className="text-2xl font-black text-slate-900 dark:text-slate-100">
            {completedQuizzesCount} / {totalQuizzes}
          </div>
        </div>

        <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-1">
          <span className="text-xs text-slate-400 uppercase font-semibold">Blind Re-Solve Queue</span>
          <div className="text-2xl font-black text-cyan-600 dark:text-cyan-400">
            {reviewEntries.length}
          </div>
        </div>
      </div>

      <div className="p-6 rounded-2xl border border-cyan-200 dark:border-cyan-900/60 bg-white dark:bg-slate-900 shadow-sm space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-cyan-500" />
              <span>Blind Re-Solve Spaced Queue</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Use the circular Re-Solve button in any lesson's bottom dock to schedule proofs you want to re-derive cold in 3 or 7 days.
            </p>
          </div>
        </div>

        {reviewEntries.length === 0 ? (
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-dashed border-slate-200 dark:border-slate-800 text-xs text-slate-500 flex items-center justify-between gap-4 flex-wrap">
            <span>No theorems queued yet. Open any tricky lesson (such as §18.2, §19.1, or §19.2) and click the circular Review icon in the bottom dock.</span>
            <Link to="/lesson/19.2" className="text-brand-600 font-semibold hover:underline flex items-center gap-1">
              <span>Practice §19.2</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          <div className="space-y-2.5">
            {reviewEntries.map(([lid, dueMs]) => {
              const meta = lessonLookup[lid];
              const diffDays = Math.ceil((dueMs - now) / (1000 * 60 * 60 * 24));
              const isDue = diffDays <= 0;
              return (
                <div key={lid} className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60 flex items-center justify-between gap-3 flex-wrap">
                  <div className="space-y-0.5 min-w-0">
                    <div className="flex items-center gap-2">
                      <Link to={`/lesson/${lid}`} className="text-sm font-bold text-slate-900 dark:text-slate-100 hover:text-brand-600 transition truncate">
                        §{lid} — {meta ? parseInlineText(meta.title) : `Lesson ${lid}`}
                      </Link>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        isDue
                          ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                          : 'bg-cyan-100 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-300'
                      }`}>
                        <Clock className="w-3 h-3" />
                        <span>{isDue ? 'Due now' : `In ${diffDays}d`}</span>
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setProgress(markReviewCompleted(lid, 7))}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold hover:bg-emerald-100 transition"
                      title="Solved cold! Push next review +7 days"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Solved Cold (+7d)</span>
                    </button>
                    <button
                      onClick={() => setProgress(toggleReviewQueue(lid))}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                      title="Remove from queue"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <ProgressTracker curriculumParts={curriculumData.parts as Part[]} progress={progress} />
    </div>
  );
};
