import { CheckCircleIcon, ShieldCheckIcon, AcademicCapIcon, HandThumbUpIcon, BriefcaseIcon, ArrowTrendingUpIcon } from '@heroicons/react/24/solid'
import { motion, useScroll, useTransform, useInView, useMotionValue, useAnimationFrame } from 'framer-motion'
import { Button } from './components/ui/button'
import { Card } from './components/ui/card'
import { useRef, useState, useEffect, useMemo } from 'react'
import type { ReactNode } from 'react'
import { PrivacyContent } from './components/PrivacyContent'
import { FAQContent } from './components/FAQContent'
import { ExpectedResults } from './components/ExpectedResults'

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

// Reusable signup form component (used in section + modal)
function SignupForm({ onSuccess, onOpenPrivacy }: { onSuccess?: () => void; onOpenPrivacy?: () => void }) {
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
    // cafFlag non è più obbligatorio
    if (!(consent && unemployed)) return
    try {
      setStatus('saving')
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, lastName, email, phone, cafFlag, unemployed, consent })
      })
      if (!res.ok) throw new Error('fail')
      setStatus('done')
      onSuccess?.()
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
      <button disabled={!(consent && unemployed) || status === 'saving' || status === 'done'} className="relative md:col-span-1 rounded font-semibold text-white px-5 py-3 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cta-glow cta-animated overflow-hidden" aria-label="Iscriviti gratis ora">
        <span className="relative z-10">
          {status === 'done' ? 'Registrato ✓' : status === 'saving' ? 'Invio...' : 'Iscriviti gratis'}
        </span>
        <span aria-hidden className="cta-particles">
          {Array.from({ length: 8 }).map((_, p) => (
            <span key={p} style={{ ['--tx' as any]: `${(Math.random() * 90 - 45).toFixed(0)}px`, ['--ty' as any]: `${(Math.random() * 40 - 20).toFixed(0)}px`, ['--dur' as any]: `${(4 + Math.random() * 3).toFixed(2)}s`, animationDelay: `${(Math.random() * 3).toFixed(2)}s` }} />
          ))}
        </span>
      </button>
      <div className="md:col-span-4 grid gap-2">
        <label className="flex items-start gap-2 text-xs text-gray-400">
          <input type="checkbox" className="mt-0.5 h-4 w-4 rounded bg-gray-900 border-gray-700" checked={cafFlag} onChange={e => setCafFlag(e.target.checked)} aria-label="Flag CAF" />
          <span>È il primo corso che seguo tramite il CAF (opzionale)</span>
        </label>
        <label className={`flex items-start gap-2 text-xs ${attempted && !unemployed ? 'text-red-400' : 'text-gray-400'}`}>
          <input type="checkbox" className={`mt-0.5 h-4 w-4 rounded bg-gray-900 ${attempted && !unemployed ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-700'}`} checked={unemployed} onChange={e => setUnemployed(e.target.checked)} aria-label="Flag disoccupato" />
          <span>Dichiaro di essere attualmente disoccupato {attempted && !unemployed && <em className="not-italic text-red-400">(obbligatorio)</em>}</span>
        </label>
        <label className={`flex items-start gap-2 text-xs ${attempted && !consent ? 'text-red-400' : 'text-gray-400'}`}>
          <input type="checkbox" className={`mt-0.5 h-4 w-4 rounded bg-gray-900 ${attempted && !consent ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-700'}`} checked={consent} onChange={e => setConsent(e.target.checked)} aria-label="Consenso trattamento dati" />
          <span>Acconsento al trattamento dei dati (email & telefono) <button type="button" onClick={() => onOpenPrivacy?.()} className="text-brand-300 hover:underline focus:outline-none">Informativa</button> {attempted && !consent && <em className="not-italic text-red-400">(obbligatorio)</em>}</span>
        </label>
        <p className="text-[10px] text-gray-500">Niente spam. Revoca in qualunque momento. {status === 'error' && <span className="text-red-400 ml-2">Errore, riprova.</span>}</p>
      </div>
    </form>
  )
}
// Typing effect component (progressively reveals phrases)
function TypingHeadline({ phrases, className }: { phrases: string[]; className?: string }) {
  const [index, setIndex] = useState(0)
  const [subIndex, setSubIndex] = useState(0)
  const [deleting, setDeleting] = useState(false)
  const [blinkCaret, setBlinkCaret] = useState(true)
  const longest = useMemo(() => phrases.reduce((a, b) => (b.length > a.length ? b : a), ''), [phrases])

  useEffect(() => {
    const current = phrases[index]
    if (!deleting && subIndex === current.length) {
      const pause = setTimeout(() => setDeleting(true), 1400)
      return () => clearTimeout(pause)
    }
    if (deleting && subIndex === 0) {
      setDeleting(false)
      setIndex((i) => (i + 1) % phrases.length)
      return
    }
    const timeout = setTimeout(() => {
      setSubIndex((s) => s + (deleting ? -1 : 1))
    }, deleting ? 30 : 55)
    return () => clearTimeout(timeout)
  }, [subIndex, deleting, index, phrases])

  useEffect(() => {
    const blink = setInterval(() => setBlinkCaret((b) => !b), 500)
    return () => clearInterval(blink)
  }, [])

  const text = phrases[index].slice(0, subIndex)
  return (
    <span
      className={(className || '') + ' typing-inline inline-grid relative'}
      style={{ whiteSpace: 'nowrap' }}
    >
      {/* Invisible static placeholder locks width & height, preventing any layout shift */}
      <span className="invisible col-start-1 row-start-1 pointer-events-none select-none">{longest}</span>
      <span className="col-start-1 row-start-1">
        {text}
        <span
          aria-hidden
          className="inline-block align-middle ml-0.5"
          style={{
            width: '2px',
            height: '1em',
            background: 'currentColor',
            opacity: blinkCaret ? 1 : 0,
            transition: 'opacity 0.15s linear'
          }}
        />
      </span>
    </span>
  )
}

