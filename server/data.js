// In-memory data. Restarting the server (or POST /api/_reset) restores this state.

const seedBooks = () => [
  { id: 'b1', title: 'Dune', author: 'Frank Herbert', copies: 2 },
  { id: 'b2', title: 'Neuromancer', author: 'William Gibson', copies: 1 },
  { id: 'b3', title: 'The Left Hand of Darkness', author: 'Ursula K. Le Guin', copies: 3 },
  { id: 'b4', title: 'The Dispossessed', author: 'Ursula K. Le Guin', copies: 1 },
  { id: 'b5', title: 'Snow Crash', author: 'Neal Stephenson', copies: 0 },
  { id: 'b6', title: 'Foundation', author: 'Isaac Asimov', copies: 2 },
  { id: 'b7', title: 'I, Robot', author: 'Isaac Asimov', copies: 1 },
  { id: 'b8', title: 'Hyperion', author: 'Dan Simmons', copies: 1 },
  { id: 'b9', title: 'The Martian', author: 'Andy Weir', copies: 4 },
  { id: 'b10', title: 'Kindred', author: 'Octavia E. Butler', copies: 2 },
  { id: 'b11', title: 'Parable of the Sower', author: 'Octavia E. Butler', copies: 0 },
  { id: 'b12', title: 'Solaris', author: 'Stanisław Lem', copies: 2 },
];

const seedMembers = () => [
  { id: 'm1', name: 'Alex Rivera' },
  { id: 'm2', name: 'Sam Okafor' },
];

// Alex already holds two books when the session starts.
const seedLoans = () => [
  { id: 'l1', memberId: 'm1', bookId: 'b3', borrowedAt: '2026-10-12T09:30:00.000Z' },
  { id: 'l2', memberId: 'm1', bookId: 'b9', borrowedAt: '2026-10-19T14:05:00.000Z' },
];

export const db = {
  books: seedBooks(),
  members: seedMembers(),
  loans: seedLoans(),
  nextLoanId: 3,
};

export function resetData() {
  db.books = seedBooks();
  db.members = seedMembers();
  db.loans = seedLoans();
  db.nextLoanId = 3;
}
