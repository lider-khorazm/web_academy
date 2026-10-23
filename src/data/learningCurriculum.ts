export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface LearningStage {
  id: 'html' | 'css' | 'js';
  title: string;
  shortTitle: string;
  description: string;
  color: string;
  w3schoolsUrl: string;
  w3schoolsUzbekUrl: string;
  concepts: {
    name: string;
    description: string;
    codeExample: string;
  }[];
  quiz: QuizQuestion[];
  nextStage?: 'css' | 'js';
}

export interface StudentAccount {
  name: string;
  email: string;
  registeredAt: string;
  currentStage: 'html' | 'css' | 'js';
  completedStages: ('html' | 'css' | 'js')[];
  quizPassed: Record<'html' | 'css' | 'js', boolean>;
  xp?: number;
  gamesCompleted?: number;
  avatar?: string;
  skills?: string[];
  bio?: string;
  city?: string;
  badges?: string[];
}

export const LEARNING_STAGES: Record<'html' | 'css' | 'js', LearningStage> = {
  html: {
    id: 'html',
    title: '1-Bosqich: HTML Asoslari',
    shortTitle: 'HTML',
    description:
      'HTML (HyperText Markup Language) — veb-sahifaning suyagi va tuzilishi. Barcha matnlar, sarlavhalar, rasmlar va formalar HTML teglari orqali yaratiladi.',
    color: '#e34f26',
    w3schoolsUrl: 'https://www.w3schools.com/html/',
    w3schoolsUzbekUrl:
      'https://translate.google.com/translate?sl=en&tl=uz&u=https://www.w3schools.com/html/',
    concepts: [
      {
        name: 'Sarlavha va Matn teglari',
        description: 'Sahifadagi asosiy sarlavhalar va abzaslar uchun ishlatiladi.',
        codeExample: '<h1>Salom, Dunyo!</h1>\n<p>Bu mening birinchi veb-sahifam.</p>',
      },
      {
        name: 'Havolalar va Rasmlar',
        description: 'Boshqa sahifalarga o\'tish va tasvirlarni joylashtirish.',
        codeExample: '<a href="https://w3schools.com">W3Schools ga o\'tish</a>\n<img src="avatar.jpg" alt="Mening rasmim">',
      },
      {
        name: 'Tugmalar va Formalar',
        description: 'Foydalanuvchidan ma\'lumot olish va harakat bajarish.',
        codeExample: '<form>\n  <input type="text" placeholder="Ismingizni yozing">\n  <button type="submit">Yuborish</button>\n</form>',
      },
    ],
    quiz: [
      {
        question: 'HTML da eng katta darajadagi sarlavha qaysi teg orqali yoziladi?',
        options: ['<head>', '<h1>', '<h6>', '<title>'],
        correctIndex: 1,
        explanation: '<h1> tegi eng yuqori darajadagi va eng katta sarlavha hisoblanadi.',
      },
      {
        question: 'Boshqa sahifaga o\'tish uchun qaysi teg ishlatiladi?',
        options: ['<a>', '<link>', '<href>', '<nav>'],
        correctIndex: 0,
        explanation: '<a> (anchor) tegi href atributi bilan birga havolalar yaratadi.',
      },
      {
        question: 'HTML so\'zining to\'liq ma\'nosi nima?',
        options: [
          'HyperText Markup Language',
          'HighText Modern Language',
          'Hyper Transfer Mode Link',
          'Home Tool Markup List',
        ],
        correctIndex: 0,
        explanation: 'HTML — HyperText Markup Language so\'zlarining qisqartmasidir.',
      },
    ],
    nextStage: 'css',
  },
  css: {
    id: 'css',
    title: '2-Bosqich: CSS Bezaklari & Dizayn',
    shortTitle: 'CSS',
    description:
      'CSS (Cascading Style Sheets) — HTML ga go\'zallik, ranglar, shriftlar, joylashuv (layout) va zamonaviy ko\'rinish beradi.',
    color: '#1572b6',
    w3schoolsUrl: 'https://www.w3schools.com/css/',
    w3schoolsUzbekUrl:
      'https://translate.google.com/translate?sl=en&tl=uz&u=https://www.w3schools.com/css/',
    concepts: [
      {
        name: 'Ranglar va Fon',
        description: 'Matn rangi va orqa fonni chiroyli bezash.',
        codeExample: 'h1 {\n  color: #e11d48;\n  background-color: #faf5ff;\n}',
      },
      {
        name: 'Padding va Margin (Masofalar)',
        description: 'Elementlar ichki va tashqi bo\'shliqlarini boshqarish.',
        codeExample: '.card {\n  padding: 20px;\n  margin: 16px auto;\n  border-radius: 12px;\n}',
      },
      {
        name: 'Flexbox Joylashuvi',
        description: 'Elementlarni yonma-yon va markazga qulay joylashtirish.',
        codeExample: '.container {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n}',
      },
    ],
    quiz: [
      {
        question: 'CSS qisqartmasi nimani anglatadi?',
        options: [
          'Cascading Style Sheets',
          'Creative Style Syntax',
          'Computer Screen Styles',
          'Colorful Sheet System',
        ],
        correctIndex: 0,
        explanation: 'CSS — Cascading Style Sheets (Kaskadli uslublar jadvallari).',
      },
      {
        question: 'Elementning orqa fon rangini o\'zgartiruvchi xususiyat qaysi?',
        options: ['bgcolor', 'color', 'background-color', 'font-color'],
        correctIndex: 2,
        explanation: 'background-color xususiyati orqa fon rangini belgilaydi.',
      },
      {
        question: 'Burchaklarni yumaloq qilish uchun qaysi xususiyatdan foydalaniladi?',
        options: ['corner-round', 'border-radius', 'border-style', 'box-round'],
        correctIndex: 1,
        explanation: 'border-radius burchaklarni belgilangan piksellar bo\'yicha yumaloqlaydi.',
      },
    ],
    nextStage: 'js',
  },
  js: {
    id: 'js',
    title: '3-Bosqich: JavaScript Harakatlantiruvchi Miya',
    shortTitle: 'JavaScript',
    description:
      'JavaScript — veb-sahifani jonlantiradi. Tugmalar bosilganda hodisalarni ushlaydi, animatsiyalarni boshqaradi va server bilan bog\'lanadi.',
    color: '#f7df1e',
    w3schoolsUrl: 'https://www.w3schools.com/js/',
    w3schoolsUzbekUrl:
      'https://translate.google.com/translate?sl=en&tl=uz&u=https://www.w3schools.com/js/',
    concepts: [
      {
        name: 'O\'zgaruvchilar va Ma\'lumotlar',
        description: 'Qiymatlarni saqlash va hisoblash.',
        codeExample: 'let ism = "Olimjon";\nconst yosh = 22;\nconsole.log(ism + " " + yosh + " yoshda");',
      },
      {
        name: 'Hodisalar (Events) & Tugma bosilishi',
        description: 'Foydalanuvchi tugmani bosganda ishlaydigan kod.',
        codeExample: 'document.getElementById("myBtn").addEventListener("click", () => {\n  alert("Tugma bosildi!");\n});',
      },
      {
        name: 'DOM Elementlarini O\'zgartirish',
        description: 'Sahifadagi matn va ranglarni dastur orqali o\'zgartirish.',
        codeExample: 'const title = document.querySelector("h1");\ntitle.textContent = "Yangi sarlavha!";\ntitle.style.color = "green";',
      },
    ],
    quiz: [
      {
        question: 'O\'zgaruvchini e\'lon qilish uchun qaysi kalit so\'z ishlatiladi?',
        options: ['variable', 'let yoki const', 'declare', 'vname'],
        correctIndex: 1,
        explanation: 'Zamonaviy JavaScriptda let va const o\'zgaruvchi e\'lon qilishda asosiy vositadir.',
      },
      {
        question: 'HTML elementini ID si orqali topish kodi qaysi?',
        options: [
          'document.getElementById("id")',
          'document.getId("id")',
          'page.findElement("id")',
          'window.selectId("id")',
        ],
        correctIndex: 0,
        explanation: 'document.getElementById() metodi ID bo\'yicha elementni qaytaradi.',
      },
      {
        question: 'Foydalanuvchi tugmani bosganini tinglovchi metod nima?',
        options: ['addEventListener("click", ...)', 'onClickListen()', 'button.press()', 'watchClick()'],
        correctIndex: 0,
        explanation: 'addEventListener("click", callback) hodisani tinglashning standart usulidir.',
      },
    ],
  },
};
