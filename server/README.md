# Library Desk API

Base URL: `http://localhost:3001` (the Vite dev server proxies `/api` to it).
Data is in memory; restarting the server resets it.

All errors look like `{ "code": "SOME_CODE", "message": "Human readable text" }`.

## Reads

| Method | Path | Notes |
|---|---|---|
| GET | `/api/books?q=` | Books whose title or author contains `q`. Each book: `{ id, title, author, copies }` where `copies` is the number currently available. |
| GET | `/api/members/:id` | `{ id, name }` |
| GET | `/api/members/:id/loans` | `[{ id, memberId, bookId, title, borrowedAt }]` |

## Writes

| Method | Path | Body | Success |
|---|---|---|---|
| POST | `/api/books/:id/borrow` | `{ "memberId": "m1" }` | `201 { loan, book }` |
| POST | `/api/books/:id/return` | `{ "memberId": "m1" }` | `200 { book }` |

Both accept an optional `Idempotency-Key` header. Repeating a request with the
same key returns the original result instead of running it again.

Known members: `m1` (Alex Rivera), `m2` (Sam Okafor).

## Status codes

`404` unknown book or member, `409` the request breaks a library rule
(see `code`), `5xx` the call did not complete cleanly.
