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

  // Safari gradient clipping defensive detection
  useEffect(() => {
    const ua = navigator.userAgent;
    const isSafari = /Safari\//.test(ua) && !/Chrome\//.test(ua) && !/Chromium\//.test(ua);
    if (!isSafari) return;
    document.documentElement.classList.add('safari');
    // Runtime test: create an element and verify computed -webkit-text-fill-color remains transparent
    try {
      const testEl = document.createElement('span');
      testEl.className = 'text-gradient-brand';
      testEl.style.position = 'absolute';
      testEl.style.opacity = '0';
      testEl.textContent = 'test';
      document.body.appendChild(testEl);
      const cs = window.getComputedStyle(testEl);
      // Some failing cases report rgb(0, 0, 0) or a non-transparent text fill
      const textFill = (cs as any)['-webkit-text-fill-color'] || cs.color;
      if (textFill && textFill !== 'rgba(0, 0, 0, 0)' && textFill !== 'transparent') {
        // Mark a failure -> force solid fallback
        document.documentElement.classList.add('safari-no-clip');
      }
      document.body.removeChild(testEl);
    } catch {
      /* ignore */
    }
  }, []);

  if (hash === '#admin') return <AdminPanel />
  if (hash === '#privacy') return <PrivacyPage />
  if (hash === '#faq-page') return <FAQPage />
  return <LandingPage />
}

export default App
