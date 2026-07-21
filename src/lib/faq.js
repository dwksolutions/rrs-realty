// Pulls FAQ pairs straight out of a guide's markdown so FAQPage structured data
// and the visible page can never drift apart (Google requires them to match).
//
// It looks for an H2 whose text reads like a question section, then treats each
// H3 under it as a question and the prose beneath as the answer:
//
//   ## Common first-time buyer questions
//   ### Do I need 20 percent down?
//   No. Many first-time buyers put down far less...
//
// A question section with no H3s (e.g. "Questions worth asking", a list of
// questions to ask an agent) yields nothing, which is correct: those are not
// answered questions and must not be marked up as an FAQ.

const SECTION = /^##\s+(.*(?:questions?|faqs?|q&a).*)$/i;

// Markdown -> plain text for the schema answer.
function plain(md) {
  return md
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1') // links keep their text
    .replace(/[*_`]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export function extractFaqs(body = '') {
  const lines = body.split(/\r?\n/);
  const faqs = [];
  let inSection = false;
  let q = null;
  let buf = [];

  const flush = () => {
    if (q) {
      const a = plain(buf.join(' '));
      if (a) faqs.push({ q, a });
    }
    q = null;
    buf = [];
  };

  for (const line of lines) {
    if (/^##\s/.test(line) && !/^###/.test(line)) {
      flush();
      inSection = SECTION.test(line);
      continue;
    }
    if (!inSection) continue;
    if (/^###\s/.test(line)) {
      flush();
      q = plain(line.replace(/^###\s+/, ''));
      continue;
    }
    if (q) buf.push(line);
  }
  flush();

  // A lone Q&A is not an FAQ section worth marking up.
  return faqs.length >= 2 ? faqs : [];
}

export function faqSchema(body) {
  const faqs = extractFaqs(body);
  if (!faqs.length) return null;
  return {
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}
