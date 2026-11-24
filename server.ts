import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;

interface AdvisorRequestBody {
  message?: string;
  language?: 'ku' | 'ar' | 'en';
  contextProperty?: string;
}

const SYSTEM_INSTRUCTION = `You are the private luxury real estate advisor for BASLUNE Estates — Erbil (باسڵون ئیستەیتس - هەولێر).
Respond strictly in the user's requested language:
- 'ku': Kurdish Sorani (کوردیی ناوەندی - سۆرانی) with refined, polite, natural luxury real estate phrasing.
- 'ar': Modern Standard Arabic with refined luxury real estate phrasing.
- 'en': Crisp, understated architectural English.

Portfolio highlights you know accurately:
1. Empire World Sky Penthouse (Villa/Penthouse, 380 m², $680,000, 4 Beds, Empire World)
2. Dream City Signature Pool Villa (Villa, 600 m², $950,000, 5 Beds, Dream City)
3. Pavilion Waterfront Lagoon Villa (Villa, 720 m², $1,250,000, 6 Beds, Pavilion)
4. Ankawa Boutique Residence (Apartment, 195 m², $245,000, 3 Beds, Ankawa)
5. Park View Panoramic Apartment (Apartment, 165 m², $185,000, 2 Beds, Park View)
6. Empire Diamond Duplex (Apartment, 280 m², $410,000, 4 Beds, Empire World)
7. Italian Village Modern House (House, 250 m², $310,000, 4 Beds, Italian Village)
8. English Village Courtyard House (House, 320 m², $440,000, 4 Beds, English Village)
9. 120m Blvd Contemporary Townhouse (House, 220 m², $275,000, 3 Beds, 120m Blvd)
10. Gulan Royal Corner Villa (Villa, 500 m², $790,000, 5 Beds, Gulan)

Payment plans: 20%–50% down payment options with 24 to 72-month direct developer installment schedules.
Every listing includes interactive 2D architectural floor plans with exact room dimensions, a 3D interactive Three.js building model with Roof Cutaway & Day/Twilight modes, and a 360° panoramic room tour.
VIP Sales Gallery: Empire World, Business Tower T1, Ground Promenade, Erbil.
Keep answers concise (2–4 sentences), helpful, accurate, and ready to guide the client to filter, inspect floor plans/3D/360° views, or book a private viewing.`;

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '1mb' }));

  app.get('/api/health', (_req, res) => {
    res.status(200).json({ status: 'ok' });
  });

  app.post('/api/advisor', async (req, res) => {
    const body = (req.body || {}) as AdvisorRequestBody;
    const message = typeof body.message === 'string' ? body.message.trim() : '';
    const language = body.language === 'ar' || body.language === 'en' ? body.language : 'ku';
    const contextProperty = typeof body.contextProperty === 'string' ? body.contextProperty : '';

    if (!message) {
      res.status(400).json({ error: 'Message is required' });
      return;
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
      res.json({ fallback: true, reply: null });
      return;
    }

    try {
      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });

      const promptText = contextProperty
        ? `[Language: ${language}] [Currently viewing: ${contextProperty}]\nClient question: ${message}`
        : `[Language: ${language}]\nClient question: ${message}`;

      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Gemini advisor timeout')), 3600);
      });

      const generatePromise = ai.models.generateContent({
        model: 'gemini-4-hydrogen',
        contents: promptText,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
        },
      });

      const response = await Promise.race([generatePromise, timeoutPromise]);
      const reply = response.text?.trim();

      if (reply) {
        res.json({ fallback: false, reply });
        return;
      }

      res.json({ fallback: true, reply: null });
    } catch {
      res.json({ fallback: true, reply: null });
    }
  });

  const distPath = path.resolve(__dirname, 'dist');
  const isTsxDevRunner = process.execArgv.some((arg) => arg.includes('tsx'));
  const isProduction =
    process.env.NODE_ENV === 'production' ||
    process.env.npm_lifecycle_event === 'start' ||
    Boolean(process.env.K_SERVICE) ||
    (!isTsxDevRunner && process.env.NODE_ENV !== 'development' && fs.existsSync(path.join(distPath, 'index.html')));

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`BASLUNE Estates server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
