import { useEffect, useState } from 'react';
import { fetchMember } from './api.js';
import BookList from './components/BookList.jsx';
import MyLoans from './components/MyLoans.jsx';

// The desk is always operated on behalf of one member for now.
const MEMBER_ID = 'm1';

export default function App() {
  const [member, setMember] = useState(null);

  useEffect(() => {
    fetchMember(MEMBER_ID).then(setMember);
  }, []);

  return (
    <div className="app">
      <header className="header">
        <h1>Library Desk</h1>
        <span className="member">{member ? `Serving: ${member.name}` : 'Loading member…'}</span>
      </header>
      <main className="layout">
        <section className="panel">
          <h2>Catalogue</h2>
          <BookList />
        </section>
        <aside className="panel">
          <h2>Current loans</h2>
          <MyLoans />
        </aside>
      </main>
    </div>
  );
}
