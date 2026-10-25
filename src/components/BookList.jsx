import { useEffect, useState } from 'react';
import { fetchBooks } from '../api.js';
import BookCard from './BookCard.jsx';

export default function BookList() {
  const [books, setBooks] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchBooks(query).then((data) => {
      setBooks(data);
      setLoading(false);
    });
  }, [query]);

  return (
    <div>
      <input
        className="search"
        type="search"
        placeholder="Search by title or author"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {loading && <p className="muted">Loading…</p>}
      <ul className="book-list">
        {books.map((book, index) => (
          <BookCard key={index} book={book} />
        ))}
      </ul>
      {!loading && books.length === 0 && <p className="muted">No books found.</p>}
    </div>
  );
}
