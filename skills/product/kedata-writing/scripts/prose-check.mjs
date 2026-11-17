#!/usr/bin/env node
/* prose-check.mjs — measurable gates for kedata-writing.
 *
 *   node scripts/prose-check.mjs docs/PROPOSAL.md
 *   node scripts/prose-check.mjs docs/*.md --json
 *   node scripts/prose-check.mjs docs/PROPOSAL.md --strict
 *   node scripts/prose-check.mjs draft.md --max-sentence=40 --max-avg=25
 *
 * Hard gates (exit 1 when violated):
 *   - average sentence length, longest sentence, longest paragraph
 *   - banned phrases: significance inflation, weasel attribution, signposting,
 *     chatbot artifacts, Indonesian AI tells
 *   - unresolved `[ASSUMPTION` markers
 *
 * Warnings (hard failures under --strict):
 *   - AI vocabulary, intensifiers, soft connectives
 *   - em-dash density, curly quotes, bold-label bullets
 *
 * `--strict` is for anything a client reads. Internal drafts run without it.
 *
 * Zero dependencies. Frontmatter, fenced code, HTML comments, tables and
 * headings are skipped when counting prose.
 */
import { readFileSync } from 'node:fs';

const DEFAULTS = {
  maxSentence: 35,
  maxAvg: 22,
  maxParagraph: 120,
  maxEmDashPer1000: 8,
  json: false,
  strict: false,
};

// Hard failures: phrases with no honest use in a Kedata document. Pattern
// families follow blader/humanizer (MIT) and Wikipedia's "Signs of AI writing";
// see THIRD_PARTY_NOTICES.md.
const HARD = [
  // significance inflation
  'is a testament to',
  'a testament to',
  'plays? a (crucial|vital|pivotal|key) role',
  'stands? as a (testament|reminder|symbol)',
  'underscor(es|ing) (the )?(importance|significance)',
  'reflects? broader',
  'evolving landscape',
  'indelible mark',
  'setting the stage for',
  // promotional
  'in today\'s (fast-paced|digital|modern|rapidly)',
  'fast-paced world',
  'cutting[- ]edge',
  'state[- ]of[- ]the[- ]art',
  'seamless(ly)?',
  'game[- ]chang',
  'revolutioni[sz]',
  'unlock the (full )?potential',
  'one[- ]stop[- ]shop',
  'nestled in the heart of',
  'boasts? a ',
  'must[- ]visit',
  // weasel attribution
  'industry (reports|observers|experts)',
  'experts (argue|believe|say)',
  'some critics argue',
  'observers have (cited|noted)',
  'it is widely (known|believed)',
  // filler and hedging
  'it is important to note',
  'it is worth noting',
  'it\'s worth noting',
  'in order to',
  'due to the fact that',
  'at this point in time',
  'in the event that',
  'has the ability to',
  'could potentially possibly',
  // signposting and chatbot artifacts
  'in conclusion',
  'let\'s (dive|explore|break this down)',
  'here\'s what you need to know',
  'without further ado',
  'i hope this helps',
  'let me know if you',
  'great question',
  'you\'re absolutely right',
  // generic closers
  'the future looks bright',
  'exciting times (lie|lies) ahead',
  'journey toward excellence',
  // negative parallelism and copula avoidance
  'not only .{0,40} but also',
  'it\'s not just (about )?.{0,30}, it\'s',
  'serves? as (a|an|the) ',
  'functions? as (a|an|the) ',
  // Indonesian tells
  'di era digital',
  'tak dapat dipungkiri',
  'sangat krusial',
  'mari kita',
  'sebagai kesimpulan',
  'solusi terbaik',
  'terobosan baru',
  'hal ini dikarenakan',
  'sangat penting untuk',
  'selain itu,',
  'tidak hanya .{0,40} tetapi juga',
];

// Warnings by default. Under --strict these fail too: vocabulary that inflates
// without adding a fact, and connective habits that read as machine-written.
const SOFT = [
  '\\brobust\\b',
  '\\bfurthermore\\b',
  '\\bmoreover\\b',
  '\\butili[sz]e\\b',
  '\\bvery\\b',
  '\\breally\\b',
  '\\bsangat\\b',
  '\\bberbagai\\b',
  '\\bdelve\\b',
  '\\bintricate\\b',
  '\\btapestry\\b',
  '\\bpivotal\\b',
  '\\bshowcas(e|es|ing)\\b',
  '\\bunderscor(e|es|ing)\\b',
  '\\bvibrant\\b',
  '\\bprofound\\b',
  '\\bcomprehensive\\b',
  '\\bholistic\\b',
  '\\bleverage\\b',
  '\\benhance(s|d)?\\b',
  '\\bfoster(s|ed|ing)?\\b',
  '\\bgarner(s|ed)?\\b',
  '\\balign(s|ed)? with\\b',
  '\\bsecara signifikan\\b',
  '\\boptimal\\b',
  '\\bmemadai\\b',
  '\\bmenunjang\\b',
];

