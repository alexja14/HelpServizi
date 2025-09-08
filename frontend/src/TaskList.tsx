import { useEffect, useState } from 'react';

type Task = {
  id: number;
  title: string;
  completed: boolean;
};

export default function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState('');

  async function load() {
    const res = await fetch('/api/tasks');
    const data = await res.json();
    setTasks(data);
  }

  async function add() {
    if (!title.trim()) return;
    const res = await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title }),
    });
    if (res.ok) {
      setTitle('');
      await load();
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="mt-6 space-y-4">
      <div className="flex gap-2">
        <input
          className="border rounded px-3 py-2 flex-1"
          placeholder="New task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button className="px-3 py-2 bg-green-600 text-white rounded" onClick={add}>Add</button>
      </div>
      <ul className="divide-y">
        {tasks.map((t) => (
          <li key={t.id} className="py-2 flex items-center justify-between">
            <span className={t.completed ? 'line-through text-gray-500' : ''}>{t.title}</span>
            <span className="text-xs text-gray-400">#{t.id}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
