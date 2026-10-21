export interface Project {
  title: string;
  desc: string;
  url: string;
  shape: 'tri' | 'circle' | 'square';
}

export const PROFILE = {
  name: 'Bassant',
  first: 'Bassant',
  last: 'Ezzat Farhat',
  role: 'Frontend Developer · Angular',
  lead: 'I build clean, responsive interfaces with Angular and TypeScript, and I lead teams that turn ideas into working products.',
  about: [
    'Recent Information Technology graduate with a Bachelor\'s degree in Computers and Information Technology from the Egyptian E-Learning University, in a joint program with Fayoum University.',
    'I work mainly with Angular and TypeScript, building modern web apps with Signals, zoneless change detection, RxJS, Firebase (Authentication and Firestore) and Vercel serverless proxies, with responsive, unit-tested interfaces.',
    'I lead development teams and integrate Angular applications with REST APIs, with a strong foundation in OOP, databases and problem-solving.',
  ],
  email: 'bassantromilla@gmail.com',
  phone: '01050840531',
  emailLink: 'https://mail.google.com/mail/?view=cm&fs=1&to=bassantromilla@gmail.com&su=Hello%20Bassant',
  whatsapp: 'https://wa.me/201050840531?text=Hello%20Bassant%2C%20I%20saw%20your%20portfolio',
  linkedin: 'https://www.linkedin.com/in/bassant-ezzat-a54117309',
  github: 'https://github.com/BassantEzzat',
};

export const STATS = [
  { value: '6', label: 'projects shipped' },
  { value: '1', label: 'team led' },
  { value: '2026', label: 'IT graduate, Honors' },
];

export const FEATURED = {
  tag: 'Graduation project · 2026',
  title: 'Voyago',
  desc: 'A web-based tourism management and trip planning platform that simplifies planning and booking a trip to Fayoum. I led the team, built the responsive user interfaces and integrated them with the backend team\'s REST APIs, and built a complete admin dashboard with Angular Material, Bootstrap and REST APIs to manage users, bookings, content and system configurations.',
  stack: [
    'Angular 17+',
    'TypeScript',
    'RxJS',
    'Tailwind CSS',
    'Bootstrap',
    'Angular Material',
    'REST APIs',
    'JWT Auth',
    'Cloudinary',
    'Responsive Design',
    'Dark/Light Mode',
    'Git & GitHub',
    'Vercel',
  ],
  url: 'https://voyago-gamma.vercel.app/home',
  features: [
    'Hotels & restaurants',
    'Tourist attractions & tour guides',
    'Bookings & payments',
    'Emergency services & budget planner',
    'Complete admin dashboard for users, bookings, content and system configuration',
    'JWT authentication and Cloudinary',
    'Responsive design with dark/light mode',
    'Integrated with real backend REST APIs',
    'Team workflow on Git & GitHub, deployed on Vercel',
  ],
};

export const PROJECTS: Project[] = [
  {
    title: 'Weather App',
    desc: 'Responsive weather app that fetches data from a weather API and displays live conditions in a clean interface.',
    url: 'https://bassantezzat.github.io/weather/',
    shape: 'circle',
  },
  {
    title: 'Authentication & User Management App',
    desc: 'Responsive client-side authentication flow with login, registration and form validation, with state management and seamless UI integration.',
    url: 'https://auth-app-liard-xi.vercel.app/login',
    shape: 'square',
  },
];

export const SKILLS = [
  {
    title: 'Frontend',
    items: [
      'Angular',
      'Angular Signals',
      'Angular CDK (Drag & Drop)',
      'TypeScript',
      'JavaScript (ES6+)',
      'HTML5',
      'CSS3',
      'SCSS',
      'Bootstrap',
      'Tailwind CSS',
      'Angular Material',
      'RxJS',
      'Reactive Forms',
      'Unit Testing (Vitest)',
      'Dark/Light Theming',
      'Responsive Design',
      'Performance Optimization',
      'Debugging',
    ],
  },
  {
    title: 'Backend & Tools',
    items: [
      'REST APIs',
      'JWT Authentication',
      'Firebase (Authentication, Cloud Firestore, Security Rules)',
      'Cloudinary',
      'Node.js (Beginner)',
      'Git & GitHub',
      'Vercel (Serverless Proxy)',
      'Vitest',
    ],
  },
  {
    title: 'Languages & Core concepts',
    items: [
      'Java',
      'C++',
      'Python (Beginner)',
      'Object-Oriented Programming (OOP)',
      'Database Fundamentals',
    ],
  },
];

export const DEGREE = {
  title: 'B.Sc. Computers & Information Technology',
  sub: 'EELU, joint with Fayoum University · Sep 2022 – Jul 2026',
  note: 'Very Good with Honors · Graduation project: Excellent',
};

export const CERTS = [
  {
    title: 'Frontend Development Diploma',
    sub: 'Route IT Training Center · 2025',
  },
  {
    title: 'Programming Fundamentals Diploma',
    sub: 'Route IT Training Center · 2024',
  },
  {
    title: 'CCNAv7: Introduction to Networks',
    sub: 'Cisco Networking Academy · 2024',
  },
];