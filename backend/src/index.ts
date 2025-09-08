import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { prisma } from './prisma';
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
  const tasks = await prisma.task.findMany({ orderBy: { createdAt: 'desc' } });
  res.json(tasks);
});

app.post('/api/tasks', async (req, res) => {
  const { title } = req.body as { title?: string };
  if (!title) return res.status(400).json({ error: 'title is required' });
  const task = await prisma.task.create({ data: { title } });
  res.status(201).json(task);
});

app.patch('/api/tasks/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) return res.status(400).json({ error: 'invalid id' });
  const { title, completed } = req.body as { title?: string; completed?: boolean };
  const task = await prisma.task.update({ where: { id }, data: { title, completed } });
  res.json(task);
});

app.delete('/api/tasks/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) return res.status(400).json({ error: 'invalid id' });
  await prisma.task.delete({ where: { id } });
  res.status(204).send();
});

// Public endpoint to collect leads
app.post('/api/leads', async (req, res) => {
  const { name, lastName, email, phone, cafFlag, unemployed, consent } = req.body as {
    name?: string; lastName?: string; email?: string; phone?: string; cafFlag?: boolean; unemployed?: boolean; consent?: boolean;
  };
  if (!name || !lastName || !email || !consent) return res.status(400).json({ error: 'missing required fields' });
  try {
    const lead = await prisma.lead.create({ data: { name, lastName, email, phone, cafFlag: !!cafFlag, unemployed: !!unemployed, consent: !!consent } });
    res.status(201).json(lead);
  } catch (e: any) {
    if (e.code === 'P2002') return res.status(409).json({ error: 'email already exists' });
    console.error(e);
    res.status(500).json({ error: 'internal error' });
  }
});

// Admin: list leads
app.get('/api/admin/leads', adminAuth, async (_req, res) => {
  const leads = await prisma.lead.findMany({ orderBy: { createdAt: 'desc' } });
  res.json(leads);
});

// Admin: export leads CSV
app.get('/api/admin/leads/export', adminAuth, async (_req, res) => {
  const leads = await prisma.lead.findMany({ orderBy: { createdAt: 'desc' } });
  const header = 'id,name,lastName,email,phone,cafFlag,unemployed,consent,createdAt';
  const rows = leads.map(l => [l.id, JSON.stringify(l.name), JSON.stringify(l.lastName), l.email, l.phone || '', l.cafFlag, l.unemployed, l.consent, l.createdAt.toISOString()].join(','));
  const csv = [header, ...rows].join('\n');
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="leads.csv"');
  res.send(csv);
});

app.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`);
  // Dev hint (do not log in production)
  if (process.env.NODE_ENV !== 'production') {
    console.log(`[admin] user: ${process.env.ADMIN_USER || 'admin'}`);
  }
});