// Simple count-up hook (triggers once when inView becomes true)
function useCountUp(target: number, durationSec: number, start: boolean) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    if (!start) return
    let raf = 0
    const startTs = performance.now()
    const step = (now: number) => {
      const p = Math.min((now - startTs) / (durationSec * 1000), 1)
      // easeOutCubic
      const eased = 1 - Math.pow(1 - p, 3)
      setValue(target * eased)
      if (p < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [target, durationSec, start])
  return value
}

// Shared type for stats and animated card component
type Stat = { label: string; type: 'num' | 'text'; value?: number; format?: (n: number) => string; text?: string }

function AnimatedStatCard({ stat }: { stat: Stat }) {
  const ref = useRef<HTMLDivElement | null>(null)
  const inView = useInView(ref, { amount: 0.6, once: true })
  const val = useCountUp(stat.type === 'num' ? (stat.value ?? 0) : 0, 1.2, inView)
  const display = stat.type === 'num' ? (stat.format ? stat.format(val) : Math.round(val).toString()) : stat.text
  return (
    <div ref={ref}>
      <Card className="p-5 hover:shadow-md transition-shadow bg-gray-900 border-gray-800 relative overflow-hidden">
        <div aria-hidden className="absolute -top-10 -left-10 h-24 w-24 rounded-full bg-brand-500/10 blur-2xl" />
        <div className="text-3xl font-bold tracking-tight">{display}</div>
        <div className="text-sm text-gray-400">{stat.label}</div>
      </Card>
    </div>
  )
}

