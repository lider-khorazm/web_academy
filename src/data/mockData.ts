import { Teacher, Student, Lesson, TestQuestion, OwnerProfile } from '../types';

export const OWNER_PROFILE: OwnerProfile = {
  name: 'Olimjon Alimjonov',
  username: 'lord_o1',
  roleTitle: 'Platform Asoschisi & Bosh Arxitektor (Owner)',
  avatar: '',
  bio: "Salom! Men Olimjon Alimjonov (Lord). Veb-texnologiyalar, murakkab ta'lim tizimlari va avtomatlashtirish ishqiboziman. Bo'sh vaqtimda bir finjon issiq qahva ustida yangi g'oyalar yaratish, Frontend dizaynini mukammallashtirish, Python orqali aqlli algoritmlar tuzish va sevimli animelarni tomosha qilish men uchun eng katta ilhom manbaidir.",
  interests: [
    '☕ Qahva ichishni yaxshi ko\'radi',
    '💻 Frontend (React, TypeScript, CSS UI)',
    '🐍 Python & Algoritmlar',
    '🎌 Anime & Manga San\'ati',
    '⚡ Toza va Tezkor Arxitektura',
  ],
  quote: "Kod yozish — bu san'at, qahva esa uning yoqilg'isi!",
};

export const OWNER_CREDENTIALS = {
  username: 'lord_o1',
  password: 'lord_2012',
};

// FOYDALANUVCHI TALABI: "ustozlarni olib tshla men o'zim qo'shaman" -> Boshlang'ich ustozlar bo'sh, faqat Admin (Owner) o'zi qo'shadi!
export const INITIAL_TEACHERS: Teacher[] = [];

// FOYDALANUVCHI TALABI: "hamma o'quvchini olib tashla" -> Boshlang'ich talabalar bo'sh, faqat yangi ro'yxatdan o'tganlar bo'ladi!
export const INITIAL_STUDENTS: Student[] = [];

