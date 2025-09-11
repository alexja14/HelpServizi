import { useEffect, useState } from 'react'
import LandingPage from './LandingPage'
import AdminPanel from './AdminPanel'
import PrivacyPage from './PrivacyPage'
import FAQPage from './FAQPage'

function App() {
  const [hash, setHash] = useState(window.location.hash)
  useEffect(() => {
    const handler = () => setHash(window.location.hash)
    window.addEventListener('hashchange', handler)
    return () => window.removeEventListener('hashchange', handler)
  }, [])
  useEffect(() => {
    // Inject meta tags into <head>
    const head = document.head;
    // Render HeadMeta by creating elements manually
    // Simpler: set title and basic meta here; advanced tags are in index.html for production builds.
  document.title = 'AI GOL — Corso di Intelligenza Artificiale per il lavoro';
    const meta = document.createElement('meta');
    meta.name = 'description';
  meta.content = "AI GOL: percorso pratico intensivo (2.5 giornate equivalenti) per persone disoccupate: strumenti di AI per CV, colloqui, automazioni e portfolio.";
    head.appendChild(meta);
    return () => {
      head.removeChild(meta);
    };
  }, []);

  if (hash === '#admin') return <AdminPanel />
  if (hash === '#privacy') return <PrivacyPage />
  if (hash === '#faq-page') return <FAQPage />
  return <LandingPage />
}

export default App
