import { motion } from 'framer-motion'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <header className="border-b border-gray-800 bg-gray-950/85 backdrop-blur sticky top-0 z-50">
        <div className="container mx-auto max-w-6xl px-4 h-14 flex items-center justify-between">
          <a className="flex items-center gap-2" href="#" aria-label="Home">
            <img src="/logo.svg" alt="Logo" className="h-6 w-6" />
            <span className="ml-1 font-semibold">AI Prestazioni Lavorative</span>
          </a>
          <nav className="hidden md:flex gap-6 text-sm font-medium">
            <a href="#" className="hover:text-brand-600 transition-colors">Home</a>
          </nav>
        </div>
      </header>
      <main className="py-12">
        <div className="container mx-auto max-w-4xl px-4">
          <motion.h1 initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} className="text-3xl font-bold mb-6">Informativa Privacy</motion.h1>
          <div className="prose prose-invert max-w-none text-sm leading-relaxed">
            <p><strong>Titolare del trattamento:</strong> [Nome azienda / Ente] ("Titolare"). Contatti: <a href="mailto:info@example.com" className="text-brand-300 underline">info@example.com</a>.</p>
            <p><strong>Dati trattati:</strong> nome, cognome, email, telefono, conferma prima edizione CAF, dichiarazione stato occupazionale (disoccupato), preferenze e metadati tecnici (log accessi, timestamp iscrizione). Nessun dato particolare (art. 9 GDPR) è richiesto.</p>
            <p><strong>Finalità e basi giuridiche:</strong></p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Gestione iscrizione e invio informazioni operative (art. 6(1)(b) GDPR).</li>
              <li>Comunicazioni di follow‑up e materiali correlati (consenso art. 6(1)(a)).</li>
              <li>Invio contenuti formativi aggiuntivi (marketing leggero) previo consenso.</li>
              <li>Statistiche interne e miglioramento (interesse legittimo art. 6(1)(f) con minimizzazione).</li>
            </ul>
            <p><strong>Natura del conferimento:</strong> obbligatori: nome, cognome, email, consenso privacy. Facoltativi: telefono, flag prima edizione CAF, dichiarazione disoccupazione (necessaria per eventuali benefici).</p>
            <p><strong>Modalità:</strong> trattamento digitale su infrastrutture UE / fornitori conformi. Sicurezza: access control, backup, minimizzazione.</p>
            <p><strong>Conservazione:</strong> dati iscrizione max 24 mesi dall’ultimo contatto utile o revoca; log tecnici max 12 mesi.</p>
            <p><strong>Comunicazione / trasferimento:</strong> nessuna diffusione; eventuali responsabili esterni nominati (art. 28). Nessun trasferimento extra UE salvo garanzie adeguate.</p>
            <p><strong>Diritti:</strong> accesso, rettifica, cancellazione, limitazione, portabilità, opposizione, revoca consenso. Reclamo al Garante Privacy.</p>
            <p><strong>Revoca consenso:</strong> via email a <a href="mailto:info@example.com" className="text-brand-300 underline">info@example.com</a> o link unsubscribe.</p>
            <p className="text-xs text-gray-500">Versione: v1 – aggiornare con dati reali (ragione sociale, P.IVA, indirizzo, fornitori) prima della pubblicazione.</p>
          </div>
        </div>
      </main>
      <footer className="border-t border-gray-800 py-8 text-sm">
        <div className="container mx-auto max-w-6xl px-4 flex flex-col sm:flex-row justify-between gap-4 text-gray-500">
          <div>© {new Date().getFullYear()} AI Prestazioni Lavorative</div>
          <div className="flex gap-4"><a href="#" className="hover:underline">Home</a></div>
        </div>
      </footer>
    </div>
  )
}