function Marquee({ children, speed = 40 }: { children: ReactNode[]; speed?: number }) {
  // speed in px/sec
  const wrapRef = useRef<HTMLDivElement | null>(null)
  const trackRef = useRef<HTMLDivElement | null>(null)
  const [trackW, setTrackW] = useState(0)
  const [clones, setClones] = useState(2) // minimum 2 tracks to loop
  const x = useMotionValue(0)

  useEffect(() => {
    const el = trackRef.current
    const wrap = wrapRef.current
    if (!el) return
    const update = () => {
      const base = el.scrollWidth
      const wrapW = wrap?.clientWidth ?? 0
      setTrackW(base)
      if (base > 0 && wrapW > 0) {
        const needed = Math.max(2, Math.ceil(wrapW / base) + 1) // enough to always cover viewport
        setClones(needed)
      }
    }
    const ro = new ResizeObserver(update)
    ro.observe(el)
    if (wrap) ro.observe(wrap)
    update()
    return () => ro.disconnect()
  }, [])

  // RAF-driven loop to avoid keyframe resets
  useAnimationFrame((_, delta) => {
    if (trackW <= 0) return
    const dist = (speed * delta) / 1000 // px advanced this frame
    let next = x.get() - dist
    // Robust wrap to handle large frame gaps (e.g., background tab throttling)
    if (next <= -trackW || next > 0) {
      // keep x in [-trackW, 0)
      next = -(((-next) % trackW))
    }
    x.set(next)
  })

  // Normalize x when content width changes (images load / resize)
  useEffect(() => {
    if (trackW <= 0) return
    const cur = x.get()
    if (cur < -trackW || cur > 0) {
      x.set(-(((-cur) % trackW)))
    }
  }, [trackW])

  return (
    <div ref={wrapRef} className="overflow-hidden">
      <motion.div className="flex gap-3 will-change-transform" style={{ x }}>
        <div ref={trackRef} className="flex gap-3">{children}</div>
        {Array.from({ length: Math.max(1, clones - 1) }).map((_, i) => (
          <div key={i} className="flex gap-3" aria-hidden>
            {children}
          </div>
        ))}
      </motion.div>
    </div>
  )
}

