import 'dotenv/config';
import express from 'express';
import { createServer as createViteServer } from 'vite';
import pkg from 'pg';
const { Pool } = pkg;
import path from 'path';
import fs from 'fs';
import { initialData } from './src/data/content.js';

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
    connectionTimeoutMillis: 3000, // Important: avoid hanging the startup if db is unreachable
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
  const PORT = 3000;
  
  app.set('trust proxy', true);
  app.use(express.json({ limit: '10mb' }));

  await initDB();

  function isLocalRequest(req: express.Request): boolean {
    const ip = req.ip || '';
    const ipStr = ip.startsWith('::ffff:') ? ip.substring(7) : ip;
    
    // Broad allow for private network ranges to avoid NAT issues (Docker, Tailscale, LAN)
    if (ipStr.startsWith('192.168.')) return true;
    if (ipStr.startsWith('10.')) return true;
    if (ipStr.match(/^172\.(1[6-9]|2[0-9]|3[0-1])\./)) return true; // Docker
    if (ipStr.startsWith('100.')) return true; // Tailscale CGNAT
    if (ipStr.toLowerCase().startsWith('fd7a:115c:a1e0:')) return true; // Tailscale IPv6
    if (ipStr.toLowerCase().startsWith('fe80:')) return true; // Link-local IPv6
    if (ipStr === '127.0.0.1' || ipStr === '::1') return true;

    // Placeholder for Specific IP if needed
    if (ipStr === '#.#.#.#') return true;

    // Check X-Forwarded-For if behind a proxy
    const forwardedFor = req.headers['x-forwarded-for'];
    if (forwardedFor && typeof forwardedFor === 'string') {
        const forwardedIps = forwardedFor.split(',').map(s => s.trim());
        for (const fIp of forwardedIps) {
            if (fIp.startsWith('192.168.')) return true;
            if (fIp.startsWith('10.')) return true;
            if (fIp.startsWith('100.')) return true;
            if (fIp.match(/^172\.(1[6-9]|2[0-9]|3[0-1])\./)) return true;
            if (fIp === '#.#.#.#') return true;
        }
    }

    return false;
  }

  // Maintenance Mode Middleware
  app.use((req, res, next) => {
    const maintenanceFile = path.join(process.cwd(), '.maintenance');
    if (fs.existsSync(maintenanceFile)) {
      // Allow API and static static files if strictly needed, but let's block mostly
      if (req.path.endsWith('.pdf')) return next();
      if (!req.path.startsWith('/api')) {
        const maintPage = path.join(process.cwd(), 'public', 'maintenance.html');
        if (fs.existsSync(maintPage)) {
          return res.status(503).sendFile(maintPage);
        }
        return res.status(503).send('Site under maintenance. Please check back soon.');
      }
    }
    next();
  });

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
    if (!isLocalRequest(req)) return res.status(401).json({ error: 'Access denied. Local Request required.' });
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

  app.get('/api/admin-check', (req, res) => {
    console.log('[Admin Check] req.ip:', req.ip, 'req.hostname:', req.hostname, 'x-forwarded-for:', req.headers['x-forwarded-for']);
    res.json({ allowed: isLocalRequest(req), ip: req.ip, hostname: req.hostname });
  });

  app.get('/api/status', async (req, res) => {
    if (!isLocalRequest(req)) return res.status(401).json({ error: 'Access denied. Local Request required.' });
    let dbStatus = 'Disconnected';
    if (pool) {
      try {
        await pool.query('SELECT 1');
        dbStatus = 'Connected';
      } catch (err: any) {
        dbStatus = 'Error: ' + err.message;
      }
    } else {
      dbStatus = 'Not Configured (Using In-Memory)';
    }

    let umamiStatus = 'Unknown';
    try {
            // Umami check (best effort)
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      const fetchReq = await fetch('https://stats.angihomelab.com/script.js', { method: 'HEAD', signal: controller.signal });
      clearTimeout(timeoutId);
      if (fetchReq.ok) {
        umamiStatus = 'Reachable';
      } else {
        umamiStatus = 'Unreachable (HTTP ' + fetchReq.status + ')';
      }
    } catch (err) {
      umamiStatus = 'Unreachable';
    }

    res.json({
      database: dbStatus,
      umami: umamiStatus
    });
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
    const distPath = path.join(process.cwd(), 'dist');
    const publicPath = path.join(process.cwd(), 'public');
    app.use(express.static(distPath));
    app.use(express.static(publicPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer().catch(console.error);
