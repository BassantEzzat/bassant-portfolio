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
    'Recent Information Technology graduate from the Egyptian E-Learning University, in a joint program with Fayoum University.',
    'I work mainly with Angular, TypeScript and modern CSS, and I enjoy connecting interfaces to REST APIs.',
    'I like clear structure, geometric shapes and simple layouts that feel calm and easy to use.',
    'Strong in OOP, databases and problem-solving, and comfortable leading a team.',
  ],
  email: 'bassantromilla@gmail.com',
  phone: '01050840531',
  emailLink: 'https://mail.google.com/mail/?view=cm&fs=1&to=bassantromilla@gmail.com&su=Hello%20Bassant',
  whatsapp: 'https://wa.me/201050840531?text=Hello%20Bassant%2C%20I%20saw%20your%20portfolio',
  linkedin: 'https://www.linkedin.com/in/bassant-ezzat-a54117309',
  github: 'https://github.com/BassantEzzat',
};

export const STATS = [
  { value: '4+', label: 'projects shipped' },
  { value: '1', label: 'team led' },
  { value: '2026', label: 'IT graduate, Honors' },
];

export const FEATURED = {
  tag: 'Graduation project · 2026',
  title: 'Voyago',
  desc: 'A tourism management and trip planning platform that simplifies planning and booking a trip to Fayoum. I led the team and built the frontend.',
  stack: ['Angular', 'TypeScript', 'Tailwind', 'Bootstrap', 'Angular Material', 'REST APIs'],
  url: 'https://voyago-gamma.vercel.app/home',
  features: [
    'Hotels & restaurants',
    'Attractions & tour guides',
    'Bookings & payments',
    'Emergency services & budget planner',
  ],
};

export const PROJECTS: Project[] = [
  {
    title: 'Angular Web App',
    desc: 'Reusable, responsive, component-based interfaces built with Angular and TypeScript.',
    url: 'https://angular-app-iota-two.vercel.app/#/home',
    shape: 'tri',
  },
  {
    title: 'Weather App',
    desc: 'Responsive weather app that pulls live data from an API and shows it in a friendly layout.',
    url: 'https://bassantezzat.github.io/weather/',
    shape: 'circle',
  },
  {
    title: 'Login System',
    desc: 'Responsive login interface with form handling and client-side validation.',
    url: 'https://bassantezzat.github.io/login-system/',
    shape: 'square',
  },
];

export const SKILLS = [
  { title: 'Frontend', items: ['Angular', 'TypeScript', 'JavaScript', 'HTML5', 'CSS3', 'Bootstrap', 'Tailwind CSS', 'Angular Material', 'Responsive Design'] },
  { title: 'Engineering', items: ['OOP', 'REST APIs', 'Git & GitHub', 'Databases', 'Debugging', 'Cross-browser', 'Performance'] },
  { title: 'Also learning', items: ['Java', 'C++', 'Python', 'Node.js', 'Backend fundamentals'] },
];

export const DEGREE = {
  title: 'B.Sc. Computers & Information Technology',
  sub: 'EELU, joint with Fayoum University · 2022 – 2026',
  note: 'Very Good with Honors · Graduation project: Excellent',
};

export const CERTS = [
  { title: 'Frontend Development Diploma', sub: 'Route IT Training Center · 2025' },
  { title: 'Programming Fundamentals Diploma', sub: 'Route IT Training Center · 2024' },
  { title: 'CCNAv7: Introduction to Networks', sub: 'Cisco Networking Academy · 2024' },
];