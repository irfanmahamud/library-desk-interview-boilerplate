async function request(path, options) {
  const res = await fetch(path, options);
  const body = await res.json().catch(() => null);
  if (!res.ok) {
    const error = new Error(body?.message ?? `Request failed (${res.status})`);
    error.status = res.status;
    error.code = body?.code;
    throw error;
  }
  return body;
}

export const fetchMember = (memberId) => request(`/api/members/${memberId}`);

export const fetchBooks = (query = '') =>
  request(`/api/books?q=${encodeURIComponent(query)}`);

export const fetchLoans = (memberId) => request(`/api/members/${memberId}/loans`);

export const borrowBook = (bookId, memberId, headers = {}) =>
  request(`/api/books/${bookId}/borrow`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...headers },
    body: JSON.stringify({ memberId }),
  });

export const returnBook = (bookId, memberId, headers = {}) =>
  request(`/api/books/${bookId}/return`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...headers },
    body: JSON.stringify({ memberId }),
  });
