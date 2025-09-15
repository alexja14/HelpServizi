import { CheckCircleIcon, ShieldCheckIcon, AcademicCapIcon, HandThumbUpIcon } from '@heroicons/react/24/solid'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Button } from './components/ui/button'
import { Card } from './components/ui/card'
import { useRef, useState, useEffect } from 'react'
import { PrivacyContent } from './components/PrivacyContent'
import { ExpectedResults } from './components/ExpectedResults'
import Section from './components/Section'
import SignupForm from './components/SignupForm'
import { FAQContent } from './components/FAQContent'
import TypingHeadline from './components/landing/TypingHeadline'
import Marquee from './components/landing/Marquee'
import AnimatedStatCard, { type Stat } from './components/landing/AnimatedStatCard'
import Footer from './components/Footer'


export default function LandingPage() {
  const heroRef = useRef<HTMLDivElement | null>(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const yCloud = useTransform(scrollYProgress, [0, 1], [0, 120])
  const [openSignup, setOpenSignup] = useState(false)
  // Drawer privacy (no modal): opened via left bookmark
  const [privacyOpen, setPrivacyOpen] = useState(false)
  const [faqOpen, setFaqOpen] = useState(false)
  const [successOpen, setSuccessOpen] = useState(false)
  const [alreadyRegistered, setAlreadyRegistered] = useState(false)

  // Smooth scroll utility (accounts for sticky header height)
  const smoothScrollTo = (selector: string) => {
    const el = document.querySelector(selector) as HTMLElement | null
    if (!el) return
    const headerOffset = 64 // approx header height
    const elementPosition = el.getBoundingClientRect().top + window.scrollY
    const offsetPosition = elementPosition - headerOffset
    window.scrollTo({ top: offsetPosition, behavior: 'smooth' })
  }

  const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>, selector: string) => {
    e.preventDefault()
    smoothScrollTo(selector)
  }

  // Prevent body scroll only when signup modal is open (privacy drawer is non-modal)
  useEffect(() => {
    if (openSignup) {
      const original = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => { document.body.style.overflow = original }
    }
  }, [openSignup])

  // Close signup modal on Escape
  useEffect(() => {
    if (!openSignup) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpenSignup(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [openSignup])

  // Close privacy drawer on Escape
  useEffect(() => {
    if (!privacyOpen) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setPrivacyOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [privacyOpen])
  // Close FAQ drawer on Escape
  useEffect(() => {
    if (!faqOpen) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setFaqOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [faqOpen])
  // Auto-hide success popup
  useEffect(() => {
    if (!successOpen) return
    const t = setTimeout(() => setSuccessOpen(false), 9000)
    return () => clearTimeout(t)
  }, [successOpen])
  // Close success popup on Escape
  useEffect(() => {
    if (!successOpen) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setSuccessOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [successOpen])

  // Read registration flag from localStorage
  useEffect(() => {
    try {
      const v = localStorage.getItem('lead_registered')
      setAlreadyRegistered(!!v)
    } catch {
      setAlreadyRegistered(false)
    }
  }, [])

  // When success popup opens, mark as registered (defensive if opened from other entry points)
  useEffect(() => {
    if (!successOpen) return
    try { localStorage.setItem('lead_registered', '1'); setAlreadyRegistered(true) } catch { }
  }, [successOpen])
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 selection:bg-brand-500/30">
      {/* Top bar */}
      <header className="sticky top-0 z-50 border-b border-gray-800 bg-gray-950/85 backdrop-blur">
        <div className="container mx-auto max-w-6xl px-4 h-14 flex items-center justify-between">
          <a className="flex items-center gap-2" href="#" aria-label="Home">
            <img src="/logo.svg" alt="Logo corso" className="h-6 w-6" />
            <span className="ml-1 font-semibold">AI GOL</span>
          </a>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <a href="#cosa" onClick={(e) => handleAnchorClick(e, '#cosa')} className="hover:text-brand-600 transition-colors">Competenze</a>
            <a href="#come" onClick={(e) => handleAnchorClick(e, '#come')} className="hover:text-brand-600 transition-colors">Metodo</a>
            <a href="#chi" onClick={(e) => handleAnchorClick(e, '#chi')} className="hover:text-brand-600 transition-colors">ANT</a>
            {/* Partner logo inline (single, larger) */}
            <div className="flex items-center pl-4 ml-2 border-l border-gray-800/70">
              <span className="sr-only">Partner istituzionali</span>
              <img
                src={new URL('./assets/partner/partners.png', import.meta.url).href}
                alt="Partner: UE NextGenerationEU, Repubblica Italiana, ANPAL, Ministero del Lavoro, Regione Lombardia, GOL"
                className="h-10 md:h-12 w-auto max-w-[460px] object-contain drop-shadow-sm opacity-90 hover:opacity-100 transition-opacity shrink-0"
                loading={'eager'}
                decoding="async"
              />
            </div>

          </nav>
          <div className="flex items-center gap-2">
            <Button
              asChild
              size="sm"
              className={`shadow-sm transition ${alreadyRegistered ? 'cursor-not-allowed opacity-60 hover:bg-brand-600' : ''}`}
              disabled={alreadyRegistered}
            >
              <a
                href={alreadyRegistered ? undefined : '#iscriviti'}
                onClick={(e) => {
                  if (alreadyRegistered) {
                    e.preventDefault();
                    return;
                  }
                  e.preventDefault();
                  setOpenSignup(true)
                }}
                aria-label={alreadyRegistered ? 'Già iscritto' : 'Iscriviti gratis ora'}
                aria-disabled={alreadyRegistered}
                tabIndex={alreadyRegistered ? -1 : 0}
                className={alreadyRegistered ? 'pointer-events-none select-none' : ''}
              >
                {alreadyRegistered ? 'Già iscritto' : 'Iscriviti'}
              </a>
            </Button>
          </div>
        </div>
      </header>

      {/* Partner strip removed; now inline in nav */}

      {/* (strip partner sopra la hero rimossa; la posizioniamo sotto la sezione Iscriviti) */}

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
              className="text-4xl sm:text-5xl font-extrabold leading-tight mb-5 tracking-tight"
            >
              <span className="block">
                <span className="relative inline-block word-glow">
                  <span className="word-text text-gradient-brand">Potenzia GRATIS</span>
                  <span aria-hidden className="word-particles">
                    {Array.from({ length: 10 }).map((_, i) => (
                      <span key={i} style={{ ['--tx' as any]: `${(Math.random() * 140 - 70).toFixed(0)}px`, ['--ty' as any]: `${(Math.random() * 60 - 30).toFixed(0)}px`, ['--dur' as any]: `${(5 + Math.random() * 4).toFixed(2)}s`, animationDelay: `${(Math.random() * 4).toFixed(2)}s` }} />
                    ))}
                  </span>
                </span>{' '}
                <span className="text-gradient-brand">la tua carriera </span><span className="word-text text-gradient-brand">con</span> <span className="word-text text-gradient-brand">AI GOL</span>

                <span className="relative inline-block word-glow ml-1">

                  <span aria-hidden className="word-particles">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i} style={{ ['--tx' as any]: `${(Math.random() * 100 - 50).toFixed(0)}px`, ['--ty' as any]: `${(Math.random() * 40 - 20).toFixed(0)}px`, ['--dur' as any]: `${(4 + Math.random() * 3).toFixed(2)}s`, animationDelay: `${(Math.random() * 3).toFixed(2)}s` }} />
                    ))}
                  </span>
                </span>
              </span>
              <span className="block mt-1 text-gray-300">

                <TypingHeadline phrases={["strumenti intelligenti", "automazioni smart", "progetti reali"]} />
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.12 }}
              className="text-gray-300 text-lg mb-7 max-w-xl"
            >
              Corso online 20 ore (5 moduli): live brevi in tutta l'Italia <strong>ONLINE</strong>. Strumenti concreti di Intelligenza Artificiale per CV, portfolio, colloqui e micro‑automazioni. Accessibile anche da smartphone. <span className="text-brand-400 font-semibold">GRATIS</span>
            </motion.p>
            <motion.div className="flex flex-wrap items-center gap-3 mb-8" initial="hidden" animate="show" variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}>
              {['Posti limitati', 'Mentor & career support', '100% pratico'].map(tag => (
                <motion.span key={tag} variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }} className="inline-flex items-center rounded-full bg-brand-600/15 text-brand-300 border border-brand-700/40 px-3 py-1 text-[11px] font-medium tracking-wide">
                  {tag}
                </motion.span>
              ))}
            </motion.div>
            <motion.div className="flex flex-wrap gap-4" initial="hidden" animate="show" variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12 } } }}>
              {[0, 2].map((i) => (
                <motion.div key={i} variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}>
                  {i === 0 && (
                    <Button onClick={() => { if (!alreadyRegistered) setOpenSignup(true) }} disabled={alreadyRegistered} className="relative h-12 px-8 text-base font-semibold bg-brand-600 hover:bg-brand-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400/70 rounded-md transition-colors cta-glow overflow-hidden disabled:opacity-60 disabled:hover:bg-brand-600" aria-label={alreadyRegistered ? 'Già iscritto' : 'Iscriviti gratis ora'}>
                      <span className="relative z-10">{alreadyRegistered ? 'Già iscritto' : 'Iscriviti gratis ora'}</span>
                      <span aria-hidden className="cta-particles">
                        {Array.from({ length: 14 }).map((_, p) => (
                          <span key={p} style={{
                            // random-ish positions via inline CSS custom props
                            ['--tx' as any]: `${(Math.random() * 120 - 60).toFixed(0)}px`,
                            ['--ty' as any]: `${(Math.random() * 60 - 30).toFixed(0)}px`,
                            ['--dur' as any]: `${(4 + Math.random() * 4).toFixed(2)}s`,
                            animationDelay: `${(Math.random() * 4).toFixed(2)}s`
                          }} />
                        ))}
                      </span>
                    </Button>
                  )}
                  {i === 2 && (
                    <Button variant="ghost" className="h-12 px-4 text-base hover:bg-gray-800" asChild aria-label="Scorri per saperne di più">
                      <a href="#cosa" onClick={(e) => handleAnchorClick(e, '#cosa')}>Scopri di più ↓</a>
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
                {[1, 2, 3].map(n => (
                  <img
                    key={n}
                    src={new URL(`./assets/review/${n}.png`, import.meta.url).href}
                    alt={`Recensione ${n}`}
                    className="h-7 w-7 rounded-full border border-gray-700 object-cover shadow"
                    loading="lazy"
                  />
                ))}
              </div>
              <span>Oltre 1.337 persone formate</span>
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
                <p className="text-xs leading-snug text-gray-400">Valutazione media su 1.337+ partecipanti
                  <br /><span className="font-medium text-brand-300">Iscriviti prima che si chiuda</span></p>
              </div>
            </motion.div>
          </div>
        </div>
        <div aria-hidden className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-400/40 to-transparent" />
      </section>


      {/* Sezione iscrizione spostata sotto la hero */}
      <Section id="iscriviti" title="Iscriviti ora: posti limitati, prossime sessioni di Autunno">
        <SignupForm alreadyRegistered={alreadyRegistered} onOpenPrivacy={() => setPrivacyOpen(true)} onSuccess={() => setSuccessOpen(true)} />
      </Section>

      {/* Sezione target specifica GOL (refactor stile cards) */}
      <Section title="Per chi è rivolto" id="per-chi">
        <motion.ul
          className="grid md:grid-cols-3 gap-4"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
        >
          {/* Prima colonna: requisiti */}
          <motion.li
            variants={{ hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0 } }}
            whileHover={{ y: -4 }}
            transition={{ type: 'spring', stiffness: 250, damping: 20 }}
            className="md:col-span-2"
          >
            <Card className="relative overflow-hidden p-5 bg-gray-900 border-gray-800 hover:border-brand-600/50 transition-colors h-full flex flex-col">
              <div aria-hidden className="absolute -top-10 -right-10 h-24 w-24 rounded-full bg-brand-500/10 blur-2xl" />
              <div className="font-semibold mb-2">Requisiti di accesso</div>
              <ul className="space-y-2 text-sm text-gray-300 flex-1">
                {[
                  'Disoccupati residenti/domiciliati in Lombardia',
                  'Beneficiari NASPI / DIS-COLL / SFL / ADI',
                  'Categorie fragili o svantaggiate (es. over 55, donne, disabilità)',
                  'Giovani in ingresso o reinserimento',
                  'Età indicativa 20–64 anni',
                  'Non aver concluso recentemente percorsi GOL analoghi',
                ].map(item => (
                  <li key={item} className="flex items-start gap-2">
                    <CheckCircleIcon className="h-4 w-4 text-green-500 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="text-[11px] text-gray-500 mt-3">L'idoneità viene confermata dagli enti competenti dopo la tua richiesta preliminare.</p>
            </Card>
          </motion.li>
          {/* Seconda colonna: cosa ottieni */}
          <motion.li
            variants={{ hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0 } }}
            whileHover={{ y: -4 }}
            transition={{ type: 'spring', stiffness: 250, damping: 20 }}
          >
            <Card className="relative overflow-hidden p-5 bg-gray-900 border-gray-800 hover:border-brand-600/50 transition-colors h-full flex flex-col">
              <div aria-hidden className="absolute -top-10 -right-10 h-24 w-24 rounded-full bg-brand-500/10 blur-2xl" />
              <div className="font-semibold mb-2">Cosa ottieni</div>
              <ul className="space-y-2 text-sm text-gray-300 flex-1">
                {[
                  '20h pratica (CV, portfolio, colloqui, micro‑automazioni)',
                  'Project work reale + mentor',
                  'Materiali on‑demand sempre accessibili',
                  'Metodo rapido: output verificabili',
                ].map(item => (
                  <li key={item} className="flex items-start gap-2">
                    <CheckCircleIcon className="h-4 w-4 text-green-500 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Button size="sm" className="mt-4" onClick={() => { if (!alreadyRegistered) setOpenSignup(true) }} disabled={alreadyRegistered}>
                {alreadyRegistered ? 'Già iscritto' : 'Richiedi accesso →'}
              </Button>
              <div className="mt-3 text-[11px] text-gray-500">Hai dubbi sui requisiti? Invia comunque la richiesta, ti aiutiamo a verificarli.</div>
            </Card>
          </motion.li>
        </motion.ul>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-2 rounded-full border border-gray-800 bg-gray-900/60 px-3 py-1 text-xs text-gray-300">
            <CheckCircleIcon className="h-4 w-4 text-green-500" />
            Non servono competenze tecniche avanzate
          </span>
        </div>
      </Section>

      {/* Prova sociale / Trust */}
      <Section title="Perché fidarti di noi" id="perche-fidarci">
        {/* Trust badges rifiniti */}
        <motion.ul
          className="grid sm:grid-cols-3 gap-3 mb-6"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06 } } }}
        >
          {[
            { icon: ShieldCheckIcon, title: 'Trasparenza reale', desc: 'Struttura, requisiti e modulistica spiegati prima di iscriverti' },
            { icon: AcademicCapIcon, title: 'Docenti senior', desc: 'Professionisti che applicano quotidianamente AI & automazione' },
            { icon: HandThumbUpIcon, title: 'Valutazioni alte', desc: 'Feedback verificati e continui miglioramenti' },
          ].map(({ icon: Icon, title, desc }) => (
            <motion.li key={title} variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}>
              <div className="group rounded-md border border-gray-800 bg-gray-900/70 px-4 py-3 flex items-center gap-3 hover:border-brand-600/40 transition-colors">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-brand-600/15 text-brand-300 border border-brand-700/40">
                  <Icon className="h-5 w-5" />
                </span>
                <div className="leading-tight">
                  <div className="text-sm font-semibold">{title}</div>
                  <div className="text-xs text-gray-400">{desc}</div>
                </div>
              </div>
            </motion.li>
          ))}
        </motion.ul>

        <div className="grid md:grid-cols-2 gap-8 mt-2 mb-8 text-sm leading-relaxed text-gray-300">
          <p><strong className="text-brand-300">Zero fuffa:</strong> ci concentriamo su competenze spendibili: prompt mirati, flussi semi‑automatici, portfolio, riposizionamento professionale. Ogni modulo termina con micro‑output verificabile (prompt validato, automazione, deliverable CV o pitch).</p>
          <p><strong className="text-brand-300">Metodo iterativo:</strong> brevi sessioni live + on‑demand subito disponibili, supporto asincrono e revisione deliverable. L'obiettivo è sbloccarti, non sovraccaricarti: micro‑progressi settimanali misurabili.</p>
        </div>

        {/* Animated stats */}
        <motion.div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6" initial="hidden" whileInView="show" viewport={{ once: true }} variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}>
          {(() => {
            const stats: Stat[] = [
              { label: 'Persone formate', type: 'num', value: 1337, format: (n) => Math.round(n).toLocaleString('it-IT') + '+' },
              { label: 'Valutazione media', type: 'num', value: 4.8, format: (n) => n.toFixed(1) + '/5' },
              { label: 'Percorso rapido', type: 'num', value: 2.5, format: (n) => n.toLocaleString('it-IT', { maximumFractionDigits: 1 }) + ' giornate' },
              { label: 'Supporto dedicato', type: 'text', text: 'Mentor' },
            ]
            return stats.map((stat) => (
              <motion.div key={stat.label} variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}>
                <AnimatedStatCard stat={stat} />
              </motion.div>
            ))
          })()}
        </motion.div>

        {/* Partner istituzionali — moved to hero; placeholder removed */}

        {/* Testimonials marquee */}
        <div className="mt-10">
          <div className="relative overflow-hidden">
            <div aria-hidden className="pointer-events-none absolute left-0 top-0 h-full w-16 bg-gradient-to-r from-gray-950 to-transparent" />
            <div aria-hidden className="pointer-events-none absolute right-0 top-0 h-full w-16 bg-gradient-to-l from-gray-950 to-transparent" />
            <Marquee speed={30}>
              {[
                { name: 'Marco R.', role: 'Analista junior', quote: 'Portfolio e colloqui in 3 settimane' },
                { name: 'Sara P.', role: 'Operazioni clienti', quote: 'Corso pratico: CV, colloqui, automazioni' },
                { name: 'Luca B.', role: 'Project Management Officer', quote: 'Lezioni chiare e mentoring utile' },
                { name: 'Giulia T.', role: 'Assistente HR', quote: 'Prompt e flussi subito utili al lavoro' },
                { name: 'Davide N.', role: 'Commerciale', quote: 'Micro‑automazioni che fanno risparmiare tempo' },
              ].map((t, i) => (
                <Card key={i} className="w-[280px] shrink-0 px-4 py-3 bg-gray-900/80 border-gray-800/80 shadow-sm">
                  <p className="text-sm italic leading-snug truncate">“{t.quote}”</p>
                  <footer className="mt-1 text-[11px] text-gray-400 whitespace-nowrap overflow-hidden text-ellipsis">{t.name} — {t.role}</footer>
                </Card>
              ))}
            </Marquee>
          </div>
        </div>

        {/* Programma GOL — card spostata sotto le testimonianze con titolo animato */}
        <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.6 }}>
          <Card className="mt-6 p-5 sm:p-6 bg-gray-900 border-gray-800 relative overflow-hidden">
            <div aria-hidden className="absolute -top-16 -right-10 h-40 w-40 rounded-full bg-brand-500/15 blur-3xl" />
            <div aria-hidden className="absolute -bottom-20 -left-10 h-48 w-48 rounded-full bg-brand-400/10 blur-3xl" />

            <h3 className="font-bold text-lg sm:text-xl mb-2 relative inline-block word-glow">
              <span className="word-text text-gradient-brand">GOL × ANT: formazione AI gratuita per ripartire</span>
              <span aria-hidden className="word-particles">
                {Array.from({ length: 10 }).map((_, i) => (
                  <span
                    key={i}
                    style={{ ['--tx' as any]: `${(Math.random() * 120 - 60).toFixed(0)}px`, ['--ty' as any]: `${(Math.random() * 50 - 25).toFixed(0)}px`, ['--dur' as any]: `${(4 + Math.random() * 3).toFixed(2)}s`, animationDelay: `${(Math.random() * 3).toFixed(2)}s` }}
                  />
                ))}
              </span>
            </h3>

            <p className="text-sm text-gray-300">
              Con GOL (Garanzia di Occupabilità dei Lavoratori) offriamo percorsi gratuiti per l’aggiornamento e il reinserimento lavorativo, in collaborazione con gli enti competenti.
            </p>
            <ul className="mt-3 space-y-2 text-sm text-gray-300 list-disc pl-5">
              <li>20 ore di formazione pratica su AI: CV, portfolio, colloqui e micro‑automazioni.</li>
              <li>Orientamento e accompagnamento al lavoro con mentor e project work reale.</li>
              <li>Formato flessibile: live + on‑demand, accessibile anche da smartphone.</li>
            </ul>
            <h4 className="mt-4 font-semibold relative inline-block word-glow text-base">
              <span className="word-text text-gradient-brand">Chi può aderire</span>
              <span aria-hidden className="word-particles">
                {Array.from({ length: 6 }).map((_, i) => (
                  <span
                    key={i}
                    style={{ ['--tx' as any]: `${(Math.random() * 80 - 40).toFixed(0)}px`, ['--ty' as any]: `${(Math.random() * 30 - 15).toFixed(0)}px`, ['--dur' as any]: `${(3.5 + Math.random() * 2.5).toFixed(2)}s`, animationDelay: `${(Math.random() * 2.5).toFixed(2)}s` }}
                  />
                ))}
              </span>
            </h4>
            <div aria-hidden className="h-px w-24 bg-gradient-to-r from-brand-500/60 to-transparent mt-1"></div>
            <p className="text-sm text-gray-300 mt-1">
              Disoccupati residenti o domiciliati in Lombardia, inclusi beneficiari di NASPI, DIS‑COLL, Supporto per la Formazione e il Lavoro e Assegno d’Inclusione.
            </p>
            {alreadyRegistered ? (
              <span
                className="inline-flex items-center mt-3 text-sm font-medium text-gray-500/70 cursor-not-allowed select-none"
                aria-disabled="true"
              >
                Già iscritto
              </span>
            ) : (
              <button
                type="button"
                onClick={() => setOpenSignup(true)}
                className="group inline-flex items-center mt-3 text-brand-300 hover:underline text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400/60 rounded"
                aria-label="Richiedi l'accesso (apre modulo iscrizione)"
              >
                <span>Richiedi l’accesso</span>
                <span
                  aria-hidden
                  className="ml-1 transition-transform group-hover:translate-x-0.5"
                >
                  →
                </span>
              </button>
            )}
          </Card>
        </motion.div>
      </Section>

      {/* (strip partner spostata accanto alla sezione recensioni) */}



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
          <ExpectedResults />
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
          Durata: 20 ore (5 moduli) · Formato: Online, anche "solo mode" · Supporto: Mentor, office hour, materiali sempre disponibili
        </div>
      </Section>

      {/* Programma dettagliato rimosso su richiesta */}

      {/* Sezione 'A chi è rivolto' originale rimossa dopo refactor */}

      {/* Chi siamo */}
      <Section id="chi" title="Chi siamo">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <p className="text-gray-300 leading-relaxed">
              ANT Srl è una realtà di formazione e consulenza IT nata per colmare lo skill gap nel mondo digitale. Progettiamo percorsi pratici e orientati all’occupabilità, connettendo giovani talenti e aziende e trasferendo competenze subito spendibili.
            </p>
            <h3 className="mt-4 font-semibold">La nostra esperienza formativa</h3>
            <p className="text-sm text-gray-400 leading-relaxed mt-1">
              Negli ultimi anni abbiamo supportato lo sviluppo produttivo di circa 40 aziende italiane con programmi altamente professionalizzanti. La collaborazione continua con partner che realizzano progetti software e consulenza IT ci consente di mantenere il polso del mercato e predisporre corsi efficaci, realmente orientati alle esigenze delle imprese.
            </p>
            <p className="text-sm text-gray-400 leading-relaxed mt-2">
              L’esperienza maturata ci permette di garantire standard qualitativi elevati in tutte le fasi del processo formativo: dalla progettazione alla docenza, fino al supporto e placement.
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

      {/* (sezione Partner con titolo rimossa; ora la strip è sopra la hero) */}

      {/* (sezione iscrizione originale rimossa) */}

      {/* FAQ */}
      <Section id="faq" title="Domande frequenti">
        <FAQContent columns={2} />
      </Section>


      {/* Footer */}
      <Footer />
      {/* Modal Iscrizione */}
      {openSignup && (
        <div role="dialog" aria-modal="true" aria-labelledby="signup-modal-title" className="fixed inset-0 z-[100] flex items-start sm:items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setOpenSignup(false)} aria-hidden />
          <motion.div initial={{ opacity: 0, y: 30, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20 }} className="relative w-full max-w-3xl mx-auto">
            <Card className="p-6 md:p-8 bg-gray-950 border-gray-800 shadow-xl">
              <div className="flex items-start justify-between mb-5">
                <div>
                  <h2 id="signup-modal-title" className="text-xl sm:text-2xl font-bold tracking-tight">Iscriviti ora</h2>
                  <p className="text-xs text-gray-400 mt-1">Posti limitati per le prossime sessioni di Autunno</p>
                </div>
                <button onClick={() => setOpenSignup(false)} aria-label="Chiudi modale" className="rounded px-2 py-1 text-gray-400 hover:text-white hover:bg-gray-800">✕</button>
              </div>
              <SignupForm
                alreadyRegistered={alreadyRegistered}
                onSuccess={() => {
                  // Close modal first, then show success popup to avoid overlap
                  setOpenSignup(false)
                  setTimeout(() => setSuccessOpen(true), 350)
                  try { localStorage.setItem('lead_registered', '1'); setAlreadyRegistered(true) } catch { }
                }}
                onOpenPrivacy={() => setPrivacyOpen(true)}
              />
              <p className="mt-4 text-[11px] text-gray-500">Compilando registri il tuo interesse. Ti ricontattiamo con i prossimi slot.</p>
            </Card>
          </motion.div>
        </div>
      )}
      {/* Success Popup */}
      {successOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-black/40 z-0"
            onClick={() => { setSuccessOpen(false); setOpenSignup(false); setPrivacyOpen(false) }}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: 'spring', stiffness: 320, damping: 24 }}
            className="relative w-full max-w-md z-10"
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
            onMouseDown={(e: React.MouseEvent) => e.stopPropagation()}
            onKeyDown={(e: React.KeyboardEvent) => e.stopPropagation()}
            role="alertdialog"
            aria-labelledby="success-title"
            aria-describedby="success-desc"
          >
            <Card className="overflow-hidden border-gray-800 bg-gray-950">
              <div aria-hidden className="absolute -top-20 -right-24 h-56 w-56 rounded-full bg-brand-500/20 blur-3xl pointer-events-none z-0" />
              <div className="relative z-10 p-6">
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-full bg-green-600/20 text-green-400 border border-green-700/40 relative">
                    <CheckCircleIcon className="h-6 w-6" />
                    {/* success particles */}
                    <span aria-hidden className="absolute inset-0 pointer-events-none">
                      {Array.from({ length: 10 }).map((_, i) => (
                        <span key={i} className="absolute block h-1 w-1 bg-green-400/80 rounded-full" style={{
                          left: '50%', top: '50%',
                          transform: `translate(-50%, -50%)`,
                          ['--tx' as any]: `${(Math.random() * 140 - 70).toFixed(0)}px`,
                          ['--ty' as any]: `${(Math.random() * 80 - 40).toFixed(0)}px`,
                          animation: `popup-spark ${(2.4 + Math.random()).toFixed(2)}s ease-out ${(Math.random() * 0.6).toFixed(2)}s forwards`
                        }} />
                      ))}
                    </span>
                  </span>
                  <div>
                    <h3 id="success-title" className="text-lg font-bold tracking-tight">Grazie! Iscrizione inviata</h3>
                    <p id="success-desc" className="text-sm text-gray-300 mt-1">Abbiamo registrato la tua richiesta. Ti contatteremo al più presto con i prossimi slot e tutte le informazioni utili.</p>
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setSuccessOpen(false);
                      setOpenSignup(false);
                      setPrivacyOpen(false);
                      setTimeout(() => setSuccessOpen(false), 0);
                    }}
                    className="relative z-20 pointer-events-auto px-3 py-1.5 text-sm rounded bg-gray-800 hover:bg-gray-700 border border-gray-700"
                  >
                    Chiudi
                  </button>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      )}
      {/* Privacy left bookmark + slide-out drawer (non-modal) */}
      {/* Bookmark */}
      <button
        type="button"
        onClick={() => setPrivacyOpen(true)}
        aria-label="Apri informativa privacy"
        className="fixed left-0 top-1/2 -translate-y-1/2 z-[60] -ml-1 h-28 w-9 sm:w-10 rounded-r-md border border-l-0 border-brand-700/40 bg-brand-600/90 text-white shadow hover:bg-brand-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400"
      >
        <span className="block w-full text-center text-[10px] font-semibold tracking-wide" style={{ transform: 'rotate(-90deg)' }}>
          Privacy
        </span>
      </button>
      {/* Drawer panel */}
      <motion.aside
        role="complementary"
        aria-labelledby="privacy-drawer-title"
        className="fixed top-0 left-0 h-full w-[92%] sm:w-[460px] max-w-[92%] z-[70]"
        initial={false}
        animate={{ x: privacyOpen ? 0 : '-100%' }}
        transition={{ type: 'spring', stiffness: 380, damping: 34 }}
      >
        <Card className="h-full bg-gray-950/98 border-gray-800 rounded-none rounded-r-lg shadow-2xl flex flex-col">
          <div className="flex items-start justify-between gap-3 p-4 sm:p-5 border-b border-gray-800 bg-gray-950/80">
            <div>
              <h2 id="privacy-drawer-title" className="text-base sm:text-lg font-bold tracking-tight">Informativa Privacy</h2>
              <a href="#privacy" className="text-[11px] text-brand-300 hover:underline" onClick={() => setPrivacyOpen(false)}>Apri pagina completa →</a>
            </div>
            <button onClick={() => setPrivacyOpen(false)} aria-label="Chiudi privacy" className="rounded px-2 py-1 text-gray-400 hover:text-white hover:bg-gray-800">✕</button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 sm:p-5">
            <PrivacyContent />
          </div>
        </Card>
      </motion.aside>
      {/* FAQ right bookmark */}
      <button
        type="button"
        onClick={() => setFaqOpen(true)}
        aria-label="Apri domande frequenti"
        className="fixed right-0 top-1/2 -translate-y-1/2 z-[60] -mr-1 h-28 w-9 sm:w-10 rounded-l-md border border-r-0 border-indigo-700/40 bg-indigo-600/90 text-white shadow hover:bg-indigo-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
      >
        <span className="block w-full text-center text-[10px] font-semibold tracking-wide" style={{ transform: 'rotate(90deg)' }}>
          FAQ
        </span>
      </button>
      {/* FAQ Drawer panel (non-modal) */}
      <motion.aside
        role="complementary"
        aria-labelledby="faq-drawer-title"
        className="fixed top-0 right-0 h-full w-[92%] sm:w-[460px] max-w-[92%] z-[70]"
        initial={false}
        animate={{ x: faqOpen ? 0 : '100%' }}
        transition={{ type: 'spring', stiffness: 380, damping: 34 }}
      >
        <Card className="h-full bg-gray-950/98 border-gray-800 rounded-none rounded-l-lg shadow-2xl flex flex-col">
          <div className="flex items-start justify-between gap-3 p-4 sm:p-5 border-b border-gray-800 bg-gray-950/80">
            <div>
              <h2 id="faq-drawer-title" className="text-base sm:text-lg font-bold tracking-tight">Domande frequenti</h2>
              <a href="#faq-page" className="text-[11px] text-indigo-300 hover:underline" onClick={() => setFaqOpen(false)}>Apri pagina completa →</a>
            </div>
            <button onClick={() => setFaqOpen(false)} aria-label="Chiudi FAQ" className="rounded px-2 py-1 text-gray-400 hover:text-white hover:bg-gray-800">✕</button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 sm:p-5">
            <FAQContent />
          </div>
        </Card>
      </motion.aside>
    </div>
  );
}
