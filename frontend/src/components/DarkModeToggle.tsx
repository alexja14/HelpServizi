import { useEffect, useState } from 'react';

export default function DarkModeToggle() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    if (enabled) root.classList.add('dark');
    else root.classList.remove('dark');
  }, [enabled]);

  return (
    <button
      aria-label={enabled ? 'Disattiva dark mode' : 'Attiva dark mode'}
      onClick={() => setEnabled((v) => !v)}
      className="rounded border px-3 py-1 text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
    >
      {enabled ? '🌙 Dark' : '☀️ Light'}
    </button>
  );
}
