# Task: Lending books at the Library Desk

Library staff use this app at the front desk, serving one member at a time.
Right now the screen is already serving **Alex Rivera**.

## The brief

> Staff should be able to lend a book to the member they are serving, and see
> which books that member currently has.

That is the whole brief. It is deliberately short.

## How this session works

- **~45 minutes.** You will not be able to polish everything, so decide what matters most.
- **Ask questions.** I'm playing the role of the product owner. Ask me what you'd ask a real teammate.
- **Think out loud.** I care much more about how you decide things than about how much you finish. Tell me what you're choosing and why, including what you're choosing *not* to do.
- **Use whatever tools you normally use**, including AI assistants. You are responsible for every line that ends up in the repo, and I may ask you to explain any of it.
- **The existing code is not a model of good practice.** Change whatever you need to.
- You do not have to finish. Stop and tell me what you would do next.

## Getting started

```bash
git clone https://github.com/irfanmahamud/library-desk-interview-boilerplate.git
cd library-desk-interview-boilerplate
npm install
npm run dev
```

- App: http://localhost:5173
- API: http://localhost:3001 (see [server/README.md](server/README.md))

## Git

Work the way you would on a real team:

- Create a branch for your work (for example `feature/borrow-books`).
- **Commit in small steps**, each one a single logical change that leaves the app working.
- **Write proper commit messages**: a short imperative summary (`Add borrow button with pending state`, not `update` or `fix stuff`), and a line or two of body when the *why* isn't obvious.
- Commit locally as you go. **Do not push**; I will read your history from your screen.

Frontend code lives in `src/`. The API code is in `server/`; you may read it, and you may change it if you can justify why.
