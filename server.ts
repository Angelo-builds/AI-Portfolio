import 'dotenv/config';
import express from 'express';
import { createServer as createViteServer } from 'vite';
import pkg from 'pg';
const { Pool } = pkg;
import path from 'path';
import { fileURLToPath } from 'url';
import { initialData } from './src/data/content.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// In-memory fallback if Postgres is not configured yet
let memoryContent = JSON.stringify(initialData);

let pool: pkg.Pool | null = null;

if (process.env.PGHOST) {
  pool = new Pool({
    host: process.env.PGHOST,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
    port: Number(process.env.PGPORT) || 5432,
  });
}

async function initDB() {
  if (!pool) {
    console.log("Postgres credentials not found in env. Falling back to in-memory storage.");
    return;
  }
  
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS content (
        id INTEGER PRIMARY KEY,
        data TEXT NOT NULL
      )
    `);

    const res = await pool.query('SELECT data FROM content WHERE id = 1');
    if (res.rows.length === 0) {
      await pool.query('INSERT INTO content (id, data) VALUES (1, $1)', [JSON.stringify(initialData)]);
    }
    console.log("Postgres database initialized successfully.");
  } catch (err) {
    console.error("Failed to initialize Postgres database:", err);
    console.log("Falling back to in-memory storage due to DB connection error.");
    pool = null; // Fallback to memory
  }
}

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;
  
  app.use(express.json({ limit: '10mb' }));

  await initDB();

  // API Routes
  app.get('/api/content', async (req, res) => {
    try {
      if (pool) {
        const result = await pool.query('SELECT data FROM content WHERE id = 1');
        if (result.rows.length > 0) {
          res.json(JSON.parse(result.rows[0].data));
          return;
        }
      }
      // Fallback
      res.json(JSON.parse(memoryContent));
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to retrieve content' });
    }
  });

  app.post('/api/content', async (req, res) => {
    try {
      const newContent = req.body;
      const jsonContent = JSON.stringify(newContent);
      
      if (pool) {
        await pool.query('UPDATE content SET data = $1 WHERE id = 1', [jsonContent]);
      } else {
        memoryContent = jsonContent;
      }
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
