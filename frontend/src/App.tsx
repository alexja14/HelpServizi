import { useEffect } from 'react'
import LandingPage from './LandingPage'
import AdminPanel from './AdminPanel'
import PrivacyPage from './PrivacyPage'

function App() {
  useEffect(() => {
    // Inject meta tags into <head>
  const head = document.head;
    // Render HeadMeta by creating elements manually
    // Simpler: set title and basic meta here; advanced tags are in index.html for production builds.
  document.title = 'Utilizza AI e genera prestazioni lavorative — Prossime sessioni di Autunno';
    const meta = document.createElement('meta');
    meta.name = 'description';
  meta.content = "Percorso pratico intensivo (2.5 giornate equivalenti) per persone disoccupate: strumenti di AI per CV, colloqui, automazioni e portfolio.";
    head.appendChild(meta);
    return () => {
      head.removeChild(meta);
    };
  }, []);

  const hash = window.location.hash
  if (hash === '#admin') return <AdminPanel />
  if (hash === '#privacy') return <PrivacyPage />
  return <LandingPage />
}

export default App
