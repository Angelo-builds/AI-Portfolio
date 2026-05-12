import express from 'express';
import { createServer as createViteServer } from 'vite';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { initialData } from './src/data/content.js'; // Fallback initial data

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.join(__dirname, 'database.sqlite');

async function initDB() {
  const db = await open({
    filename: DB_PATH,
    driver: sqlite3.Database
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS content (
      id INTEGER PRIMARY KEY DEFAULT 1,
      data TEXT NOT NULL
    )
  `);

  // Initialize with default data if empty
  const row = await db.get('SELECT data FROM content WHERE id = 1');
  if (!row) {
    await db.run('INSERT INTO content (id, data) VALUES (1, ?)', [JSON.stringify(initialData)]);
  }

  return db;
}

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;
  
  app.use(express.json({ limit: '10mb' }));

  const db = await initDB();

  // API Routes
  app.get('/api/content', async (req, res) => {
    try {
      const row = await db.get('SELECT data FROM content WHERE id = 1');
      res.json(JSON.parse(row.data));
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to retrieve content' });
    }
  });

  app.post('/api/content', async (req, res) => {
    try {
      // In a real app we would check admin auth token here
      const newContent = req.body;
      await db.run('UPDATE content SET data = ? WHERE id = 1', [JSON.stringify(newContent)]);
      res.json({ success: true });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to update content' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production serving
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer().catch(console.error);
