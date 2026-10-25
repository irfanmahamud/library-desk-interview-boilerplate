export default function BookCard({ book }) {
  return (
    <li className="book-card">
      <div>
        <div className="book-title">{book.title}</div>
        <div className="muted">{book.author}</div>
        <div className="copies">
          {book.copies > 0 ? `${book.copies} available` : 'None available'}
        </div>
      </div>
      <button className="btn" disabled>
        Borrow
      </button>
    </li>
  );
}
