export interface Contributor {
  id: string;
  name: string;
  role: string;
  city: string;
  contribution: string;
  avatarUrl: string;
  telegram?: string;
  skills: string[];
}

export interface StudentProject {
  id: string;
  studentName: string;
  studentEmail: string;
  studentCity: string;
  title: string;
  description: string;
  category: 'HTML & CSS' | 'Portfolio Vizitka' | 'Tanishuv Kartasi' | 'Interaktiv JS';
  htmlPreviewSnippet: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  likes: number;
  featured?: boolean;
}

export const CONTRIBUTORS: Contributor[] = [
  {
    id: 'c1',
    name: 'Olimjon Alijonov',
    role: 'Bosh Arxitektor & Tanishuv.uz Asoschisi',
    city: 'Toshkent',
    contribution: "Platforma arxitekturasi, ta'lim yo'nalishi va to'liq veb-tizim konsepsiyasining asoschisi.",
    avatarUrl: '/src/assets/images/profile_avatar_jasur_1792214060594.jpg',
    telegram: 'olimjon_lead',
    skills: ['Tizim arxitekturasi', 'Full-stack (React & Node)', 'Metodika'],
  },
  {
    id: 'c2',
    name: 'Umirbek Matyoqubov',
    role: 'Backend Muhandisi (Python & Django)',
    city: 'Xorazm / Toshkent',
    contribution: "Backend arxitekturasi, server API integratsiyalari va ma'lumotlar xavfsizligi mutaxassisi.",
    avatarUrl: '/src/assets/images/profile_avatar_umirbek_1792220404248.jpg',
    telegram: 'umirbek_dev',
    skills: ['Python', 'Django', 'REST API', 'PostgreSQL'],
  },
  {
    id: 'c3',
    name: 'Sardorbek Alimov',
    role: 'Frontend Muhandisi & SCSS Mutaxassisi',
    city: 'Samarqand / Toshkent',
    contribution: 'Zamonaviy interfeys komponentlari, SCSS/Bootstrap dizaynlari va W3Schools ta\'lim yo\'lakchasi.',
    avatarUrl: '/src/assets/images/profile_avatar_sardor_1792220406197.jpg',
    telegram: 'sardor_frontend',
    skills: ['HTML5/CSS3', 'SCSS', 'Bootstrap 5', 'JavaScript'],
  },
  {
    id: 'c4',
    name: 'Muhriddin Qodirov',
    role: 'UI/UX & Interaktiv JS Dasturchi',
    city: "Farg'ona / Toshkent",
    contribution: 'Mobil moslashuvchanlik, interaktiv kod o\'yinlari va test tizimi modullarini ishlab chiquvchi.',
    avatarUrl: '/src/assets/images/profile_avatar_muhriddin_1792220405551.jpg',
    telegram: 'muhriddin_code',
    skills: ['JavaScript ES6+', 'UI/UX Dizayn', 'Mobil moslashuvchanlik'],
  },
];

export const INITIAL_STUDENT_PROJECTS: StudentProject[] = [
  {
    id: 'p1',
    studentName: 'Sardorbek Rahimov',
    studentEmail: 'sardorbek@student.uz',
    studentCity: 'Samarqand',
    title: 'Sokin Qahvaxona Tanishuv Kartasi',
    description: 'Qahvaxonalar va kitobxonlar uchun yaratilgan zamonaviy vizitka profili. Flexbox va CSS animatsiyalari qo\'llanilgan.',
    category: 'Tanishuv Kartasi',
    htmlPreviewSnippet: `<div style="padding:20px; background:#fff7ed; border:1px solid #ffedd5; border-radius:16px; font-family:sans-serif;">
  <h3 style="color:#c2410c; margin:0 0 6px;">☕ Sardorbek, 23</h3>
  <p style="color:#78350f; font-size:13px; margin:0 0 12px;">Samarqand · Kitob mutolaasi & Qahva san'ati</p>
  <p style="font-size:14px; color:#431407; line-height:1.5;">Har bir yaxshi suhbat bir piyola issiq qahva bilan boshlanadi.</p>
</div>`,
    status: 'approved',
    submittedAt: '12-Oktabr, 2026',
    likes: 38,
    featured: true,
  },
  {
    id: 'p2',
    studentName: 'Madina Yo\'ldosheva',
    studentEmail: 'madina@student.uz',
    studentCity: 'Farg\'ona',
    title: 'Kitobsevar Shaxsiy Portfolio Sahifasi',
    description: 'Akademiyada HTML va CSS kursini tugatgandan so\'ng yaratilgan birinchi mustaqil portfolio ishi.',
    category: 'Portfolio Vizitka',
    htmlPreviewSnippet: `<div style="padding:20px; background:#f0fdf4; border:1px solid #bbf7d0; border-radius:16px; font-family:sans-serif;">
  <h3 style="color:#15803d; margin:0 0 6px;">📚 Madina Yo'ldosheva</h3>
  <p style="color:#166534; font-size:13px; margin:0 0 12px;">Junior Frontend Dasturchi · Farg'ona</p>
  <p style="font-size:14px; color:#14532d; line-height:1.5;">HTML va CSS orqali ilk veb-sahifamni mustaqil yaratdim!</p>
</div>`,
    status: 'approved',
    submittedAt: '14-Oktabr, 2026',
    likes: 45,
    featured: true,
  },
  {
    id: 'p3',
    studentName: 'Bobur Mirzayev',
    studentEmail: 'bobur@student.uz',
    studentCity: 'Andijon',
    title: 'Interaktiv Mini Hisoblagichli Vizitka',
    description: 'JavaScript hodisalaridan foydalanib, foydalanuvchi bilan jonli muloqot qiluvchi profil.',
    category: 'Interaktiv JS',
    htmlPreviewSnippet: `<div style="padding:20px; background:#eff6ff; border:1px solid #bfdbfe; border-radius:16px; font-family:sans-serif;">
  <h3 style="color:#1d4ed8; margin:0 0 6px;">⚡ Bobur Mirzayev</h3>
  <p style="color:#1e40af; font-size:13px; margin:0 0 12px;">Andijon · JavaScript ixlosmandi</p>
  <button style="padding:8px 16px; background:#2563eb; color:#fff; border:none; border-radius:8px; cursor:pointer;">Salom berish</button>
</div>`,
    status: 'approved',
    submittedAt: '15-Oktabr, 2026',
    likes: 29,
    featured: false,
  },
  {
    id: 'p4',
    studentName: 'Kamola Oripova',
    studentEmail: 'kamola@student.uz',
    studentCity: 'Buxoro',
    title: 'Tarixiy Shahar Sayohat Portfoliosi',
    description: 'Buxoro shahrining me\'moriy go\'zalligini namoyish qiluvchi shaxsiy foto-portfolio sahifasi.',
    category: 'Portfolio Vizitka',
    htmlPreviewSnippet: `<div style="padding:20px; background:#faf5ff; border:1px solid #e9d5ff; border-radius:16px; font-family:sans-serif;">
  <h3 style="color:#7e22ce; margin:0 0 6px;">🏛️ Kamola Oripova</h3>
  <p style="color:#6b21a8; font-size:13px; margin:0 0 12px;">Buxoro · Foto-hujjatlashtirish va sayohat</p>
  <p style="font-size:14px; color:#581c87; line-height:1.5;">Qadimiy obidalar va zamonaviy veb-estetika uyg'unligi.</p>
</div>`,
    status: 'pending',
    submittedAt: 'Hozirgina',
    likes: 12,
    featured: false,
  },
];
