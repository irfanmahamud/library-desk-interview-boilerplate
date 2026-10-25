import express from 'express';
import { db, resetData } from './data.js';

const PORT = 3001;
const MAX_LOANS = 3;

// Simulated flakiness for write endpoints (0 to 1).
let failRate = 0.2;
const idempotencyCache = new Map();

const app = express();
app.use(express.json());

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const fail = (res, status, code, message) => res.status(status).json({ code, message });

const findBook = (id) => db.books.find((b) => b.id === id);
const findMember = (id) => db.members.find((m) => m.id === id);
const toLoanView = (loan) => ({ ...loan, title: findBook(loan.bookId)?.title });

// --- reads -----------------------------------------------------------------

app.get('/api/books', async (req, res) => {
  const q = String(req.query.q ?? '').trim().toLowerCase();
  // Shorter queries are slower, like a real search backend scanning more rows.
  await sleep(Math.max(100, 1200 - q.length * 250) + Math.random() * 150);
  const matches = db.books.filter(
    (b) => b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q),
  );
  res.json(matches);
});

app.get('/api/members/:id', async (req, res) => {
  await sleep(150);
  const member = findMember(req.params.id);
  if (!member) return fail(res, 404, 'MEMBER_NOT_FOUND', 'No such member.');
  res.json(member);
});

app.get('/api/members/:id/loans', async (req, res) => {
  await sleep(200);
  if (!findMember(req.params.id)) return fail(res, 404, 'MEMBER_NOT_FOUND', 'No such member.');
  res.json(db.loans.filter((l) => l.memberId === req.params.id).map(toLoanView));
});

// --- writes ----------------------------------------------------------------

// Decides whether this call will misbehave: 'ok' | 'fail-before' | 'fail-after'.
function rollChaos() {
  const r = Math.random();
  if (r < failRate / 2) return 'fail-before';
  if (r < failRate) return 'fail-after';
  return 'ok';
}

function withIdempotency(handler) {
  return async (req, res) => {
    const key = req.get('Idempotency-Key');
    if (key && idempotencyCache.has(key)) {
      const saved = idempotencyCache.get(key);
      return res.status(saved.status).json(saved.body);
    }
    const reply = await handler(req);
    if (key && reply.status < 500) idempotencyCache.set(key, reply);
    // A real success is remembered even when the response never reaches the client.
    if (key && reply.lost) idempotencyCache.set(key, reply.real);
    return res.status(reply.status).json(reply.body);
  };
}

app.post(
  '/api/books/:id/borrow',
  withIdempotency(async (req) => {
    await sleep(300 + Math.random() * 600);
    const { memberId } = req.body ?? {};
    const book = findBook(req.params.id);
    if (!book) return { status: 404, body: { code: 'BOOK_NOT_FOUND', message: 'No such book.' } };
    if (!findMember(memberId)) {
      return { status: 404, body: { code: 'MEMBER_NOT_FOUND', message: 'No such member.' } };
    }

    const memberLoans = db.loans.filter((l) => l.memberId === memberId);
    if (memberLoans.some((l) => l.bookId === book.id)) {
      return { status: 409, body: { code: 'ALREADY_BORROWED', message: 'Member already has this book.' } };
    }
    if (memberLoans.length >= MAX_LOANS) {
      return {
        status: 409,
        body: { code: 'LOAN_LIMIT_REACHED', message: `Members can hold at most ${MAX_LOANS} books.` },
      };
    }
    if (book.copies < 1) {
      return { status: 409, body: { code: 'OUT_OF_STOCK', message: 'No copies available.' } };
    }

    const chaos = rollChaos();
    if (chaos === 'fail-before') {
      return { status: 503, body: { code: 'UPSTREAM_UNAVAILABLE', message: 'Service unavailable, try again.' } };
    }

    book.copies -= 1;
    const loan = { id: `l${db.nextLoanId++}`, memberId, bookId: book.id, borrowedAt: new Date().toISOString() };
    db.loans.push(loan);
    const real = { status: 201, body: { loan: toLoanView(loan), book } };

    if (chaos === 'fail-after') {
      return {
        status: 504,
        body: { code: 'GATEWAY_TIMEOUT', message: 'Request timed out.' },
        lost: true,
        real,
      };
    }
    return real;
  }),
);

app.post(
  '/api/books/:id/return',
  withIdempotency(async (req) => {
    await sleep(300 + Math.random() * 600);
    const { memberId } = req.body ?? {};
    const book = findBook(req.params.id);
    if (!book) return { status: 404, body: { code: 'BOOK_NOT_FOUND', message: 'No such book.' } };
    const loan = db.loans.find((l) => l.memberId === memberId && l.bookId === book.id);
    if (!loan) return { status: 409, body: { code: 'NOT_BORROWED', message: 'Member does not have this book.' } };

    const chaos = rollChaos();
    if (chaos === 'fail-before') {
      return { status: 503, body: { code: 'UPSTREAM_UNAVAILABLE', message: 'Service unavailable, try again.' } };
    }

    db.loans = db.loans.filter((l) => l.id !== loan.id);
    book.copies += 1;
    const real = { status: 200, body: { book } };

    if (chaos === 'fail-after') {
      return { status: 504, body: { code: 'GATEWAY_TIMEOUT', message: 'Request timed out.' }, lost: true, real };
    }
    return real;
  }),
);

// --- interviewer controls (not part of the app's API) -----------------------

app.post('/api/_chaos', (req, res) => {
  const rate = Number(req.body?.failRate);
  if (!(rate >= 0 && rate <= 1)) return fail(res, 400, 'BAD_RATE', 'failRate must be between 0 and 1.');
  failRate = rate;
  res.json({ failRate });
});

app.post('/api/_reset', (_req, res) => {
  resetData();
  idempotencyCache.clear();
  res.json({ ok: true });
});

app.listen(PORT, () => console.log(`API listening on http://localhost:${PORT}`));