function parseArgs(argv) {
  const opts = { ...DEFAULTS, files: [] };
  for (const arg of argv) {
    if (arg === '--json') opts.json = true;
    else if (arg === '--strict') opts.strict = true;
    else if (arg.startsWith('--max-sentence=')) opts.maxSentence = Number(arg.split('=')[1]);
    else if (arg.startsWith('--max-avg=')) opts.maxAvg = Number(arg.split('=')[1]);
    else if (arg.startsWith('--max-paragraph=')) opts.maxParagraph = Number(arg.split('=')[1]);
    else if (arg.startsWith('--max-em-dash=')) opts.maxEmDashPer1000 = Number(arg.split('=')[1]);
    else if (arg.startsWith('--')) continue;
    else opts.files.push(arg);
  }
  return opts;
}

// Blank out everything that is not prose while keeping line numbers stable.
function stripNonProse(text) {
  const lines = text.split('\n');
  let inFence = false;
  let inComment = false;
  let inFrontmatter = lines[0]?.trim() === '---';
  const out = [];

  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i];
    const line = raw.trim();

    if (inFrontmatter) {
      if (i > 0 && line === '---') inFrontmatter = false;
      out.push('');
      continue;
    }
    if (line.startsWith('```') || line.startsWith('~~~')) {
      inFence = !inFence;
      out.push('');
      continue;
    }
    if (inFence) { out.push(''); continue; }

    let s = raw;
    s = s.replace(/<!--[\s\S]*?-->/g, ' ');
    if (inComment) {
      const end = s.indexOf('-->');
      if (end === -1) { out.push(''); continue; }
      s = s.slice(end + 3);
      inComment = false;
    }
    if (s.includes('<!--')) {
      inComment = true;
      s = s.slice(0, s.indexOf('<!--'));
    }
    s = s.replace(/`[^`]*`/g, ' ');                  // inline code
    s = s.replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1'); // links keep their label
    if (/^\s*\|/.test(s)) { out.push(''); continue; } // table row
    if (/^\s*#{1,6}\s/.test(s)) { out.push(''); continue; } // heading
    out.push(s);
  }
  return out;
}

const ABBREVIATIONS = ['e.g.', 'i.e.', 'vs.', 'No.', 'no.', 'Dr.', 'Mr.', 'Mrs.', 'Ms.', 'Prof.', 'dll.', 'dsb.', 'etc.', 'hlm.', 'vol.', 'fig.'];

function splitSentences(paragraph) {
  let guarded = paragraph;
  ABBREVIATIONS.forEach((abbr, i) => {
    guarded = guarded.split(abbr).join(`\u0000${i}\u0000`);
  });
  guarded = guarded.replace(/(\d)\.(\d)/g, '$1\u0001$2'); // decimals
  return guarded
    .split(/(?<=[.!?])\s+/)
    .map(p => p.replace(/\u0001/g, '.').replace(/\u0000(\d+)\u0000/g, (_, i) => ABBREVIATIONS[Number(i)]))
    .map(p => p.trim())
    .filter(Boolean);
}

const wordsOf = s => s.split(/\s+/).filter(w => /[\p{L}\p{N}]/u.test(w)).length;

function checkFile(path, opts) {
  const text = readFileSync(path, 'utf8');
  const lines = stripNonProse(text);
  const result = {
    file: path,
    strict: opts.strict,
    words: 0, sentences: 0, avgSentence: 0,
    longSentences: [], longParagraphs: [],
    hard: [], soft: [],
    assumptions: [],
    metrics: { emDash: 0, emDashPer1000: 0, curlyQuotes: 0, boldLabelBullets: 0 },
    failures: [], warnings: [],
  };

  const compiled = [
    { list: HARD, bucket: 'hard' },
    { list: SOFT, bucket: 'soft' },
  ].map(s => ({ ...s, regexes: s.list.map(p => ({ pattern: p, re: new RegExp(p, 'gi') })) }));

  const report = (bucket, message) => {
    if (bucket === 'hard' || opts.strict) result.failures.push(message);
    else result.warnings.push(message);
  };

  lines.forEach((line, idx) => {
    if (!line.trim()) return;
    for (const scan of compiled) {
      for (const { re } of scan.regexes) {
        re.lastIndex = 0;
        let m;
        while ((m = re.exec(line)) !== null) {
          const phrase = m[0].trim().replace(/\s+/g, ' ');
          result[scan.bucket].push({ line: idx + 1, phrase });
          report(scan.bucket, `${scan.bucket === 'hard' ? 'banned phrase' : 'AI vocabulary'} "${phrase}" at line ${idx + 1}`);
          if (m.index === re.lastIndex) re.lastIndex++;
        }
      }
    }
    if (/^\s*[-*+]\s+\*\*[^*]+\*\*:/.test(line)) {
      result.metrics.boldLabelBullets++;
      report('warn', `bold-label bullet at line ${idx + 1}`);
    }
    const curly = (line.match(/[\u201c\u201d\u2018\u2019]/g) || []).length;
    if (curly) {
      result.metrics.curlyQuotes += curly;
      report('warn', `${curly} curly quote(s) at line ${idx + 1}`);
    }
    result.metrics.emDash += (line.match(/\u2014/g) || []).length;
    const marker = line.match(/\[ASSUMPTION[^\]]*\]?/i);
    if (marker) result.assumptions.push({ line: idx + 1, text: marker[0] });
  });

  // Paragraphs: blank-line separated runs of prose. Each list item is its own
  // unit, or one bullet list reads as a 150-word paragraph.
  const LIST_ITEM = /^\s*(?:[-*+]|\d+[.)])\s+/;
  const paragraphs = [];
  let current = { lines: [], text: '' };
  const flush = () => {
    if (current.text.trim()) paragraphs.push(current);
    current = { lines: [], text: '' };
  };
  lines.forEach((line, idx) => {
    if (!line.trim()) { flush(); return; }
    if (LIST_ITEM.test(line)) {
      flush();
      current.lines.push(idx + 1);
      current.text = line.trim();
      flush();
      return;
    }
    current.lines.push(idx + 1);
    current.text += (current.text ? ' ' : '') + line.trim();
  });
  flush();

  for (const p of paragraphs) {
    const words = wordsOf(p.text);
    result.words += words;
    if (words > opts.maxParagraph) {
      result.longParagraphs.push({ line: p.lines[0], words });
      result.failures.push(`paragraph of ${words} words at line ${p.lines[0]} (limit ${opts.maxParagraph})`);
    }
    for (const sentence of splitSentences(p.text)) {
      const w = wordsOf(sentence);
      if (w === 0) continue;
      result.sentences++;
      if (w > opts.maxSentence) {
        result.longSentences.push({ line: p.lines[0], words: w, text: sentence });
        result.failures.push(`sentence of ${w} words at line ${p.lines[0]} (limit ${opts.maxSentence}): "${sentence.slice(0, 80)}..."`);
      }
    }
  }

  result.avgSentence = result.sentences ? Number((result.words / result.sentences).toFixed(1)) : 0;
  if (result.avgSentence > opts.maxAvg) {
    result.failures.push(`average sentence ${result.avgSentence} words (limit ${opts.maxAvg})`);
  }
  result.metrics.emDashPer1000 = result.words
    ? Number(((result.metrics.emDash / result.words) * 1000).toFixed(1))
    : 0;
  if (result.metrics.emDashPer1000 > opts.maxEmDashPer1000) {
    report('warn', `em dashes ${result.metrics.emDashPer1000} per 1000 words (limit ${opts.maxEmDashPer1000})`);
  }
  if (result.assumptions.length) {
    result.failures.push(`${result.assumptions.length} unresolved [ASSUMPTION] marker(s)`);
  }
  result.pass = result.failures.length === 0;
  return result;
}

const opts = parseArgs(process.argv.slice(2));
if (!opts.files.length) {
  console.error('usage: node scripts/prose-check.mjs <file.md> [more.md ...] [--json] [--strict] [--max-sentence=35] [--max-avg=22] [--max-paragraph=120] [--max-em-dash=8]');
  process.exit(2);
}

const results = opts.files.map(f => checkFile(f, opts));

if (opts.json) {
  console.log(JSON.stringify(results, null, 2));
} else {
  for (const r of results) {
    console.log(`\n${r.file}${r.strict ? ' (strict)' : ''}`);
    console.log(`  words ${r.words} · sentences ${r.sentences} · average ${r.avgSentence} words/sentence`);
    console.log(`  gates: sentence ≤ ${opts.maxSentence} · average ≤ ${opts.maxAvg} · paragraph ≤ ${opts.maxParagraph} · em dash ≤ ${opts.maxEmDashPer1000}/1000 words`);
    if (r.hard.length) {
      console.log(`  banned phrases (${r.hard.length}):`);
      for (const b of r.hard) console.log(`    line ${b.line}: "${b.phrase}"`);
    }
    if (r.soft.length) {
      const shown = r.soft.slice(0, 10).map(s => `line ${s.line} "${s.phrase}"`).join(', ');
      console.log(`  AI vocabulary (${r.soft.length}): ${shown}${r.soft.length > 10 ? ', …' : ''}`);
    }
    if (r.metrics.boldLabelBullets) console.log(`  bold-label bullets: ${r.metrics.boldLabelBullets}`);
    if (r.metrics.curlyQuotes) console.log(`  curly quotes: ${r.metrics.curlyQuotes}`);
    if (r.assumptions.length) {
      console.log(`  unresolved assumptions (${r.assumptions.length}):`);
      for (const a of r.assumptions) console.log(`    line ${a.line}: ${a.text}`);
    }
    console.log(`  warnings: ${r.warnings.length}${opts.strict ? ' (promoted to failures)' : ''}`);
    console.log(r.pass ? '  PASS' : `  FAIL — ${r.failures.length} issue(s)`);
  }
}

process.exit(results.every(r => r.pass) ? 0 : 1);
