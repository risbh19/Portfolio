/* Profile facts from the supplied résumé and the owner's GitHub profile. */
window.PORTFOLIO = {
  name: 'Rishabh Pal',
  role: 'FULL-STACK DEVELOPER / PROBLEM SOLVER',
  location: 'RKGIT · Ghaziabad, India',
  email: 'palrishabh989@gmail.com',
  intro:
    "I'm Rishabh, a CSE student building **full-stack web applications** with React, Next.js and FastAPI. I practise **data structures and algorithms** in C++ and Python, bringing a problem-solving mindset to the products I build.",
  about:
    "I'm a **CSE student at RKGIT** who enjoys connecting frontend interfaces, REST APIs and databases into useful products. My projects cover authentication, role-based access and real-time workflows. Alongside development, I work on **competitive programming and DSA**, with attention to efficient approaches, complexity and edge cases.",
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
    careflow: {
      title: 'CareFlow',
      category: 'Full-stack · Healthcare',
      year: '2026',
      number: '01',
      role: 'Full-stack development',
      stack: 'Next.js · FastAPI · MongoDB Atlas · JWT · SSE',
      summary:
        'A full-stack hospital workflow prototype connecting Doctor, Nurse and Patient portals through role-based access and real-time updates, using synthetic data.',
      brief:
        'Build a unified hospital workflow with separate Doctor, Nurse and Patient portals, keeping access isolated while shared information stays in sync.',
      contribution:
        'Built the Next.js 14 and FastAPI application on MongoDB Atlas, with JWT-gated role isolation and Server-Sent Events for cross-portal updates. Implemented the doctor-to-nurse task lifecycle, timestamped completion and task immutability after assignment.',
      outcome:
        'Implemented prescriptions mirrored to the Patient portal and an admission-to-discharge history. The prototype uses synthetic data to explore connected workflows across three user roles.',
      visualNote:
        'Original architecture illustration of the project. Product screenshots are still to be added.',
      link: 'https://github.com/risbh19/Careflow',
      linkLabel: 'VIEW SOURCE ON GITHUB',
    },
    wavesafe: {
      title: 'Wave-Safe',
      category: 'Backend · Public safety',
      year: '2026',
      number: '02',
      role: 'Backend & system development',
      stack: 'FastAPI · React · PostgreSQL / PostGIS · Redis · Celery · Docker',
      summary:
        'A coastal safety project connecting a React interface with FastAPI services, hazard signals, geospatial routing and SOS escalation workflows.',
      brief:
        'Connect coastal hazard information with a risk score and a jurisdiction-aware SOS dispatch workflow, including offline queueing and escalation logic.',
      contribution:
        'Built a risk engine combining eight hazard features into a weighted logistic Safe / Caution / Unsafe score, with hard overrides for tsunami and storm-surge alerts. Integrated INCOIS, SACHET CAP and Open-Meteo connectors with Redis deduplication.',
      outcome:
        'Implemented a 12-state SOS dispatch model, PostGIS routing to eight responder roles, and Celery-driven escalation to a 112 fallback. The backend includes 60+ REST endpoints, OTP and JWT authentication, offline SOS queueing, and ten containerised services.',
      visualNote: 'WaveSafe homepage screenshot supplied by the project owner.',
      link: 'https://github.com/risbh19/waveSafe',
      linkLabel: 'VIEW SOURCE (PRIVATE REPOSITORY)',
    },
  },
};
