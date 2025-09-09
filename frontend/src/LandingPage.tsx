import { CheckCircleIcon } from '@heroicons/react/24/solid'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Button } from './components/ui/button'
import { Card } from './components/ui/card'
import { useRef, useState } from 'react'

function Section({ id, title, children }: { id?: string; title: string; children: React.ReactNode }) {
  return (
    <motion.section
      id={id}
      className="py-14 sm:py-16"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <div className="container mx-auto max-w-6xl px-4">
        <div className="flex items-center gap-3 mb-6">
          <span className="h-8 w-1 rounded bg-gradient-to-b from-brand-400 to-brand-600" aria-hidden="true" />
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            {title}
          </h2>
        </div>
        {children}
      </div>
    </motion.section>
  )
}

export default function LandingPage() {
  const heroRef = useRef<HTMLDivElement | null>(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const yCloud = useTransform(scrollYProgress, [0, 1], [0, 120])
  // Local inline component for the signup form placed at top (moved from bottom)
  function SignupForm() {
    const [consent, setConsent] = useState(false)
    const [cafFlag, setCafFlag] = useState(false)
    const [unemployed, setUnemployed] = useState(false)
    const [attempted, setAttempted] = useState(false)
    const [status, setStatus] = useState<'idle' | 'saving' | 'done' | 'error'>('idle')
    const [name, setName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    async function handleSubmit(e: React.FormEvent) {
      e.preventDefault()
      setAttempted(true)
      if (!(consent && cafFlag && unemployed)) return
      try {
        setStatus('saving')
        const res = await fetch('/api/leads', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, lastName, email, phone, cafFlag, unemployed, consent })
        })
        if (!res.ok) throw new Error('fail')
        setStatus('done')
      } catch {
        setStatus('error')
      }
    }
    return (
      <form onSubmit={handleSubmit} className="grid md:grid-cols-5 gap-4 text-sm" aria-label="Form di iscrizione iniziale">
        <input value={name} onChange={e => setName(e.target.value)} className="md:col-span-1 border border-gray-800 bg-gray-900 rounded px-4 py-3 w-full placeholder:text-gray-500" name="name" placeholder="Nome" aria-label="Nome" required />
        <input value={lastName} onChange={e => setLastName(e.target.value)} className="md:col-span-1 border border-gray-800 bg-gray-900 rounded px-4 py-3 w-full placeholder:text-gray-500" name="lastName" placeholder="Cognome" aria-label="Cognome" required />
        <input value={email} onChange={e => setEmail(e.target.value)} className="md:col-span-1 border border-gray-800 bg-gray-900 rounded px-4 py-3 w-full placeholder:text-gray-500" type="email" name="email" placeholder="Email" aria-label="Email" required />
        <input value={phone} onChange={e => setPhone(e.target.value)} className="md:col-span-1 border border-gray-800 bg-gray-900 rounded px-4 py-3 w-full placeholder:text-gray-500" type="tel" name="phone" placeholder="Telefono" aria-label="Telefono" pattern="[0-9 +()-]{6,}" />
        <button disabled={!(consent && cafFlag && unemployed) || status === 'saving' || status === 'done'} className="md:col-span-1 rounded bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-5 py-3 font-semibold hover:bg-brand-500 transition-colors" aria-label="Iscriviti gratis ora">
          {status === 'done' ? 'Registrato ✓' : status === 'saving' ? 'Invio...' : 'Iscriviti gratis'}
        </button>
        <div className="md:col-span-4 grid gap-2">
          <label className={`flex items-start gap-2 text-xs ${attempted && !cafFlag ? 'text-red-400' : 'text-gray-400'}`}>
            <input type="checkbox" className={`mt-0.5 h-4 w-4 rounded bg-gray-900 ${attempted && !cafFlag ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-700'}`} checked={cafFlag} onChange={e => setCafFlag(e.target.checked)} aria-label="Flag CAF" />
            <span>È il primo corso che seguo tramite il CAF {attempted && !cafFlag && <em className="not-italic text-red-400">(obbligatorio)</em>}</span>
          </label>
          <label className={`flex items-start gap-2 text-xs ${attempted && !unemployed ? 'text-red-400' : 'text-gray-400'}`}>
            <input type="checkbox" className={`mt-0.5 h-4 w-4 rounded bg-gray-900 ${attempted && !unemployed ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-700'}`} checked={unemployed} onChange={e => setUnemployed(e.target.checked)} aria-label="Flag disoccupato" />
            <span>Dichiaro di essere attualmente disoccupato {attempted && !unemployed && <em className="not-italic text-red-400">(obbligatorio)</em>}</span>
          </label>
          <label className={`flex items-start gap-2 text-xs ${attempted && !consent ? 'text-red-400' : 'text-gray-400'}`}>
            <input type="checkbox" className={`mt-0.5 h-4 w-4 rounded bg-gray-900 ${attempted && !consent ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-700'}`} checked={consent} onChange={e => setConsent(e.target.checked)} aria-label="Consenso trattamento dati" />
            <span>Acconsento al trattamento dei dati (email & telefono) <a href="#privacy" className="text-brand-300 hover:underline">Informativa</a> {attempted && !consent && <em className="not-italic text-red-400">(obbligatorio)</em>}</span>
          </label>
          <p className="text-[10px] text-gray-500">Niente spam. Revoca in qualunque momento. {status === 'error' && <span className="text-red-400 ml-2">Errore, riprova.</span>}</p>
        </div>
      </form>
    )
  }
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 selection:bg-brand-500/30">
      {/* Top bar */}
      <header className="sticky top-0 z-50 border-b border-gray-800 bg-gray-950/85 backdrop-blur">
        <div className="container mx-auto max-w-6xl px-4 h-14 flex items-center justify-between">
          <a className="flex items-center gap-2" href="#" aria-label="Home">
            <img src="/logo.svg" alt="Logo corso" className="h-6 w-6" />
            <span className="ml-1 font-semibold">AI Prestazioni Lavorative</span>
          </a>
          <nav className="hidden md:flex gap-6 text-sm font-medium">
            <a href="#cosa" className="hover:text-brand-600 transition-colors">Competenze</a>
            <a href="#come" className="hover:text-brand-600 transition-colors">Metodo</a>
            <a href="#chi" className="hover:text-brand-600 transition-colors">ANT</a>
            <a href="#faq" className="hover:text-brand-600 transition-colors">FAQ</a>
            <a href="#iscriviti" className="hover:text-brand-600 transition-colors">Iscriviti</a>
            <a href="#privacy" className="hover:text-brand-600 transition-colors">Privacy</a>
          </nav>
          <div className="flex items-center gap-2">
            <Button asChild size="sm" className="shadow-sm">
              <a href="#iscriviti" aria-label="Iscriviti gratis ora">Iscriviti</a>
            </Button>
          </div>
        </div>
      </header>

      {/* Iscrizione (spostata in cima) */}
      <Section id="iscriviti" title="Iscriviti ora: posti limitati, prossime sessioni di Autunno">
        <SignupForm />
      </Section>

      {/* Hero */}
      <section ref={heroRef} className="relative overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(56,189,248,0.25),transparent_60%)]" />
        <div className="container relative mx-auto max-w-6xl px-4 pt-20 pb-16 sm:pt-28 sm:pb-24 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65 }} className="inline-flex items-center gap-2 rounded-full border bg-white/70 dark:bg-gray-900/60 backdrop-blur px-4 py-1.5 text-xs font-medium mb-5 shadow-sm">
              <span className="text-brand-600">Nuovo</span>
              <span>Sessioni di Autunno aperte ▶</span>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.05 }}
              className="text-4xl sm:text-5xl font-extrabold leading-tight mb-5 tracking-tight text-gradient-brand"
            >
              Potenzia la tua carriera con l’AI pratica
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.12 }}
              className="text-gray-300 text-lg mb-7 max-w-xl"
            >
              Percorso intensivo equivalente a 2.5 giornate: strumenti concreti di Intelligenza Artificiale per CV, portfolio, colloqui e micro-automazioni. Impara facendo e rientra più velocemente nel lavoro.
            </motion.p>
            <motion.div className="flex flex-wrap items-center gap-3 mb-8" initial="hidden" animate="show" variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}>
              {['Posti limitati', 'Mentor & career support', '100% pratico'].map(tag => (
                <motion.span key={tag} variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }} className="inline-flex items-center rounded-full bg-brand-600/15 text-brand-300 border border-brand-700/40 px-3 py-1 text-[11px] font-medium tracking-wide">
                  {tag}
                </motion.span>
              ))}
            </motion.div>
            <motion.div className="flex flex-wrap gap-4" initial="hidden" animate="show" variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12 } } }}>
              {[0, 1, 2].map((i) => (
                <motion.div key={i} variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}>
                  {i === 0 && (
                    <Button className="h-12 px-7 text-base bg-brand-600 hover:bg-brand-700 shadow-lg shadow-brand-500/30" aria-label="Iscriviti gratis ora">Iscriviti gratis ora</Button>
                  )}
                  {i === 1 && (
                    <Button variant="outline" className="h-12 px-7 text-base border-gray-700 hover:bg-gray-800" asChild aria-label="Scarica il programma">
                      <a href="#programma">Scarica il programma</a>
                    </Button>
                  )}
                  {i === 2 && (
                    <Button variant="ghost" className="h-12 px-4 text-base hover:bg-gray-800" asChild aria-label="Scorri per saperne di più">
                      <a href="#cosa">Scopri di più ↓</a>
                    </Button>
                  )}
                </motion.div>
              ))}
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }} className="mt-5 inline-flex items-center gap-2 rounded-full bg-gray-900/70 border border-gray-700 px-4 py-2 text-[11px] font-medium tracking-wide shadow">
              <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              Live & on‑demand · Project Work reale
            </motion.div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="mt-10 flex items-center gap-5 text-xs text-gray-400">
              <div className="flex -space-x-2">
                {[1, 2, 3].map(a => (
                  <span key={a} className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-gray-700 bg-gray-800 text-[10px] font-semibold shadow">AI</span>
                ))}
              </div>
              <span>Oltre 1.000 persone formate</span>
              <span className="hidden sm:inline">• Punteggio medio 4.8/5</span>
            </motion.div>
            {/* Info bar sintetica (ex sezioni) */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.75 }} className="mt-6 grid sm:grid-cols-3 gap-3 text-[11px] font-medium">
              <div className="rounded-md border border-gray-800 bg-gray-900/60 px-3 py-2 flex flex-col gap-1">
                <span className="text-brand-300">Corso AI 20h</span>
                <span className="text-gray-400 font-normal">Introduzione · Prompt · Automazione · Dati</span>
              </div>
              <div className="rounded-md border border-gray-800 bg-gray-900/60 px-3 py-2 flex flex-col gap-1">
                <span className="text-brand-300">Tipologie</span>
                <span className="text-gray-400 font-normal">Aziendali · Calendario · One‑To‑One</span>
              </div>
              <div className="rounded-md border border-gray-800 bg-gray-900/60 px-3 py-2 flex flex-col gap-1">
                <span className="text-brand-300">Fondi</span>
                <span className="text-gray-400 font-normal">Interprofessionali & FormaTemp</span>
              </div>
            </motion.div>
          </div>
          <div className="relative">
            <motion.div style={{ y: yCloud }} className="absolute -top-24 -right-10 w-72 h-72 rounded-full bg-brand-500/20 blur-3xl" aria-hidden />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="relative"
            >
              {/* Hero collage */}
              <div className="grid grid-cols-3 gap-2 md:gap-3">
                <img src={new URL('./assets/standing-3.png', import.meta.url).href} alt="Professionista" className="rounded-lg shadow-md col-span-1 aspect-[3/5] object-cover" loading="lazy" />
                <img src={new URL('./assets/standing-8.png', import.meta.url).href} alt="Studente" className="rounded-lg shadow-md col-span-1 aspect-[3/5] object-cover mt-6" loading="lazy" />
                <img src={new URL('./assets/standing-14.png', import.meta.url).href} alt="Mentor" className="rounded-lg shadow-md col-span-1 aspect-[3/5] object-cover" loading="lazy" />
              </div>
              <div className="hidden md:block absolute -right-8 bottom-6 w-36 rotate-3">
                <img src={new URL('./assets/sitting-6.png', import.meta.url).href} alt="Corsista" className="rounded-xl shadow-lg" loading="lazy" />
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-[85%]">
              <div className="rounded-lg border border-gray-800 bg-gray-900/70 backdrop-blur shadow-md p-4 flex items-center gap-4">
                <div className="text-3xl font-bold tracking-tight">4.8/5</div>
                <p className="text-xs leading-snug text-gray-400">Valutazione media su 1.000+ partecipanti
                  <br /><span className="font-medium text-brand-300">Iscriviti prima che si chiuda</span></p>
              </div>
            </motion.div>
          </div>
        </div>
        <div aria-hidden className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-400/40 to-transparent" />
      </section>

      {/* Prova sociale */}
      <Section title="Perché fidarti di noi">
        <motion.div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6" initial="hidden" whileInView="show" viewport={{ once: true }} variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}>
          {[
            { label: 'Persone formate', value: '1.000+' },
            { label: 'Valutazione media', value: '4.8/5' },
            { label: 'Percorso rapido', value: '2.5 giornate' },
            { label: 'Supporto dedicato', value: 'Mentor' },
          ].map(stat => (
            <motion.div key={stat.label} variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}>
              <Card className="p-5 hover:shadow-md transition-shadow bg-gray-900 border-gray-800">
                <div className="text-3xl font-bold tracking-tight">{stat.value}</div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
        <div className="mt-10 grid md:grid-cols-3 gap-6">
          {[
            { name: 'Marco R.', role: 'Jr. Analyst', quote: 'Con l’AI ho costruito un portfolio e trovato colloqui in 3 settimane.' },
            { name: 'Sara P.', role: 'Customer Ops', quote: 'Il corso è pratico e ti guida passo passo: CV, colloqui e automazioni.' },
            { name: 'Luca B.', role: 'PMO', quote: 'Lezioni chiare e mentoring utile: mi sono candidato con più sicurezza.' },
          ].map(t => (
            <motion.div key={t.name} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.55 }}>
              <Card className="p-5 relative overflow-hidden bg-gray-900 border-gray-800">
                <div aria-hidden className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity bg-gradient-to-br from-brand-500/10 to-transparent pointer-events-none" />
                <p className="italic">“{t.quote}”</p>
                <footer className="mt-3 text-sm text-gray-400">{t.name} — {t.role}</footer>
              </Card>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Cosa imparerai */}
      <Section id="cosa" title="Cosa imparerai">
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <ul className="space-y-3">
              {[
                'Strumenti AI per cercare lavoro più velocemente',
                'AI per CV e lettere efficaci',
                'Automatizzare piccole attività',
                'Prompting efficace (ChatGPT/Copilot)',
                'No-code + AI per portfolio e micro-progetti',
                'Tecniche per colloqui e personal branding',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <CheckCircleIcon className="h-5 w-5 text-green-500" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <Card className="p-6 bg-gray-900 border-gray-800">
            <h3 className="font-semibold mb-2">Risultati attesi</h3>
            <p className="text-sm text-gray-700 dark:text-gray-300">CV ottimizzato, 2 progetti AI-assisted, piano d’azione 30 giorni.</p>
          </Card>
        </div>
      </Section>

      {/* Come funziona */}
      <Section id="come" title="Come funziona">
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { step: '1', title: 'Iscrizione', desc: 'Gratuita e immediata.' },
            { step: '2', title: 'Lezioni + Q&A', desc: 'On-demand e live settimanali.' },
            { step: '3', title: 'Project + CV', desc: 'Project work e revisione CV.' },
          ].map((s) => (
            <Card key={s.step} className="p-6">
              <div className="text-sm text-gray-500">Step {s.step}</div>
              <div className="text-lg font-semibold">{s.title}</div>
              <p className="text-sm text-gray-300">{s.desc}</p>
            </Card>
          ))}
        </div>
        <div className="mt-6 text-sm text-gray-400">
          Durata: 2.5 giornate (intensivo) · Formato: Online, materiali sempre disponibili · Supporto: Mentor e community
        </div>
      </Section>

      {/* A chi è rivolto */}
      <Section title="A chi è rivolto">
        <ul className="grid md:grid-cols-3 gap-4">
          <Card className="p-5 bg-gray-900 border-gray-800">Persone disoccupate o in transizione</Card>
          <Card className="p-5 bg-gray-900 border-gray-800">Neodiplomati/neolaureati senza esperienza</Card>
          <Card className="p-5 bg-gray-900 border-gray-800">Chi desidera rientrare con competenze attuali</Card>
        </ul>
        <p className="mt-3 text-sm text-gray-400">Non servono competenze tecniche avanzate.</p>
      </Section>

      {/* Chi siamo */}
      <Section id="chi" title="Chi siamo">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <p className="text-gray-300 leading-relaxed">
              Siamo un team di formatori e professionisti che usano l’AI ogni giorno. La nostra missione è aiutare le persone disoccupate a rientrare nel mercato con competenze pratiche, aggiornate e richieste dalle aziende.
            </p>
            <a className="inline-block mt-4 text-brand-300 hover:underline font-medium" href="#trasparenza">Trasparenza & Team →</a>
          </div>
          <div className="grid grid-cols-4 gap-2 sm:gap-3">
            {['standing-1.png', 'standing-10.png', 'standing-11.png', 'standing-12.png', 'standing-15.png', 'standing-16.png', 'standing-17.png', 'standing-18.png'].map(img => (
              <img key={img} src={new URL(`./assets/${img}`, import.meta.url).href} alt="Team" className="rounded-md shadow ring-1 ring-black/5 dark:ring-white/10 object-cover aspect-[3/5]" loading="lazy" />
            ))}
          </div>
        </div>
      </Section>


      {/* Tips & risorse */}
      <Section title="Tips e risorse gratuite">
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="p-5">
            <h3 className="font-semibold">Template CV ottimizzato AI</h3>
            <p className="text-sm text-gray-300">Struttura ATS + prompt per migliorare i bullet.</p>
            <a href="/risorse/template-cv-ai.md" download className="mt-3 text-indigo-500 hover:underline">Scarica .md</a>
          </Card>
          <Card className="p-5">
            <h3 className="font-semibold">Checklist colloquio con AI</h3>
            <p className="text-sm text-gray-300">Preparazione strutturata + prompt coaching.</p>
            <a href="/risorse/checklist-colloquio-ai.md" download className="mt-3 text-indigo-500 hover:underline">Scarica .md</a>
          </Card>
          <Card className="p-5">
            <h3 className="font-semibold">10 prompt per cercare lavoro</h3>
            <p className="text-sm text-gray-300">Pacchetto rapido per CV, JD e colloqui.</p>
            <a href="/risorse/prompt-lavoro-10.md" download className="mt-3 text-indigo-500 hover:underline">Scarica .md</a>
          </Card>
        </div>
      </Section>

      {/* (sezione iscrizione originale rimossa) */}

      {/* FAQ */}
      <Section id="faq" title="Domande frequenti">
        <div className="grid md:grid-cols-2 gap-6">
          {[
            { q: 'Serve esperienza tecnica?', a: 'No, partiamo da zero.' },
            { q: 'Quanto costa?', a: 'Iscrizione gratuita, opzioni premium disponibili.' },
            { q: 'Quanto tempo richiede?', a: '2–4 ore a settimana.' },
            { q: 'Che supporto ricevo?', a: 'Mentor e community.' },
            { q: 'Entro quando posso iscrivermi?', a: 'Fino all’avvio delle sessioni di Autunno (posti limitati).' },
          ].map((f) => (
            <Card key={f.q} className="p-5">
              <div className="font-semibold">{f.q}</div>
              <p className="text-sm text-gray-300">{f.a}</p>
            </Card>
          ))}
        </div>
      </Section>


      {/* Footer */}
      <footer className="border-t border-gray-800 py-10 text-sm bg-gray-950">
        <div className="container mx-auto max-w-6xl px-4 flex flex-col sm:flex-row justify-between gap-4">
          <div>
            <div className="font-semibold">AI Prestazioni Lavorative</div>
            <div className="text-gray-500">Email: info@example.com · Tel: +39 000 000 000</div>
          </div>
          <nav className="flex gap-4">
            <a href="#" className="hover:underline">Privacy</a>
            <a href="#" className="hover:underline">Termini</a>
            <a href="#" className="hover:underline">Contatti</a>
            <a href="#" className="hover:underline">Social</a>
          </nav>
        </div>
      </footer>
    </div>
  );
}