export default function LandingPage() {
  const heroRef = useRef<HTMLDivElement | null>(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const yCloud = useTransform(scrollYProgress, [0, 1], [0, 120])
  const [openSignup, setOpenSignup] = useState(false)
  // Drawer privacy (no modal): opened via left bookmark
  const [privacyOpen, setPrivacyOpen] = useState(false)
  const [faqOpen, setFaqOpen] = useState(false)

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
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 selection:bg-brand-500/30">
      {/* Top bar */}
      <header className="sticky top-0 z-50 border-b border-gray-800 bg-gray-950/85 backdrop-blur">
        <div className="container mx-auto max-w-6xl px-4 h-14 flex items-center justify-between">
          <a className="flex items-center gap-2" href="#" aria-label="Home">
            <img src="/logo.svg" alt="Logo corso" className="h-6 w-6" />
            <span className="ml-1 font-semibold">AI GOL</span>
          </a>
          <nav className="hidden md:flex gap-6 text-sm font-medium">
            <a href="#programma" onClick={(e) => handleAnchorClick(e, '#programma')} className="hover:text-brand-600 transition-colors">Programma</a>
            <a href="#cosa" onClick={(e) => handleAnchorClick(e, '#cosa')} className="hover:text-brand-600 transition-colors">Competenze</a>
            <a href="#come" onClick={(e) => handleAnchorClick(e, '#come')} className="hover:text-brand-600 transition-colors">Metodo</a>
            <a href="#chi" onClick={(e) => handleAnchorClick(e, '#chi')} className="hover:text-brand-600 transition-colors">ANT</a>
            <a href="#partners" onClick={(e) => handleAnchorClick(e, '#partners')} className="hover:text-brand-600 transition-colors">Partner</a>
            <a href="#faq" onClick={(e) => handleAnchorClick(e, '#faq')} className="hover:text-brand-600 transition-colors">FAQ</a>
            <a href="#iscriviti" onClick={(e) => { e.preventDefault(); setOpenSignup(true) }} className="hover:text-brand-600 transition-colors cursor-pointer">Iscriviti</a>
          </nav>
          <div className="flex items-center gap-2">
            <Button asChild size="sm" className="shadow-sm">
              <a href="#iscriviti" onClick={(e) => { e.preventDefault(); setOpenSignup(true) }} aria-label="Iscriviti gratis ora">Iscriviti</a>
            </Button>
          </div>
        </div>
      </header>

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
                    <Button onClick={() => setOpenSignup(true)} className="relative h-12 px-8 text-base font-semibold bg-brand-600 hover:bg-brand-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400/70 rounded-md transition-colors cta-glow overflow-hidden" aria-label="Iscriviti gratis ora">
                      <span className="relative z-10">Iscriviti gratis ora</span>
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

      {/* Sezione iscrizione spostata sotto la hero */}
      <Section id="iscriviti" title="Iscriviti ora: posti limitati, prossime sessioni di Autunno">
        <SignupForm onOpenPrivacy={() => setPrivacyOpen(true)} />
      </Section>

      {/* Prova sociale (spostata sotto "Cosa imparerai") */}
      <Section title="Perché fidarti di noi">
        {/* Trust badges */}
        <motion.ul
          className="grid sm:grid-cols-3 gap-3 mb-6"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06 } } }}
        >
          {[
            { icon: ShieldCheckIcon, title: 'Trasparenza', desc: 'Info chiare, niente sorprese' },
            { icon: AcademicCapIcon, title: 'Docenti senior', desc: 'Pratica su casi reali' },
            { icon: HandThumbUpIcon, title: 'Valutazioni top', desc: 'Community soddisfatta' },
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

        {/* Animated stats */}
        <motion.div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6" initial="hidden" whileInView="show" viewport={{ once: true }} variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}>
          {(() => {
            const stats: Stat[] = [
              { label: 'Persone formate', type: 'num', value: 1000, format: (n) => Math.round(n).toLocaleString('it-IT') + '+' },
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

        {/* Partner istituzionali — strip adiacente alle review */}
        <div id="partners" className="mt-10">
          <div className="relative overflow-hidden rounded-md border border-gray-800 bg-gray-900/60 p-3 sm:p-4">
            <div aria-hidden className="pointer-events-none absolute left-0 top-0 h-full w-16 bg-gradient-to-r from-gray-900/60 to-transparent" />
            <div aria-hidden className="pointer-events-none absolute right-0 top-0 h-full w-16 bg-gradient-to-l from-gray-900/60 to-transparent" />
            <Marquee speed={24}>
              {[0,1,2,3].map((i) => (
                <img
                  key={i}
                  src={new URL('./assets/partner/partners.png', import.meta.url).href}
                  alt={i === 0 ? "Loghi: Finanziato dall'Unione europea – NextGenerationEU, Repubblica Italiana, ANPAL – Agenzia Nazionale Politiche Attive del Lavoro, Ministero del Lavoro e delle Politiche Sociali, Regione Lombardia, GOL – Garanzia Occupabilità Lavoratori" : ''}
                  aria-hidden={i !== 0}
                  className="h-10 sm:h-12 md:h-14 lg:h-16 w-auto object-contain shrink-0"
                  loading={i === 0 ? 'eager' : 'lazy'}
                />
              ))}
            </Marquee>
          </div>
        </div>

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
            <a
              href="#iscriviti"
              onClick={(e) => {
                e.preventDefault()
                const el = document.querySelector('#iscriviti') as HTMLElement | null
                if (!el) return
                const y = el.getBoundingClientRect().top + window.scrollY - 64
                window.scrollTo({ top: y, behavior: 'smooth' })
              }}
              className="inline-block mt-3 text-brand-300 hover:underline text-sm font-medium"
            >
              Richiedi l’accesso →
            </a>
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

      {/* Programma dettagliato */}
      <Section id="programma" title="Programma del corso (20 ore)">
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="p-6 bg-gray-900 border-gray-800 md:col-span-2">
            <h3 className="font-semibold mb-3">5 moduli · obiettivi e risultati</h3>
            <ul className="space-y-3 text-sm">
              {[
                'Modulo 1 · Capire l’IA: cos’è, limiti, rischi, trend (con checklist uso consapevole).',
                'Modulo 2 · Il lavoro che cambia: mappa mansioni, competenze future‑proof, mini‑piano.',
                'Modulo 3 · Prompt engineering: obiettivo, contesto, vincoli, esempi, iterazione.',
                'Modulo 4 · Casi reali: flussi assistiti da IA per settori (amministrativo, vendite, retail, social...).',
                'Modulo 5 · Project work + etica/prassi: portfolio AI e piano azione 30 giorni.'
              ].map((t) => (
                <li key={t} className="flex items-start gap-2">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mt-0.5" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </Card>
          <ExpectedResults
            title="Risultati attesi"
            items={[
              '2 progetti utilizzando tool AI',
              'Skill pratici',
              'Utilizzo prompt engineering',
            ]}
          />
        </div>
      </Section>

      {/* A chi è rivolto */}
      <Section title="A chi è rivolto">
        <motion.ul
          className="grid md:grid-cols-3 gap-4"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
        >
          {[
            {
              icon: BriefcaseIcon,
              title: 'In cerca di lavoro',
              bullets: ['CV e colloqui con AI', 'Portfolio in 2 settimane'],
            },
            {
              icon: AcademicCapIcon,
              title: 'Neodiplomati/neolaureati',
              bullets: ['Competenze subito pratiche', 'Orientamento e mentoring'],
            },
            {
              icon: ArrowTrendingUpIcon,
              title: 'In transizione o rientro',
              bullets: ['Reskilling rapido', 'Automazioni leggere per il lavoro'],
            },
          ].map(({ icon: Icon, title, bullets }) => (
            <motion.li
              key={title}
              variants={{ hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0 } }}
              whileHover={{ y: -4 }}
              transition={{ type: 'spring', stiffness: 250, damping: 20 }}
            >
              <Card className="relative overflow-hidden p-5 bg-gray-900 border-gray-800 hover:border-brand-600/50 transition-colors">
                <div aria-hidden className="absolute -top-10 -right-10 h-24 w-24 rounded-full bg-brand-500/10 blur-2xl" />
                <div className="flex items-start gap-3">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-brand-600/15 text-brand-300 border border-brand-700/40">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <div className="font-semibold">{title}</div>
                    <ul className="mt-1 space-y-1 text-sm text-gray-300">
                      {bullets.map((b) => (
                        <li key={b} className="flex items-start gap-2">
                          <CheckCircleIcon className="h-4 w-4 mt-0.5 text-green-500" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Card>
            </motion.li>
          ))}
        </motion.ul>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-2 rounded-full border border-gray-800 bg-gray-900/60 px-3 py-1 text-xs text-gray-300">
            <CheckCircleIcon className="h-4 w-4 text-green-500" />
            Non servono competenze tecniche avanzate
          </span>
          <Button size="sm" className="h-8" onClick={() => setOpenSignup(true)}>Mi riconosco: iscrivimi →</Button>
        </div>
      </Section>

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
        <div className="grid md:grid-cols-2 gap-6">
          {[
            { q: 'Serve esperienza tecnica?', a: 'No, partiamo da zero.' },
            { q: 'Quanto costa?', a: 'Iscrizione gratuita' },
            { q: 'Quanto tempo richiede?', a: '4 ore al giorno.' },
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
            <div className="font-semibold">AI GOL</div>
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
              <SignupForm onSuccess={() => setTimeout(() => setOpenSignup(false), 1400)} onOpenPrivacy={() => setPrivacyOpen(true)} />
              <p className="mt-4 text-[11px] text-gray-500">Compilando registri il tuo interesse. Ti ricontattiamo con i prossimi slot.</p>
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