export const LESSONS: Lesson[] = [
  // HTML (1-bosqich)
  {
    id: 'l-html-1',
    stage: 'html',
    title: '1. HTML asoslari va Teglar tuzilishi',
    duration: '20 daqiqa',
    xpReward: 100,
    summary: "HTML (HyperText Markup Language) — veb sahifalarning skeleti. Hujjat strukturasi <!DOCTYPE html>, <html>, <head> va <body> teglari.",
    codeExample: `<!DOCTYPE html>
<html>
  <head>
    <title>Mening Birinchi Sahifam</title>
  </head>
  <body>
    <h1>Salom, Dunyo!</h1>
    <p>Men DevMaster akademiyasida HTML o'rganmoqdaman.</p>
  </body>
</html>`,
    practiceTask: "<body> ichida bitta <h1> sarlavha va <p> matn yozing.",
    starterCode: `<h1>Dasturchi</h1>\n<p>HTML o'rganishni boshladim</p>`,
    solutionKeyword: '<h1>',
  },
  {
    id: 'l-html-2',
    stage: 'html',
    title: '2. Matn formatlash va Havolalar (<a>)',
    duration: '25 daqiqa',
    xpReward: 120,
    summary: "Matnlarni qalin (<b>, <strong>), kursiv (<i>, <em>) qilish va <a href=\"...\"> tegi yordamida sahifalarni bir-biriga bog'lash.",
    codeExample: `<p>Dasturlash <strong>juda qiziq</strong> va <em>foydali</em> soha.</p>
<a href="https://google.com" target="_blank">Google qidiruv</a>`,
    practiceTask: "<a> tegidan foydalanib havola yarating.",
    starterCode: `<a href="https://example.com">Saytga o'tish</a>`,
    solutionKeyword: '<a',
  },
  {
    id: 'l-html-3',
    stage: 'html',
    title: '3. Rasmlar (<img>) va Ro\'yxatlar (<ul>, <ol>)',
    duration: '30 daqiqa',
    xpReward: 130,
    summary: "Saytga rasm joylash uchun <img src=\"...\" alt=\"...\"> tegi, tartibli (<ol>) va tartibsiz (<ul>) ro'yxatlar bilan ishlash.",
    codeExample: `<img src="logo.png" alt="DevMaster logotipi" width="200" />
<ul>
  <li>HTML</li>
  <li>CSS</li>
  <li>JavaScript</li>
</ul>`,
    practiceTask: "<ul> ro'yxat ichida 3 ta <li> element yarating.",
    starterCode: `<ul>\n  <li>HTML</li>\n  <li>CSS</li>\n  <li>JS</li>\n</ul>`,
    solutionKeyword: '<ul>',
  },
  {
    id: 'l-html-4',
    stage: 'html',
    title: '4. Jadvallar (<table>) va Ma\'lumotlar tartibi',
    duration: '35 daqiqa',
    xpReward: 140,
    summary: "Jadvallar yaratish: <table>, <tr> (qator), <th> (ustun sarlavhasi) va <td> (katakcha ma'lumoti).",
    codeExample: `<table border="1">
  <tr>
    <th>Ism</th>
    <th>Ball</th>
  </tr>
  <tr>
    <td>Olimjon</td>
    <td>98</td>
  </tr>
</table>`,
    practiceTask: "<table> tegi orqali 2 qatorli jadval tuzing.",
    starterCode: `<table>\n  <tr><th>Ism</th><th>Kasb</th></tr>\n  <tr><td>Ali</td><td>Dev</td></tr>\n</table>`,
    solutionKeyword: '<table>',
  },
  {
    id: 'l-html-5',
    stage: 'html',
    title: '5. Shakllar (<form>) va Kiritish maydonlari',
    duration: '40 daqiqa',
    xpReward: 160,
    summary: "Foydalanuvchi ma'lumotlarini qabul qilish: <form>, <input>, <textarea>, <button> va <select> boshqaruvi.",
    codeExample: `<form>
  <label>Ismingiz:</label>
  <input type="text" placeholder="Ism kiriting" required />
  <button type="submit">Yuborish</button>
</form>`,
    practiceTask: "Ism va email uchun ikkita input va bitta button yozing.",
    starterCode: `<form>\n  <input type="text" placeholder="Ism" />\n  <button>Yuborish</button>\n</form>`,
    solutionKeyword: '<form',
  },

  // CSS (2-bosqich)
  {
    id: 'l-css-1',
    stage: 'css',
    title: '1. CSS Selektorlar va Ranglar',
    duration: '25 daqiqa',
    xpReward: 150,
    summary: 'Elementlarni tanlash: tag selektor, class (.nomi), id (#nomi). Ranglar: hex, rgb, hsl.',
    codeExample: `/* Class va ID */
.card {
  background-color: #1e293b;
  color: #38bdf8;
  padding: 16px;
  border-radius: 8px;
}`,
    practiceTask: ".box klassiga fon rangi va matn rangini bering.",
    starterCode: `.box {\n  background: #0f172a;\n  color: #38bdf8;\n}`,
    solutionKeyword: 'background',
  },
  {
    id: 'l-css-2',
    stage: 'css',
    title: '2. Box Model (Padding, Margin, Border)',
    duration: '30 daqiqa',
    xpReward: 160,
    summary: "Har bir HTML element quti (box) dir: content, padding (ichki masofa), border (chegara) va margin (tashqi masofa).",
    codeExample: `.item {
  box-sizing: border-box;
  margin: 20px auto;
  padding: 24px;
  border: 2px solid #6366f1;
}`,
    practiceTask: "Margin va padding xossalarini kiriting.",
    starterCode: `.card {\n  margin: 10px;\n  padding: 15px;\n}`,
    solutionKeyword: 'padding',
  },
  {
    id: 'l-css-3',
    stage: 'css',
    title: '3. Flexbox zamonaviy joylashuv tizimi',
    duration: '40 daqiqa',
    xpReward: 180,
    summary: "Display: flex, justify-content, align-items, flex-direction yordamida elementlarni oson markazlashtirish va tekislash.",
    codeExample: `.container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}`,
    practiceTask: "display: flex va justify-content: center yozing.",
    starterCode: `.row {\n  display: flex;\n  justify-content: center;\n}`,
    solutionKeyword: 'flex',
  },
  {
    id: 'l-css-4',
    stage: 'css',
    title: '4. CSS Grid va Murakkab kartalar',
    duration: '45 daqiqa',
    xpReward: 200,
    summary: "Grid — 2 o'lchamli (ustun va qator) tartiblash. grid-template-columns: repeat(3, 1fr) va gap xususiyati.",
    codeExample: `.grid-gallery {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}`,
    practiceTask: "display: grid va grid-template-columns yarating.",
    starterCode: `.grid {\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n}`,
    solutionKeyword: 'grid',
  },
  {
    id: 'l-css-5',
    stage: 'css',
    title: '5. Responsive dizayn (@media query) & Animatsiyalar',
    duration: '50 daqiqa',
    xpReward: 220,
    summary: "Mobil va planshet moslashuvchanligi: @media (max-width: 768px), transition va @keyframes animatsiyalari.",
    codeExample: `@media (max-width: 768px) {
  .container {
    flex-direction: column;
  }
}
.btn:hover {
  transform: translateY(-2px);
  transition: all 0.2s ease;
}`,
    practiceTask: "@media query bilan kichik ekranlar uchun qoida yozing.",
    starterCode: `@media (max-width: 600px) {\n  body { font-size: 14px; }\n}`,
    solutionKeyword: '@media',
  },

  // JavaScript (3-bosqich)
  {
    id: 'l-js-1',
    stage: 'javascript',
    title: "1. O'zgaruvchilar, Ma'lumot turlari va Operatorlar",
    duration: '30 daqiqa',
    xpReward: 180,
    summary: "let, const, var. String, Number, Boolean, Null, Undefined, Object. Arifmetik va solishtirish operatorlari.",
    codeExample: `const academy = "DevMaster";
let studentsCount = 15;
let isActive = true;

let total = studentsCount + 5;
console.log(academy + " o'quvchilari soni: " + total);`,
    practiceTask: "const va let orqali o'zgaruvchi e'lon qiling va console.log qiling.",
    starterCode: `const name = "Olimjon";\nlet xp = 500;\nconsole.log(name, xp);`,
    solutionKeyword: 'console.log',
  },
  {
    id: 'l-js-2',
    stage: 'javascript',
    title: "2. Shart operatorlari va Sikllar (if/else, for)",
    duration: '35 daqiqa',
    xpReward: 200,
    summary: "if, else if, else, ternary operator (? :). for, while sikllari orqali ma'lumotlarni qayta ishlash.",
    codeExample: `const score = 85;
if (score >= 90) {
  console.log("A'lo daraja! 🏆");
} else if (score >= 70) {
  console.log("Yaxshi o'tdingiz 👍");
} else {
  console.log("Qayta urinib ko'ring");
}`,
    practiceTask: "if-else orqali ballni tekshiruvchi kod yozing.",
    starterCode: `let ball = 95;\nif (ball > 80) {\n  console.log("Muvaffaqiyatli");\n}`,
    solutionKeyword: 'if',
  },
  {
    id: 'l-js-3',
    stage: 'javascript',
    title: "3. Funksiyalar va Arrow Functions",
    duration: '40 daqiqa',
    xpReward: 220,
    summary: "function e'lon qilish, parametrlar qabul qilish va natijani return qilish. ES6 Arrow function: (a, b) => a + b.",
    codeExample: `// Arrow function
const hisoblaXP = (darslar, bonus) => {
  return (darslar * 100) + bonus;
};

const meningXP = hisoblaXP(5, 50);
console.log("Jami XP:", meningXP);`,
    practiceTask: "Ikkita sonni ko'paytiruvchi arrow function yozing.",
    starterCode: `const multiply = (x, y) => x * y;\nconsole.log(multiply(4, 5));`,
    solutionKeyword: '=>',
  },
  {
    id: 'l-js-4',
    stage: 'javascript',
    title: "4. Massivlar (Arrays) va Obyektlar (Objects)",
    duration: '45 daqiqa',
    xpReward: 250,
    summary: "Massiv metodlari: map, filter, find, reduce. Obyekt kalit-qiymat tuzilishi va destrukturizatsiya.",
    codeExample: `const talabalar = [
  { ism: "Ali", xp: 500 },
  { ism: "Vali", xp: 800 },
  { ism: "G'ani", xp: 1200 }
];

const saralangan = talabalar.filter(t => t.xp > 600);
console.log(saralangan);`,
    practiceTask: "filter yoki map metodidan foydalaning.",
    starterCode: `const numbers = [1, 2, 3, 4];\nconst doubled = numbers.map(n => n * 2);`,
    solutionKeyword: 'map',
  },
  {
    id: 'l-js-5',
    stage: 'javascript',
    title: "5. DOM bilan ishlash va Hodisalar (Events)",
    duration: '50 daqiqa',
    xpReward: 300,
    summary: "document.querySelector, addEventListener(\"click\"), elementlar yaratish va sahifani dinamik jonlantirish.",
    codeExample: `const button = document.querySelector("#testBtn");
button.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  alert("Test boshlandi!");
});`,
    practiceTask: "addEventListener yordamida hodisani eshiting.",
    starterCode: `document.addEventListener("DOMContentLoaded", () => {\n  console.log("Sahifa yuklandi");\n});`,
    solutionKeyword: 'addEventListener',
  },
];

