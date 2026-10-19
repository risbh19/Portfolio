/* Facts from the supplied résumé; internship dates corrected by the owner. */
window.PORTFOLIO = {
  name: 'Rishabh Pal',
  role: 'CSE STUDENT / SOFTWARE DEVELOPER',
  location: 'RKGIT · Ghaziabad, India',
  email: 'palrishabh989@gmail.com',
  intro:
    'I’m Rishabh, a Computer Science student building full-stack applications with Python, FastAPI and React.',
  about:
    'I build applications that connect people and information, from healthcare workflows to coastal safety systems. My testing experience shapes how I approach APIs, edge cases and reliable software.',
  status: 'B.Tech CSE student · RKGIT',
  focus: 'Full-stack development & API testing',
  socials: {
    linkedin: 'https://linkedin.com/in/rishabhpal19',
    github: 'https://github.com/risbh19',
  },
  resumeUrl: 'assets/Rishabh_Resume.pdf',
  projects: {
    careflow: {
      title: 'CareFlow',
      category: 'Full-stack · Healthcare',
      year: '2026',
      number: '01',
      role: 'Full-stack development',
      stack: 'Next.js 14 · FastAPI · MongoDB Atlas · JWT · Groq · SSE',
      summary:
        'A hospital management platform connecting Doctor, Nurse and Patient portals through role-based access and real-time updates.',
      brief:
        'Build a unified hospital workflow with separate Doctor, Nurse and Patient portals, keeping access isolated while shared information stays in sync.',
      contribution:
        'Built the Next.js 14 and FastAPI application on MongoDB Atlas, with JWT-gated role isolation and Server-Sent Events for cross-portal updates. Implemented the doctor-to-nurse task lifecycle, timestamped completion and task immutability after assignment.',
      outcome:
        'The implementation includes paperless prescriptions mirrored to the Patient portal, admission-to-discharge history, and Llama 3.1 8B integration through Groq for clinical logic.',
      visualNote:
        'Original architecture illustration of the project. Product screenshots are still to be added.',
      link: '',
      linkLabel: 'VIEW SOURCE',
    },
    wavesafe: {
      title: 'Wave-Safe',
      category: 'Backend · Public safety',
      year: '2026',
      number: '02',
      role: 'Backend & system development',
      stack: 'FastAPI · React · PostgreSQL / PostGIS · Redis · Celery · Docker',
      summary:
        'A coastal risk and SOS system bringing hazard signals, geospatial routing and escalation workflows into one platform.',
      brief:
        'Connect coastal hazard information with a risk score and a jurisdiction-aware SOS dispatch workflow, including offline queueing and escalation logic.',
      contribution:
        'Built a risk engine combining eight hazard features into a weighted logistic Safe / Caution / Unsafe score, with hard overrides for tsunami and storm-surge alerts. Integrated INCOIS, SACHET CAP and Open-Meteo connectors with Redis deduplication.',
      outcome:
        'Implemented a 12-state SOS dispatch model, PostGIS routing to eight responder roles, and Celery-driven escalation to a 112 fallback. The backend includes 60+ REST endpoints, OTP and JWT authentication, offline SOS queueing, and ten containerised services.',
      visualNote:
        'Original system illustration of the project. Product screenshots are still to be added.',
      link: 'https://github.com/risbh19/waveSafe',
      linkLabel: 'VIEW SOURCE ON GITHUB',
    },
  },
};
