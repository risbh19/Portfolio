/* Profile facts from the supplied résumé and the owner's GitHub profile. */
window.PORTFOLIO = {
  name: 'Rishabh Pal',
  role: 'FULL-STACK DEVELOPER / PROBLEM SOLVER',
  location: 'RKGIT · Ghaziabad, India',
  email: 'palrishabh989@gmail.com',
  intro:
    "I'm Rishabh, a CSE student building **full-stack web applications** with React, Next.js and FastAPI. I practise **competitive programming** in **C++**, my preferred language for contests and problem solving.",
  about:
    "I'm a **CSE student at RKGIT** who enjoys connecting frontend interfaces, REST APIs and databases into useful products. My projects cover authentication, role-based access and real-time workflows. Alongside development, I practise **competitive programming in C++**, with attention to efficient approaches, complexity and edge cases.",
  status: 'B.Tech CSE student · RKGIT',
  focus: 'Full-stack development & competitive programming',
  socials: {
    linkedin: 'https://linkedin.com/in/rishabhpal19',
    github: 'https://github.com/risbh19',
    leetcode: 'https://leetcode.com/u/risbhh19/',
    codeforces: 'https://codeforces.com/profile/Sensi__',
    codechef: 'https://www.codechef.com/users/risbh_cf',
  },
  resumeUrl: 'assets/Rishabh_Resume.pdf',
  projects: {
    miniredis: {
      title: 'mini-redis',
      category: 'Systems engineering',
      year: '2026',
      number: '01',
      role: 'Project development',
      stack: 'C++17 · Linux epoll · RESP2 · Python',
      summary:
        'A Redis-compatible string key-value server with expiration, exact LRU, snapshots and an append-only log.',
      brief:
        'Explore how a networked store handles protocol parsing, expiry, memory pressure and durable storage.',
      contribution:
        'Implemented a Linux epoll reactor, binary-safe RESP2 parsing and a custom hash table with incremental rehashing.',
      outcome:
        'A local browser dashboard connects to the running server through a Python bridge. The server implements a defined subset of Redis string commands.',
      visualNote: 'Captured from a local run using demo data.',
      link: 'https://github.com/risbh19/mini-redis',
      linkLabel: 'View source',
      demo: '',
    },
    collegeforum: {
      title: 'College Forum',
      category: 'Full-stack web application',
      year: '2026',
      number: '02',
      role: 'Project development',
      stack: 'Next.js · FastAPI · PostgreSQL',
      summary:
        'A campus discussion forum with Google sign-in, pseudonymous usernames, posts, votes and moderation.',
      brief:
        'Give students a place for questions and discussions with a consistent username across boards.',
      contribution:
        'Connected a Next.js frontend to FastAPI and PostgreSQL. Implemented voting, reports and moderation across discussion boards.',
      outcome:
        'Member identities are pseudonymous. The local launcher also supports seeded demo accounts and posts.',
      visualNote: 'Captured from a local run using demo data.',
      link: 'https://github.com/risbh19/college-forum',
      linkLabel: 'View source',
      demo: 'https://college-forum.vercel.app/',
    },
    racesafe: {
      title: 'RaceSafe',
      category: 'Full-stack web application',
      year: '2026',
      number: '03',
      role: 'Project development',
      stack: 'React · FastAPI · PostgreSQL',
      summary:
        'A hackathon team workspace with expiring invites, live updates and database-enforced seat limits.',
      brief: 'Protect the last seat when several participants try to join the same team.',
      contribution:
        'Enforced team capacity and membership rules in PostgreSQL. Implemented idempotent membership requests, expiring invite codes and an event stream.',
      outcome:
        'Participants can recruit teammates, request seats and see team changes as they happen.',
      visualNote: 'Captured from a local run using demo data.',
      link: 'https://github.com/risbh19/racesafe',
      linkLabel: 'View source',
      demo: 'https://racesafe.onrender.com',
    },
    nextup: {
      title: 'NextUp',
      category: 'Clinic operations demo',
      year: '2026',
      number: '04',
      role: 'Project development',
      stack: 'Next.js · FastAPI · PostgreSQL',
      summary:
        'A synthetic clinic demo with transactional bookings, waitlists, live queues and reviewed care tasks.',
      brief:
        'Connect appointment availability, patient check-in and care follow-up across separate patient and staff views.',
      contribution:
        'Built slot-based booking and waitlist promotion, role-scoped appointment and queue views, and a review workflow for care tasks.',
      outcome:
        'The local demo uses seeded clinic data to show the workflow from booking through consultation and reviewed follow-up.',
      visualNote: 'Captured from a local run using demo data.',
      link: 'https://github.com/risbh19/NextUp',
      linkLabel: 'View source',
      demo: '',
    },
    trading: {
      title: 'Paper Trading Engine',
      category: 'Systems engineering',
      year: '2026',
      number: '05',
      role: 'Project development',
      stack: 'C++20 · Python · CSV replay',
      summary:
        'A deterministic paper trading replay with simulated fills, fixed-point accounting and inline risk checks.',
      brief: 'Make fills, costs and risk decisions traceable in a replayable trading simulation.',
      contribution:
        'Implemented C++20 execution and accounting with configurable fees, position and exposure checks, and Python research scripts.',
      outcome:
        'The sample run uses virtual money and writes an audit log and accounting summary. It submits no live broker orders.',
      visualNote: 'Local replay output with simulated funds.',
      link: 'https://github.com/risbh19/trading-bot',
      linkLabel: 'View source',
      demo: '',
    },
    orbit: {
      title: 'Orbit',
      category: 'Desktop application',
      year: '2026',
      number: '06',
      role: 'Project development',
      stack: 'TypeScript · Electron · LSP · PTY',
      summary:
        'An early desktop IDE with a piece-table editor, multi-cursor editing, language-server features and a terminal.',
      brief:
        'Build a text editor from the document model up and connect it to a desktop workbench.',
      contribution:
        'Implemented a piece table, atomic edits and undo, workspace tabs, TypeScript language-server integration and an embedded PTY terminal.',
      outcome:
        'Orbit 0.1 was tested on Windows x64 and supports UTF-8 text files up to 1 MiB. The screenshot shows the local starter workspace.',
      visualNote: 'Captured from a local run using demo data.',
      link: '',
      linkLabel: '',
      demo: '',
    },
    casetrace: {
      title: 'CaseTrace',
      category: 'Training application',
      year: '2026',
      number: '07',
      role: 'Project development',
      stack: 'React · FastAPI · SQLite / PostgreSQL',
      summary:
        'A synthetic investigation workspace for evidence integrity, transfer tracing, legal lookup and supervisory review.',
      brief:
        'Bring evidence, transfer records, references and deadlines into a single training case.',
      contribution:
        'Built evidence hashing and review, a transfer graph, a case checklist and an approval workflow for draft notices.',
      outcome:
        'The workspace runs on synthetic fixtures with simulated notice delivery. The capture shows a seeded money trail.',
      visualNote: 'Captured from a local run using demo data.',
      link: '',
      linkLabel: '',
      demo: '',
    },
  },
};
