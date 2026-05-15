import express from 'express';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());

const getSystemPrompt = (mode, subject) => {
  const basePrompt = `You are ScholarAI, a patient, academic tutor specializing in ${subject}. 
Your goal is to help the student learn using the Socratic method. 
Never give answers directly; instead, guide the student through the process by asking thoughtful questions or providing conceptual hints. 
Use clear target audience: university students.`;

  const modeInstructions = {
    explain: "Focus on providing deep, conceptual explanations with real-world examples or analogies. Break down complex topics into digestible parts.",
    quiz: "Based on the current topic, generate exactly 3 multiple-choice questions. Format them clearly. Wait for the student's answer before providing guidance.",
    summary: "Provide a concise, bullet-point TL;DR summary of the key concepts discussed so far in this conversation. Highlight critical formulas or definitions."
  };

  return `${basePrompt}\n\nCURRENT MODE: ${mode.toUpperCase()}\n${modeInstructions[mode]}`;
};

app.post('/api/chat', async (req, res) => {
  try {
    const { message, history, mode, subject } = req.body;
    
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: "GEMINI_API_KEY is not configured on the server." });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const chat = ai.chats.create({
      model: "gemini-3-flash-preview",
      config: {
        systemInstruction: getSystemPrompt(mode, subject),
        temperature: 0.7,
      },
      history: history.map(m => ({
        role: m.role,
        parts: [{ text: m.content }]
      }))
    });

    const stream = await chat.sendMessageStream({ message });

    // Set headers for Server-Sent Events (SSE)
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    for await (const chunk of stream) {
      if (chunk.text) {
        // We encode the chunk text properly
        const data = JSON.stringify({ text: chunk.text });
        res.write(`data: ${data}\n\n`);
      }
    }
    res.write('event: done\ndata: {}\n\n');
    res.end();
  } catch (error) {
    console.error("Chat API Error:", error);
    // If headers are not sent, send 500 error
    if (!res.headersSent) {
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      res.end();
    }
  }
});

// Serve static frontend files in production
app.use(express.static(path.join(__dirname, 'dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

if (!process.env.VERCEL) {
  app.listen(port, () => {
    console.log(`Backend server listening at http://localhost:${port}`);
  });
}

export default app;
