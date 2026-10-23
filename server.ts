import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { db } from './src/db/index.ts';
import { staffMembers, staffMessages, claimedGifts } from './src/db/schema.ts';
import { desc, eq } from 'drizzle-orm';

dotenv.config();

const app = express();

const args = process.argv.slice(2);
let port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const portArgIndex = args.indexOf('--port');
if (portArgIndex !== -1 && args[portArgIndex + 1]) {
  port = parseInt(args[portArgIndex + 1], 10) || port;
}

app.use(express.json());

// Initialize Gemini client on server side
const apiKey = process.env.GEMINI_API_KEY || '';
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Shared Groq API key provided by user for all academy students
const DEFAULT_GROQ_KEY = process.env.GROQ_API_KEY || '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';

// AI Mentor chat endpoint
app.post('/api/ai-chat', async (req, res) => {
  try {
    const { message, groqApiKey } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Xabar kiritilmadi' });
    }

    const activeGroqKey = (groqApiKey && groqApiKey.trim().length > 10) ? groqApiKey.trim() : DEFAULT_GROQ_KEY;

    // Use Groq API
    if (activeGroqKey) {
      try {
        const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${activeGroqKey}`,
          },
          body: JSON.stringify({
            model: 'llama-3.3-70b-versatile',
            messages: [
              {
                role: 'system',
                content:
                  "Siz o'zbek tilidagi do'stona, sabrli va professional Web Dasturlash (HTML, CSS, SCSS, Bootstrap, JavaScript, Python) murabbiysisiz. O'quvchilarga tushunarli, aniq misollar va kod bloklari bilan o'zbek tilida tushuntiring.",
              },
              { role: 'user', content: message },
            ],
            temperature: 0.7,
            max_tokens: 1024,
          }),
        });

        if (groqRes.ok) {
          const groqData = await groqRes.json();
          const reply = groqData.choices?.[0]?.message?.content;
          if (reply) {
            return res.json({ reply, provider: 'Groq AI (Tezkor)' });
          }
        }
      } catch (e) {
        console.warn('Groq API error, falling back to Gemini:', e);
      }
    }

    // Fallback to Gemini if server has GEMINI_API_KEY
    if (ai) {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: message,
        config: {
          systemInstruction:
            "Siz o'zbek tilidagi juda professional va sabrli Web Dasturlash (HTML, CSS, JavaScript) o'qituvchisisiz. Savollarga qisqa, aniq va amaliy kod namunalari bilan samimiy o'zbek tilida javob bering.",
        },
      });

      return res.json({ reply: response.text || 'Javob olindi.', provider: 'Gemini AI' });
    }

    // Intelligent built-in knowledge response if no external key is connected yet
    return res.json({
      reply: getIntelligentFallback(message),
      provider: 'Mahalliy AI Murabbiy',
    });
  } catch (error: any) {
    console.error('AI chat error:', error);
    res.status(500).json({
      error: 'AI bilan bog\'lanishda xatolik yuz berdi',
      reply: getIntelligentFallback(req.body.message || ''),
      provider: 'Mahalliy AI Murabbiy',
    });
  }
});

// ----------------------------------------------------
// Cloud SQL Database APIs: Staff Management & Chat
// ----------------------------------------------------

// 1. Get all staff members
app.get('/api/staff/members', async (req, res) => {
  try {
    const list = await db.select().from(staffMembers).orderBy(desc(staffMembers.createdAt));
    res.json({ members: list });
  } catch (error) {
    console.warn('SQL staff query notice (using offline empty state):', error);
    res.json({ members: [] });
  }
});

// 2. Add new staff member (Admin creates staff with auto login & password)
app.post('/api/staff/members', async (req, res) => {
  try {
    const { name, role, login, password, assignedBy } = req.body;
    if (!name || !role || !login || !password) {
      return res.status(400).json({ error: 'Barcha maydonlarni to\'ldiring' });
    }

    const inserted = await db
      .insert(staffMembers)
      .values({
        name: name.trim(),
        role: role.trim(),
        login: login.trim().toLowerCase(),
        password: password.trim(),
        assignedBy: assignedBy || 'legend_o1',
        status: 'active',
      })
      .returning();

    res.json({ success: true, member: inserted[0] });
  } catch (error: any) {
    console.error('Error adding staff member to SQL:', error);
    if (error.code === '23505') {
      return res.status(409).json({ error: 'Bu login bilan boshqa xodim mavjud!' });
    }
    res.status(500).json({ error: 'Xodimni saqlashda xatolik yuz berdi' });
  }
});

// 3. Staff & Admin Login verification
app.post('/api/staff/login', async (req, res) => {
  try {
    const { login, password } = req.body;
    if (!login || !password) {
      return res.status(400).json({ error: 'Login va parol kiritilmadi' });
    }

    // Check if main admin
    if (login.trim() === 'legend_o1' && password.trim() === 'lord_o1') {
      return res.json({
        success: true,
        user: {
          name: 'Olimjon (Admin)',
          role: 'Bosh Administrator',
          login: 'legend_o1',
          isAdmin: true,
        },
      });
    }

    // Check in SQL staff_members table
    const matched = await db
      .select()
      .from(staffMembers)
      .where(eq(staffMembers.login, login.trim().toLowerCase()));

    if (matched.length > 0 && matched[0].password === password.trim()) {
      return res.json({
        success: true,
        user: {
          name: matched[0].name,
          role: matched[0].role,
          login: matched[0].login,
          isAdmin: false,
        },
      });
    }

    return res.status(401).json({ error: 'Login yoki parol noto\'g\'ri' });
  } catch (error) {
    console.error('Error during staff login:', error);
    res.status(500).json({ error: 'Tizimda xatolik yuz berdi' });
  }
});

// 4. Staff private chat messages
app.get('/api/staff/messages', async (req, res) => {
  try {
    const messages = await db
      .select()
      .from(staffMessages)
      .orderBy(staffMessages.createdAt);
    res.json({ messages });
  } catch (error) {
    console.warn('SQL messages query notice (using offline empty state):', error);
    res.json({ messages: [] });
  }
});

// 5. Send staff private chat message
app.post('/api/staff/messages', async (req, res) => {
  try {
    const { senderName, senderRole, senderLogin, text, isUrgent } = req.body;
    if (!text || !senderName) {
      return res.status(400).json({ error: 'Xabar matni kiritilmadi' });
    }

    const inserted = await db
      .insert(staffMessages)
      .values({
        senderName: senderName.trim(),
        senderRole: senderRole || 'staff',
        senderLogin: senderLogin || 'staff_member',
        text: text.trim(),
        isUrgent: isUrgent ? 'true' : 'false',
      })
      .returning();

    res.json({ success: true, message: inserted[0] });
  } catch (error) {
    console.error('Error saving staff message:', error);
    res.status(500).json({ error: 'Xabarni saqlab bo\'lmadi' });
  }
});

// 6. 3D Gift status check (Only 1 time per student)
app.get('/api/gifts/status', async (req, res) => {
  try {
    const email = req.query.email as string;
    if (!email) {
      return res.json({ claimed: false });
    }

    const check = await db
      .select()
      .from(claimedGifts)
      .where(eq(claimedGifts.studentEmail, email.trim().toLowerCase()));

    if (check.length > 0) {
      return res.json({
        claimed: true,
        gift: check[0],
      });
    }

    res.json({ claimed: false });
  } catch (error) {
    console.error('Error checking gift status:', error);
    res.status(500).json({ error: 'Sovg\'a holatini tekshirishda xatolik' });
  }
});

// 7. Claim 3D Gift (Enforces 1-time rule in PostgreSQL)
app.post('/api/gifts/claim', async (req, res) => {
  try {
    const { studentName, studentEmail } = req.body;
    if (!studentEmail) {
      return res.status(400).json({ error: 'Email manzili kiritilmadi' });
    }

    const emailNorm = studentEmail.trim().toLowerCase();

    // Check if already claimed
    const existing = await db
      .select()
      .from(claimedGifts)
      .where(eq(claimedGifts.studentEmail, emailNorm));

    if (existing.length > 0) {
      return res.status(400).json({
        error: 'Ushbu 3D sovg\'a sizga allaqachon berilgan! (Sovg\'a faqat 1 marta beriladi)',
        gift: existing[0],
      });
    }

    const giftCode = 'VIP-3D-' + Math.random().toString(36).substring(2, 8).toUpperCase();
    const inserted = await db
      .insert(claimedGifts)
      .values({
        studentName: studentName || 'Aziz O\'quvchi',
        studentEmail: emailNorm,
        giftCode: giftCode,
        giftTitle: 'Admin Maxsus Sovg\'asi: 3D Dasturchi Oltin To\'plami',
      })
      .returning();

    res.json({
      success: true,
      message: 'Tabriklaymiz! 3D Sovg\'angiz muvaffaqiyatli qabul qilindi!',
      gift: inserted[0],
    });
  } catch (error: any) {
    console.error('Error claiming gift:', error);
    if (error.code === '23505') {
      return res.status(400).json({
        error: 'Ushbu sovg\'a allaqachon olingan (Faqat 1 marta beriladi)',
      });
    }
    res.status(500).json({ error: 'Sovg\'ani qabul qilishda xatolik' });
  }
});

// 8. Health endpoint for SQL
app.get('/api/db/health', async (req, res) => {
  try {
    const count = await db.select().from(staffMembers);
    res.json({ status: 'connected', staffCount: count.length });
  } catch (err: any) {
    res.status(500).json({ status: 'error', error: err.message });
  }
});

// 9. Download Complete Project ZIP Endpoint
app.get(['/api/download-zip', '/download/project.zip', '/project.zip'], (req, res) => {
  try {
    const candidates = [
      path.resolve(process.cwd(), 'dist/devmaster-project.zip'),
      path.resolve(process.cwd(), 'public/devmaster-project.zip'),
      path.resolve(process.cwd(), 'devmaster-project.zip'),
    ];
    let foundPath = candidates.find((p) => fs.existsSync(p));

    if (foundPath) {
      res.setHeader('Content-Type', 'application/zip');
      res.setHeader('Content-Disposition', 'attachment; filename="devmaster-project.zip"');
      return res.sendFile(foundPath);
    }
    return res.status(404).json({ error: 'ZIP fayl topilmadi' });
  } catch (err: any) {
    console.error('Error sending zip:', err);
    res.status(500).json({ error: 'Faylni yuklab olishda xatolik' });
  }
});

function getIntelligentFallback(msg: string): string {
  const lower = msg.toLowerCase();
  if (lower.includes('html') || lower.includes('teg') || lower.includes('tag')) {
    return "HTML — bu veb-sahifaning asosiy tuzilishi (suyagi). Asosiy teglar:\n- `<h1>`...`<h6>`: Sarlavhalar\n- `<p>`: Abzas matni\n- `<a>`: Havola yaratish (`href` atributi bilan)\n- `<img>`: Rasm qo'yish (`src` va `alt` atributi bilan)\n- `<div>`: Elementlarni guruhlovchi blok konteyner\n- `<form>` va `<input>`: Ma'lumot kiritish maydonchalari.";
  }
  if (lower.includes('css') || lower.includes('stil') || lower.includes('flex') || lower.includes('rang')) {
    return "CSS — sahifaga ko'rinish va joziba beradi. Asosiy qoidalar:\n- `color`: Matn rangi (masalan, `color: #e11d48;`)\n- `background-color`: Fon rangi\n- `padding` va `margin`: Ichki va tashqi bo'shliqlar\n- `display: flex`: Elementlarni qulay yonma-yon va markazga joylashtirish\n- `border-radius`: Burchaklarni yumaloqlash.";
  }
  if (lower.includes('js') || lower.includes('javascript') || lower.includes('funksiya') || lower.includes('hodisa')) {
    return "JavaScript — sahifani jonlantiradi. Masalan:\n```javascript\n// Tugma bosilishini tinglash\nconst btn = document.getElementById('myBtn');\nbtn.addEventListener('click', () => {\n  console.log('Tugma bosildi!');\n});\n```\nO'zgaruvchilarni e'lon qilish uchun `let` va `const` dan foydalaniladi.";
  }
  return "Assalomu alaykum! Men sizning Web Dasturlash (HTML, CSS, JavaScript) murabbiyingizman. HTML teglari, CSS stillari yoki JavaScript bo'yicha istalgan savolingizni bering, batafsil tushuntirib beraman!";
}

async function startServer() {
  try {
    const isProduction = process.env.NODE_ENV === 'production' || process.env.RENDER === 'true';
    const distPath = path.resolve(process.cwd(), 'dist');
    const hasDist = fs.existsSync(distPath);

    if (hasDist && (isProduction || !process.env.VITE_DEV)) {
      console.log('Production rejimi: dist/ papkasi xizmat ko\'rsatmoqda');
      app.use(express.static(distPath));
      app.get('*', (req, res, next) => {
        if (req.path.startsWith('/api')) {
          return next();
        }
        const indexPath = path.resolve(distPath, 'index.html');
        if (fs.existsSync(indexPath)) {
          return res.sendFile(indexPath);
        }
        return res.status(404).send('Sahifa topilmadi');
      });
    } else {
      console.log('Dev rejimi: Vite middlewares yuklanmoqda...');
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: 'spa',
      });
      app.use(vite.middlewares);
    }

    const server = app.listen(port, '0.0.0.0', () => {
      console.log(`Server running at http://0.0.0.0:${port}`);
    });

    server.on('error', (err) => {
      console.error('Server listen error:', err);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
