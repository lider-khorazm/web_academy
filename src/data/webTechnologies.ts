export interface TechLanguage {
  id: string;
  name: string;
  category: 'Frontend' | 'CSS Freymvork / Preprotsessor' | 'Backend Server' | 'To\'liq Stek';
  badge: string;
  color: string;
  summary: string;
  roleInWebsite: string;
  codeSnippet: string;
  w3schoolsUrl: string;
  w3schoolsUzbekUrl: string;
  advantages: string[];
}

export const WEB_TECHNOLOGIES: TechLanguage[] = [
  // 1. HTML
  {
    id: 'html',
    name: 'HTML5',
    category: 'Frontend',
    badge: 'Sayt Suyagi',
    color: '#e34f26',
    summary: 'Veb-sahifaning asosiy skeleti va mazmunini belgilovchi belgilash tili.',
    roleInWebsite: 'Barcha matnlar, sarlavhalar, formalar, tugmalar va rasmlar HTML orqali joylashtiriladi.',
    codeSnippet: '<!DOCTYPE html>\n<html>\n  <head><title>Mening Saytim</title></head>\n  <body>\n    <h1>Salom, Dunyo!</h1>\n    <p>Bu mening ilk HTML sahifam.</p>\n  </body>\n</html>',
    w3schoolsUrl: 'https://www.w3schools.com/html/',
    w3schoolsUzbekUrl: 'https://translate.google.com/translate?sl=en&tl=uz&u=https://www.w3schools.com/html/',
    advantages: ['Barcha brauzerlar tushunadi', 'O\'rganish juda oson', 'Sayt semantikasi va SEO asosi'],
  },

  // 2. CSS & SCSS
  {
    id: 'scss',
    name: 'SCSS (Sass)',
    category: 'CSS Freymvork / Preprotsessor',
    badge: 'Kengaytirilgan CSS',
    color: '#cf649a',
    summary: 'CSS ning eng mashhur preprotsessori: o\'zgaruvchilar, nesting va mixinlar bilan kod yozishni osonlashtiradi.',
    roleInWebsite: 'Katta loyihalarda CSS kodini tartibli saqlaydi, ranglarni bitta o\'zgaruvchida almashtirish imkonini beradi.',
    codeSnippet: '$primary-color: #e11d48;\n$radius: 12px;\n\n.card {\n  background: #ffffff;\n  border-radius: $radius;\n\n  h2 {\n    color: $primary-color;\n  }\n\n  &:hover {\n    transform: translateY(-2px);\n  }\n}',
    w3schoolsUrl: 'https://www.w3schools.com/sass/',
    w3schoolsUzbekUrl: 'https://translate.google.com/translate?sl=en&tl=uz&u=https://www.w3schools.com/sass/',
    advantages: ['O\'zgaruvchilar ($variables)', 'Nesting (ichma-ich yozish)', 'Kodni qayta ishlatish (@mixin)'],
  },

  // 3. Bootstrap
  {
    id: 'bootstrap',
    name: 'Bootstrap 5',
    category: 'CSS Freymvork / Preprotsessor',
    badge: 'Tayyor Komponentlar',
    color: '#7952b3',
    summary: 'Dunyoning eng mashhur responsive CSS freymvorki. 12 ustunli Grid va tayyor komponentlar to\'plami.',
    roleInWebsite: 'Dizayner bo\'lmasdan ham bir necha daqiqada mobil moslashuvchan, chiroyli tugma, modal va navbarlar yaratish.',
    codeSnippet: '<!-- Bootstrap 5 tugma va kartochka -->\n<div class="card shadow-sm p-4">\n  <h3 class="card-title text-primary">Bootstrap Kartochkasi</h3>\n  <p class="card-text">Mobil va kompyuterga 100% moslashadi.</p>\n  <button class="btn btn-danger">Bosing</button>\n</div>',
    w3schoolsUrl: 'https://www.w3schools.com/bootstrap5/',
    w3schoolsUzbekUrl: 'https://translate.google.com/translate?sl=en&tl=uz&u=https://www.w3schools.com/bootstrap5/',
    advantages: ['Tezkor 12-ustunli Grid', 'Tayyor dizayn komponentlari', 'Noldan CSS yozmasdan chiroyli ko\'rinish'],
  },

  // 4. JavaScript
  {
    id: 'javascript',
    name: 'JavaScript (JS)',
    category: 'Frontend',
    badge: 'Sayt Miyasi',
    color: '#f7df1e',
    summary: 'Veb-sahifaning harakatlantiruvchi tili. Tugma bosilishlari, animatsiyalar va server bilan aloqa.',
    roleInWebsite: 'Foydalanuvchi harakatlarini boshqaradi, formalar validatsiyasi va sahifani qayta yuklamasdan yangilash.',
    codeSnippet: 'const btn = document.querySelector("#likeBtn");\nlet likes = 0;\n\nbtn.addEventListener("click", () => {\n  likes++;\n  document.querySelector("#counter").textContent = likes;\n});',
    w3schoolsUrl: 'https://www.w3schools.com/js/',
    w3schoolsUzbekUrl: 'https://translate.google.com/translate?sl=en&tl=uz&u=https://www.w3schools.com/js/',
    advantages: ['Har qanday brauzerda ishlaydi', 'Interaktivlik va dinamika', 'Frontend va backendda (Node.js) yagona til'],
  },

  // 5. Python Web (Django & Flask)
  {
    id: 'python',
    name: 'Python (Django & Flask)',
    category: 'Backend Server',
    badge: 'Kuchli Server & Backend',
    color: '#3776ab',
    summary: 'Saytning orqa tomoni (Backend), ma\'lumotlar bazasi, foydalanuvchi hisoblari va sun\'iy intellektni boshqaruvchi til.',
    roleInWebsite: 'Foydalanuvchi ro\'yxatdan o\'tganda ma\'lumotni saqlash, xavfsizlikni ta\'minlash va API yaratish.',
    codeSnippet: '# Flask bilan 5 qatorda veb-server yaratish:\nfrom flask import Flask, render_template\n\napp = Flask(__name__)\n\n@app.route("/")\ndef home():\n    return "Assalomu alaykum! Sayt Python orqali ishlamoqda."\n\nif __name__ == "__main__":\n    app.run(port=5000)',
    w3schoolsUrl: 'https://www.w3schools.com/python/',
    w3schoolsUzbekUrl: 'https://translate.google.com/translate?sl=en&tl=uz&u=https://www.w3schools.com/python/',
    advantages: ['Juda toza va o\'qilishi oson sintaksis', 'Django: Tayyor admin panel va xavfsizlik', 'Sun\'iy intellekt (AI) bilan eng oson bog\'lanuvchi til'],
  },

  // 6. PHP
  {
    id: 'php',
    name: 'PHP (Laravel)',
    category: 'Backend Server',
    badge: 'Klassik Veb Tili',
    color: '#777bb4',
    summary: 'Internetdagi barcha veb-saytlarning qariyb 75% qismi (WordPress va Laravel) aynan PHP da ishlaydi.',
    roleInWebsite: 'Sayt shablonlarini serverda chizish, ma\'lumotlar bazasiga ulanish va arzon hostinglarda oson ishga tushirish.',
    codeSnippet: '<?php\n// Laravel marshruti:\nRoute::get("/tanishuv", function () {\n    return view("profile", ["ism" => "Malika"]);\n});\n?>',
    w3schoolsUrl: 'https://www.w3schools.com/php/',
    w3schoolsUzbekUrl: 'https://translate.google.com/translate?sl=en&tl=uz&u=https://www.w3schools.com/php/',
    advantages: ['Juda oson va arzon hosting', 'Katta jamoa va tayyor tizimlar (WordPress)', 'Laravel freymvorkining nafisligi'],
  },

  // 7. Node.js (JavaScript Backend)
  {
    id: 'nodejs',
    name: 'Node.js & Express',
    category: 'Backend Server',
    badge: 'JavaScript Serverda',
    color: '#68a063',
    summary: 'JavaScript tilini brauzerdan tashqarida — serverda ishlatish imkonini beruvchi kuchli muhit.',
    roleInWebsite: 'Real vaqtda ishlaydigan chatlar (chat ilovalari), tezkor REST API va mikro-servislar yaratish.',
    codeSnippet: 'const express = require("express");\nconst app = express();\n\napp.get("/api/users", (req, res) => {\n  res.json({ message: "O\'quvchilar ro\'yxati" });\n});\n\napp.listen(3000);',
    w3schoolsUrl: 'https://www.w3schools.com/nodejs/',
    w3schoolsUzbekUrl: 'https://translate.google.com/translate?sl=en&tl=uz&u=https://www.w3schools.com/nodejs/',
    advantages: ['Frontend va Backend bitta tilda', 'Juda tezkor asinxron I/O', 'npm — dunyodagi eng katta kutubxonalar bazasi'],
  },

  // 8. Go (Golang)
  {
    id: 'golang',
    name: 'Go (Golang)',
    category: 'Backend Server',
    badge: 'Yuqori Tezlik',
    color: '#00add8',
    summary: 'Google tomonidan yaratilgan, soniyasiga yuz minglab so\'rovlarni yengil bajara oluvchi zamonaviy til.',
    roleInWebsite: 'Katta yuklamali (high-load) tizimlar, to\'lov shlyuzlari va bulutli mikroxizmatlar serveri.',
    codeSnippet: 'package main\nimport (\n  "fmt"\n  "net/http"\n)\n\nfunc handler(w http.ResponseWriter, r *http.Request) {\n  fmt.Fprintf(w, "Salom Go serveridan!")\n}\n\nfunc main() {\n  http.HandleFunc("/", handler)\n  http.ListenAndServe(":8080", nil)\n}',
    w3schoolsUrl: 'https://www.w3schools.com/go/',
    w3schoolsUzbekUrl: 'https://translate.google.com/translate?sl=en&tl=uz&u=https://www.w3schools.com/go/',
    advantages: ['Kompilyatsiya qilinuvchi o\'ta tezkor til', 'Goroutinlar (yengil parallelizm)', 'Google, Uber va Docker kabi gigantlar tanlovi'],
  },
];