// Savollar banki (Test Generator uchun)
export const QUESTION_BANK: Record<'html' | 'css' | 'javascript', TestQuestion[]> = {
  html: [
    {
      id: 'q-h1',
      question: "HTML da eng katta o'lchamdagi sarlavha qaysi teg orqali yaratiladi?",
      options: ['<heading>', '<h6>', '<h1>', '<head>'],
      correctAnswerIndex: 2,
      explanation: "<h1> tegi HTML dagi 1-darajali eng muhim va eng katta sarlavhadir.",
      points: 10,
    },
    {
      id: 'q-h2',
      question: "Qaysi HTML tegi boshqa veb-sahifaga havola (link) yaratish uchun ishlatiladi?",
      options: ['<link>', '<a>', '<href>', '<url>'],
      correctAnswerIndex: 1,
      explanation: "<a> (anchor) tegi href atributi bilan giperhavolalar yaratadi.",
      points: 10,
    },
    {
      id: 'q-h3',
      question: "HTML5 da sahifaning yuqori qismini semantik belgilash uchun qaysi teg ishlatiladi?",
      options: ['<top>', '<header>', '<head>', '<navbar>'],
      correctAnswerIndex: 1,
      explanation: "<header> tegi semantik jihatdan sahifa yoki bo'lim kirish qismini bildiradi.",
      points: 10,
    },
    {
      id: 'q-h4',
      question: "Rasm yuklanmay qolganda uning o'rnida chiquvchi tavsif matni qaysi atributda beriladi?",
      options: ['title', 'src', 'alt', 'desc'],
      correctAnswerIndex: 2,
      explanation: "alt (alternative text) atributi rasm ko'rinmaganda yoki ko'zi ojizlar ekranni o'qiganda o'qiladi.",
      points: 10,
    },
    {
      id: 'q-h5',
      question: "Tartiblangan (raqamlangan) ro'yxat qaysi teg bilan boshlanadi?",
      options: ['<ul>', '<ol>', '<li>', '<list>'],
      correctAnswerIndex: 1,
      explanation: "<ol> — Ordered List (tartiblangan ro'yxat), <ul> esa tartibsiz ro'yxat.",
      points: 10,
    },
    {
      id: 'q-h6',
      question: "Matn kiritish maydonida foydalanuvchi biror narsa yozishi shartligini qaysi atribut bildiradi?",
      options: ['important', 'must-fill', 'required', 'validate'],
      correctAnswerIndex: 2,
      explanation: "required atributi forma jo'natilishidan oldin maydon to'ldirilishi shartligini tekshiradi.",
      points: 10,
    },
    {
      id: 'q-h7',
      question: "Yangi qatorga tushirish (line break) uchun qaysi toq teg ishlatiladi?",
      options: ['<lb>', '<break>', '<br>', '<hr>'],
      correctAnswerIndex: 2,
      explanation: "<br> tegi matnni keyingi qatorga ko'chiradi va yopilish tegi talab qilmaydi.",
      points: 10,
    },
    {
      id: 'q-h8',
      question: "HTML jadvalida ma'lumotlar katakchasi qaysi teg bilan belgilanadi?",
      options: ['<tr>', '<th>', '<td>', '<tc>'],
      correctAnswerIndex: 2,
      explanation: "<td> (table data) oddiy katakcha ma'lumotini anglatadi.",
      points: 10,
    },
  ],
  css: [
    {
      id: 'q-c1',
      question: "CSS da class selektori qanday belgi bilan boshlanadi?",
      options: ['# (panjara)', '. (nuqta)', '$ (dollar)', '@ (kuchukcha)'],
      correctAnswerIndex: 1,
      explanation: "Class nomi oldiga nuqta qo'yiladi (masalan, .button). ID oldiga esa # qo'yiladi.",
      points: 10,
    },
    {
      id: 'q-c2',
      question: "Flexboxda elementlarni asosiy o'q bo'yicha markazga qo'yish uchun qaysi xususiyat beriladi?",
      options: ['align-items: center;', 'justify-content: center;', 'text-align: center;', 'margin: auto;'],
      correctAnswerIndex: 1,
      explanation: "justify-content asosiy o'q (main axis) bo'yicha elementlarni boshqaradi.",
      points: 10,
    },
    {
      id: 'q-c3',
      question: "Elementning ichki masofasi (chegara bilan kontent orasidagi) nima deyiladi?",
      options: ['margin', 'border', 'padding', 'spacing'],
      correctAnswerIndex: 2,
      explanation: "Padding — ichki masofa, Margin — tashqi qo'shni elementlar orasidagi masofa.",
      points: 10,
    },
    {
      id: 'q-c4',
      question: "Elementni butun ekran o'lchamiga nisbatan harakatsiz (scroll qilganda ham joyida turadigan) qilish uchun qaysi position beriladi?",
      options: ['position: relative;', 'position: absolute;', 'position: fixed;', 'position: static;'],
      correctAnswerIndex: 2,
      explanation: "position: fixed butun viewport oynasiga nisbatan qotirilgan joylashuvni hosil qiladi.",
      points: 10,
    },
    {
      id: 'q-c5',
      question: "Mobil moslashuvchanlik (Responsive) yaratishda qaysi CSS qoidasi ishlatiladi?",
      options: ['@responsive', '@media', '@screen', '@viewport'],
      correctAnswerIndex: 1,
      explanation: "@media screen and (max-width: ...) orqali ekran kengligiga qarab stillar beriladi.",
      points: 10,
    },
    {
      id: 'q-c6',
      question: "CSS Gridda ustunlarni 3 ta teng qismga bo'lishning to'g'ri usuli qaysi?",
      options: ['grid-columns: 33% 33% 33%;', 'grid-template-columns: repeat(3, 1fr);', 'display: grid(3);', 'grid-width: 3fr;'],
      correctAnswerIndex: 1,
      explanation: "grid-template-columns: repeat(3, 1fr); 3 ta teng fraksiyali ustun ochadi.",
      points: 10,
    },
    {
      id: 'q-c7',
      question: "Elementning shaffoflik darajasi qaysi xususiyat orqali o'rnatiladi?",
      options: ['visibility', 'transparent', 'opacity', 'filter'],
      correctAnswerIndex: 2,
      explanation: "opacity 0 dan 1 gacha bo'lgan qiymatlarni qabul qilib shaffoflikni belgilaydi.",
      points: 10,
    },
    {
      id: 'q-c8',
      question: "Element ustiga sichqoncha kelgandagi holatini ifodalovchi psevdo-klass qaysi?",
      options: [':focus', ':active', ':hover', ':visited'],
      correctAnswerIndex: 2,
      explanation: ":hover sichqoncha kursor element ustiga borganda faollashadi.",
      points: 10,
    },
  ],
  javascript: [
    {
      id: 'q-j1',
      question: "JavaScriptda qayta qiymat berib bo'lmaydigan (o'zgarmas) o'zgaruvchi qaysi kalit so'z bilan e'lon qilinadi?",
      options: ['let', 'var', 'const', 'immutable'],
      correctAnswerIndex: 2,
      explanation: "const o'zgaruvchisiga bir marta qiymat beriladi va uni qayta o'zgartirib bo'lmaydi.",
      points: 10,
    },
    {
      id: 'q-j2',
      question: 'Quyidagi ifodaning natijasi nima bo\'ladi: typeof ("42" + 8)?',
      options: ['"number"', '"string"', '"NaN"', '"undefined"'],
      correctAnswerIndex: 1,
      explanation: '"42" + 8 amali satrli qo\'shish (concatenation) bo\'lib "428" satrini hosil qiladi, uning typeof qiymati "string".',
      points: 10,
    },
    {
      id: 'q-j3',
      question: "Massivdagi har bir elementni o'zgartirib yangi massiv qaytaruvchi metod qaysi?",
      options: ['forEach()', 'filter()', 'map()', 'reduce()'],
      correctAnswerIndex: 2,
      explanation: "map() massivdagi har bir elementni transformatsiya qilib yangi massiv hosil qiladi.",
      points: 10,
    },
    {
      id: 'q-j4',
      question: "Qat'iy tenglik operatori (turi va qiymatini bir vaqtda tekshiruvchi) qaysi?",
      options: ['==', '===', '=', '!==='],
      correctAnswerIndex: 1,
      explanation: "=== operatori type coercion qilmasdan ham turini, ham qiymatini qat'iy tekshiradi.",
      points: 10,
    },
    {
      id: 'q-j5',
      question: "HTML hujjatidan bitta elementni CSS selektori orqali topish uchun eng mos metod qaysi?",
      options: ['document.getElementById', 'document.querySelector', 'document.getElementByTag', 'document.find'],
      correctAnswerIndex: 1,
      explanation: "document.querySelector() istalgan CSS selektori bo'yicha birinchi mos kelgan elementni topadi.",
      points: 10,
    },
    {
      id: 'q-j6',
      question: "JavaScriptda qaysi qiymat \"falsy\" hisoblanmaydi?",
      options: ['0', '"" (bo\'sh satr)', '"0" (ichida nol bor satr)', 'undefined'],
      correctAnswerIndex: 2,
      explanation: '"0" bo\'sh bo\'lmagan satr bo\'lgani uchun u "truthy" hisoblanadi.',
      points: 10,
    },
    {
      id: 'q-j7',
      question: "Asinxron kodlarni boshqarishda Promise natijasini qulay kutish uchun qaysi kalit so'zlar juftligi ishlatiladi?",
      options: ['try / catch', 'async / await', 'defer / delay', 'sync / yield'],
      correctAnswerIndex: 1,
      explanation: "async / await sintaksisi asinxron Promiselarni xuddi sinxrondek toza o'qish imkonini beradi.",
      points: 10,
    },
    {
      id: 'q-j8',
      question: "Qaysi metod massivdagi faqat shartni qanoatlantirgan elementlarni qoldiradi?",
      options: ['slice()', 'filter()', 'splice()', 'sort()'],
      correctAnswerIndex: 1,
      explanation: "filter() metodi berilgan callback funksiya true qaytargan elementlardan yangi massiv tuzadi.",
      points: 10,
    },
  ],
};

