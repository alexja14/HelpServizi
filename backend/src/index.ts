import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
// Switched from Prisma to direct SQLite (see db.ts)
import { listTasks, createTask, updateTask, deleteTask, createLead, listLeads } from './db';
import basicAuth from 'basic-auth';
let fallbackWarned = false;

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Basic Auth middleware (custom handling to avoid browser popup loops)
function adminAuth(req: express.Request, res: express.Response, next: express.NextFunction) {
  const creds = basicAuth(req);
  const user = process.env.ADMIN_USER || 'admin';
  const pass = process.env.ADMIN_PASS || 'changeme';
  const fallbackUsed = (!process.env.ADMIN_USER || !process.env.ADMIN_PASS);
  if (fallbackUsed && !fallbackWarned && process.env.NODE_ENV !== 'production') {
    console.log('[admin] WARNING: using fallback credentials admin/changeme (set ADMIN_USER & ADMIN_PASS in .env)');
    fallbackWarned = true;
  }
  if (!creds) {
    // No credentials provided
    return res.status(401).json({ error: 'auth required' });
  }
  if (creds.name !== user || creds.pass !== pass) {
    // Invalid credentials – 403 to avoid triggering browser credential dialog again
    return res.status(403).json({ error: 'invalid credentials' });
  }
  next();
}

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// Tasks CRUD
app.get('/api/tasks', async (_req, res) => {
  try {
    const tasks = await listTasks();
    res.json(tasks);
  } catch (e) {
    res.status(500).json({ error: 'internal error' });
  }
});

app.post('/api/tasks', async (req, res) => {
  const { title } = req.body as { title?: string };
  if (!title) return res.status(400).json({ error: 'title is required' });
  try {
    const task = await createTask(title);
    res.status(201).json(task);
  } catch {
    res.status(500).json({ error: 'internal error' });
  }
});

app.patch('/api/tasks/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) return res.status(400).json({ error: 'invalid id' });
  const { title, completed } = req.body as { title?: string; completed?: boolean };
  try {
    const task = await updateTask(id, { title, completed });
    res.json(task);
  } catch (e: any) {
    if (e.message === 'not_found') return res.status(404).json({ error: 'not found' });
    res.status(500).json({ error: 'internal error' });
  }
});

app.delete('/api/tasks/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) return res.status(400).json({ error: 'invalid id' });
  try {
    await deleteTask(id);
    res.status(204).send();
  } catch {
    res.status(500).json({ error: 'internal error' });
  }
});

// Public endpoint to collect leads
app.post('/api/leads', async (req, res) => {
  const { name, lastName, email, phone, cafFlag, unemployed, consent } = req.body as {
    name?: string; lastName?: string; email?: string; phone?: string; cafFlag?: boolean; unemployed?: boolean; consent?: boolean;
  };
  if (!name || !lastName || !email || !consent) return res.status(400).json({ error: 'missing required fields' });
  try {
    const lead = await createLead({ name, lastName, email, phone, cafFlag: !!cafFlag, unemployed: !!unemployed, consent: !!consent });
    res.status(201).json(lead);
  } catch (e: any) {
    if (e.code === 'unique_email') return res.status(409).json({ error: 'email already exists' });
    console.error(e);
    res.status(500).json({ error: 'internal error' });
  }
});

// Admin: list leads
app.get('/api/admin/leads', adminAuth, async (_req, res) => {
  try {
    const leads = await listLeads();
    res.json(leads);
  } catch {
    res.status(500).json({ error: 'internal error' });
  }
});

// Admin: export leads CSV
app.get('/api/admin/leads/export', adminAuth, async (_req, res) => {
  try {
    const leads = await listLeads();
    const header = 'id,name,lastName,email,phone,cafFlag,unemployed,consent,createdAt';
    const rows = leads.map((l: any) => [l.id, JSON.stringify(l.name), JSON.stringify(l.lastName), l.email, l.phone || '', l.cafFlag, l.unemployed, l.consent, (l.createdAt instanceof Date ? l.createdAt.toISOString() : l.createdAt)].join(','));
    const csv = [header, ...rows].join('\n');
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="leads.csv"');
    res.send(csv);
  } catch {
    res.status(500).json({ error: 'internal error' });
  }
});

// --- Static frontend (optional production build) ---
// If the frontend has been built (frontend/dist), serve it. This allows a single-process deployment.
try {
  const frontendDist = path.join(__dirname, '..', '..', 'frontend', 'dist');
  // Basic existence check (sync to avoid async race during startup)
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const fs = require('fs');
  if (fs.existsSync(frontendDist)) {
    app.use(express.static(frontendDist));
    // Fallback to index.html for SPA routes (after API routes)
    app.get(/^(?!\/api\/).*/, (req, res, next) => {
      const indexPath = path.join(frontendDist, 'index.html');
      if (fs.existsSync(indexPath)) return res.sendFile(indexPath);
      return next();
    });
    console.log('[server] Serving frontend from', frontendDist);
  } else {
    if (process.env.NODE_ENV === 'production') {
      console.warn('[server] Frontend dist not found at', frontendDist);
    }
  }
} catch (e) {
  console.warn('[server] Static frontend setup error', e);
}

app.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`);
  if (process.env.NODE_ENV !== 'production') {
    console.log(`[admin] user: ${process.env.ADMIN_USER || 'admin'}`);
  }
});
