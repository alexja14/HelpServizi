import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { prisma } from './prisma';

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

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

app.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`);
});