// 100% talab qilinadigan Katta Qiyin Final Imtihon savollari
export const FINAL_BOSS_QUESTIONS: TestQuestion[] = [
  {
    id: 'fb-1',
    question: "HTML5: Quyidagi elementlardan qaysi biri mustaqil, boshqa joyda qayta ishlatilishi mumkin bo'lgan kontent (masalan, blog post yoki yangilik) uchun mo'ljallangan?",
    options: ['<section>', '<article>', '<div>', '<aside>'],
    correctAnswerIndex: 1,
    explanation: "<article> tegi mustaqil va kontekstdan tashqarida ham ma'noga ega bo'lgan kontent birligi hisoblanadi.",
    points: 10,
  },
  {
    id: 'fb-2',
    question: "CSS Spesifikatsiya: Agar elementga quyidagilar qo'llansa, qaysi qoida ustunlik qiladi?\n1. p.text (0,0,1,1)\n2. #main p (0,1,0,1)\n3. p:first-child (0,0,1,1)\n4. .container .box p (0,0,2,1)",
    options: ['p.text', '#main p', 'p:first-child', '.container .box p'],
    correctAnswerIndex: 1,
    explanation: "#main p selektori ID (0,1,0,1) ga ega bo'lgani uchun uning o'ziga xosligi (specificity) eng yuqori bo'ladi.",
    points: 10,
  },
  {
    id: 'fb-3',
    question: "CSS: z-index ishlashi uchun element qanday position xususiyatiga ega bo'lishi kerak?",
    options: ['Faqat position: static', "position: static bo'lmagan istalgan (relative, absolute, fixed, sticky)", 'Faqat position: absolute', "Display: flex bo'lishi shart"],
    correctAnswerIndex: 1,
    explanation: "z-index xossasi position qiymati static dan boshqa bo'lgan yoki flex/grid bolalari bo'lgan elementlarda ishlaydi.",
    points: 10,
  },
  {
    id: 'fb-4',
    question: "JS Event Loop: Ushbu kod konsolga qanday ketma-ketlikda chop etiladi?\nconsole.log(1);\nsetTimeout(() => console.log(2), 0);\nPromise.resolve().then(() => console.log(3));\nconsole.log(4);",
    options: ['1, 2, 3, 4', '1, 4, 2, 3', '1, 4, 3, 2', '4, 1, 3, 2'],
    correctAnswerIndex: 2,
    explanation: "1 va 4 sinxron bajariladi. Microtask (Promise) setTimeout (macrotask) dan oldin bajariladi: 1, 4, 3, 2.",
    points: 10,
  },
  {
    id: 'fb-5',
    question: "JS Closures: Ushbu kod nima chiqaradi?\nfunction createCounter() {\n  let count = 0;\n  return () => ++count;\n}\nconst c1 = createCounter();\nconst c2 = createCounter();\nc1(); c1();\nconsole.log(c2());",
    options: ['3', '2', '1', 'undefined'],
    correctAnswerIndex: 2,
    explanation: "Har bir createCounter() chaqirig'i o'zining alohida yopiq (closure) leksik muhitini yaratadi. Shuning uchun c2() yangi count = 0 dan boshlab 1 qaytaradi.",
    points: 10,
  },
  {
    id: 'fb-6',
    question: "JavaScript: [1, 2, 3] + [4, 5, 6] natijasi nima bo'ladi?",
    options: ['[1, 2, 3, 4, 5, 6]', '"1,2,34,5,6"', 'NaN', 'TypeError xatosi'],
    correctAnswerIndex: 1,
    explanation: "Massivlar + amali bilan qo'shilganda toString() orqali \"1,2,3\" va \"4,5,6\" satrlariga aylanadi va \"1,2,34,5,6\" hosil bo'ladi.",
    points: 10,
  },
  {
    id: 'fb-7',
    question: "DOM Event Propagation: Hodisa tarqalishining to'g'ri bosqichlari qaysi tartibda bo'ladi?",
    options: ['Bubbling -> Capturing -> Target', 'Capturing -> Target -> Bubbling', 'Target -> Bubbling -> Capturing', "Faqat Bubbling sodir bo'ladi"],
    correctAnswerIndex: 1,
    explanation: "Dastlab hodisa ildizdan pastga tushadi (Capturing), maqsadga yetadi (Target), so'ng tepaga qaytadi (Bubbling).",
    points: 10,
  },
  {
    id: 'fb-8',
    question: "CSS Box Sizing: Agar elementda width: 200px; padding: 20px; border: 5px solid; va box-sizing: border-box; bo'lsa, elementning umumiy ko'rinadigan kengligi qancha bo'ladi?",
    options: ['250px', '225px', '200px', '240px'],
    correctAnswerIndex: 2,
    explanation: "box-sizing: border-box da padding va border ko'rsatilgan width (200px) ichiga singdiriladi, umumiy kenglik aynan 200px bo'ladi.",
    points: 10,
  },
  {
    id: 'fb-9',
    question: "JS Asinxronlik: Quyidagi Promise.all() qachon reject bo'ladi?",
    options: ['Barcha promislar xato berganda', "Hech bo'lmaganda bitta promise reject bo'lsa darhol", "Faqat oxirgi promise reject bo'lsa", "Hech qachon reject bo'lmaydi"],
    correctAnswerIndex: 1,
    explanation: 'Promise.all "fail-fast" printsipida ishlaydi: bitta promise reject bo\'lishi bilan butun Promise.all reject bo\'ladi.',
    points: 10,
  },
  {
    id: 'fb-10',
    question: "Full-Stack Web: Brauzerda xavfsizlik maqsadida bir domen boshqa domendagi resurslarni so'rashini cheklovchi mexanizm nima?",
    options: ['CSRF', 'XSS', 'CORS (Same-Origin Policy)', 'JWT'],
    correctAnswerIndex: 2,
    explanation: "SOP (Same-Origin Policy) va CORS mexanizmi brauzerda domenlararo resurs almashinuvini nazorat qiladi va cheklaydi.",
    points: 10,
  },
];
