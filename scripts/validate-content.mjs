import fs from 'fs';
import path from 'path';

const BASE_DIR = process.cwd();
const CURRICULUM_PATH = path.join(BASE_DIR, 'data/curriculum.json');
const GLOSSARY_PATH = path.join(BASE_DIR, 'data/glossary.json');

console.log('Running Integral Cup 2026 Content Validator...');

if (!fs.existsSync(CURRICULUM_PATH)) {
  console.error('Error: data/curriculum.json not found');
  process.exit(1);
}

const curriculum = JSON.parse(fs.readFileSync(CURRICULUM_PATH, 'utf-8'));
let totalLessons = 0;
let totalQuizzes = 0;
let totalDiagrams = 0;
let errors = 0;
const lessonIds = new Set();

curriculum.parts.forEach(part => {
  part.chapters.forEach(chapter => {
    const chDir = path.join(BASE_DIR, 'content', `${part.id}-${part.slug}`, `${chapter.id}-${chapter.slug}`);

    if (chapter.hasQuiz) {
      const quizPath = path.join(chDir, 'quiz.json');
      if (!fs.existsSync(quizPath)) {
        console.error(`Missing quiz.json for ${chapter.id}: ${quizPath}`);
        errors++;
      } else {
        const quiz = JSON.parse(fs.readFileSync(quizPath, 'utf-8'));
        if (!quiz.questions || quiz.questions.length < 3) {
          console.error(`Quiz too short in ${quizPath}`);
          errors++;
        }
        totalQuizzes++;
      }
    }

    if (chapter.hasSummary) {
      const sumPath = path.join(chDir, 'summary.md');
      if (!fs.existsSync(sumPath)) {
        console.error(`Missing summary.md for ${chapter.id}: ${sumPath}`);
        errors++;
      }
    }

    chapter.lessons.forEach(lesson => {
      totalLessons++;
      if (lessonIds.has(lesson.id)) {
        console.error(`Duplicate lesson ID found: ${lesson.id}`);
        errors++;
      }
      lessonIds.add(lesson.id);

      const filePath = path.join(chDir, lesson.file);
      if (!fs.existsSync(filePath)) {
        console.error(`Missing file for lesson ${lesson.id}: ${filePath}`);
        errors++;
        return;
      }

      const content = fs.readFileSync(filePath, 'utf-8');
      const imgRefs = [...content.matchAll(/!\[[^\]]*\]\(([^\s)]+\.(?:svg|png|jpe?g|webp))(?:\s+"[^"]*")?\)/gi)];
      imgRefs.forEach(match => {
        const rel = match[1];
        const target = rel.startsWith('/assets/')
          ? path.join(BASE_DIR, 'public', rel)
          : path.join(chDir, rel);
        if (!fs.existsSync(target)) {
          console.error(`Missing media ${rel} referenced in ${filePath}`);
          errors++;
        } else {
          totalDiagrams++;
        }
      });
    });
  });
});

if (fs.existsSync(GLOSSARY_PATH)) {
  const glossary = JSON.parse(fs.readFileSync(GLOSSARY_PATH, 'utf-8'));
  glossary.forEach(term => {
    (term.curriculumReferences || []).forEach(ref => {
      if (!lessonIds.has(ref.lessonId)) {
        console.error(`Glossary term "${term.term}" references unknown lesson ${ref.lessonId}`);
        errors++;
      }
    });
  });
}

console.log(`Scanned ${curriculum.parts.length} Parts, ${totalLessons} Lessons, ${totalQuizzes} Quizzes, ${totalDiagrams} Verified Media Links.`);

if (errors > 0) {
  console.error(`Validation failed with ${errors} error(s).`);
  process.exit(1);
} else {
  console.log('All Integral Cup 2026 content, quizzes, and media validated successfully!');
}
