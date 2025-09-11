import { useMemo, useRef, useState } from 'react'

type Props = { onSuccess?: () => void; onOpenPrivacy?: () => void; alreadyRegistered?: boolean }

export function SignupForm({ onSuccess, onOpenPrivacy, alreadyRegistered = false }: Props) {
  const [consent, setConsent] = useState(false)
  const [cafFlag, setCafFlag] = useState(false)
  const [unemployed, setUnemployed] = useState(false)
  const [attempted, setAttempted] = useState(false)
  const [status, setStatus] = useState<'idle' | 'saving' | 'done' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')

  const nameRef = useRef<HTMLInputElement | null>(null)
  const lastNameRef = useRef<HTMLInputElement | null>(null)
  const emailRef = useRef<HTMLInputElement | null>(null)
  const phoneRef = useRef<HTMLInputElement | null>(null)

  // Simple validators with Italian messages
  const errors = useMemo(() => {
  const errs: Partial<Record<'name' | 'lastName' | 'email' | 'phone', string>> = {}
    const onlyLetters = /^[A-Za-zÀ-ÖØ-öø-ÿ'`\-\s]{2,80}$/
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
    const phoneRegex = /^\+?[0-9\s().-]{6,}$/
  if (!name.trim()) errs.name = 'Nome: obbligatorio'
  else if (!onlyLetters.test(name.trim())) errs.name = 'Nome: usare solo lettere (min 2)'
  if (!lastName.trim()) errs.lastName = 'Cognome: obbligatorio'
  else if (!onlyLetters.test(lastName.trim())) errs.lastName = 'Cognome: usare solo lettere (min 2)'
  if (!email.trim()) errs.email = 'Email: obbligatoria'
  else if (!emailRegex.test(email.trim())) errs.email = 'Email non valida (es. nome@dominio.it)'
  if (phone.trim() && !phoneRegex.test(phone.trim())) errs.phone = 'Telefono non valido'
    return errs
  }, [name, lastName, email, phone])

  const hasFieldErrors = Object.keys(errors).length > 0
  // 'unemployed' non è più obbligatorio; la submit verifica solo errori campi e consenso
  // UX: button becomes clickable as soon as consent is given
  const canClick = consent && status !== 'saving' && status !== 'done' && !alreadyRegistered
  // Show legend only if there are real errors (or missing consent), and not while saving/done
  const showLegend = attempted && (hasFieldErrors || !consent) && status !== 'saving' && status !== 'done'

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setAttempted(true)
  setErrorMsg(null)
    // focus first invalid
    if (errors.name) nameRef.current?.focus()
    else if (errors.lastName) lastNameRef.current?.focus()
    else if (errors.email) emailRef.current?.focus()
    else if (errors.phone) phoneRef.current?.focus()
  if (hasFieldErrors || !consent) return
    try {
      setStatus('saving')
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, lastName, email, phone, cafFlag, unemployed, consent })
      })
      if (!res.ok) {
        let msg = 'Errore di invio, riprova tra poco.'
        try {
          const data = await res.json()
          if (data?.error === 'email already exists' || res.status === 409) msg = 'Questa email risulta già registrata.'
          else if (res.status === 400) msg = 'Dati mancanti o non validi. Controlla i campi.'
          else if (res.status >= 500) msg = 'Errore del server. Riprova più tardi.'
        } catch {
          // ignore JSON parse error, keep default msg
        }
        setStatus('error')
        setErrorMsg(msg)
        return
      }
      setStatus('done')
      // Persist locally that this device has completed the signup
      try { localStorage.setItem('lead_registered', '1') } catch {}
      onSuccess?.()
    } catch {
      setStatus('error')
      setErrorMsg('Problema di rete o server non raggiungibile.')
    }
  }

  return (
    <form noValidate onSubmit={handleSubmit} className="grid md:grid-cols-5 gap-4 text-sm" aria-label="Form di iscrizione iniziale">
      <div className="md:col-span-1">
        <input
          ref={nameRef}
          value={name}
          onChange={e => setName(e.target.value)}
          className={`border ${attempted && errors.name ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-800'} bg-gray-900 rounded px-4 py-3 w-full placeholder:text-gray-500`}
          name="name"
          placeholder="Nome"
          aria-label="Nome"
          aria-invalid={attempted && !!errors.name}
          disabled={alreadyRegistered || status === 'saving' || status === 'done'}
        />
      </div>
      <div className="md:col-span-1">
        <input
          ref={lastNameRef}
          value={lastName}
          onChange={e => setLastName(e.target.value)}
          className={`border ${attempted && errors.lastName ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-800'} bg-gray-900 rounded px-4 py-3 w-full placeholder:text-gray-500`}
          name="lastName"
          placeholder="Cognome"
          aria-label="Cognome"
          aria-invalid={attempted && !!errors.lastName}
          disabled={alreadyRegistered || status === 'saving' || status === 'done'}
        />
      </div>
      <div className="md:col-span-1">
        <input
          ref={emailRef}
          value={email}
          onChange={e => setEmail(e.target.value)}
          className={`border ${attempted && errors.email ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-800'} bg-gray-900 rounded px-4 py-3 w-full placeholder:text-gray-500`}
          type="email"
          name="email"
          placeholder="Email"
          aria-label="Email"
          aria-invalid={attempted && !!errors.email}
          disabled={alreadyRegistered || status === 'saving' || status === 'done'}
        />
      </div>
      <div className="md:col-span-1">
        <input
          ref={phoneRef}
          value={phone}
          onChange={e => setPhone(e.target.value)}
          className={`border ${attempted && errors.phone ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-800'} bg-gray-900 rounded px-4 py-3 w-full placeholder:text-gray-500`}
          type="tel"
          name="phone"
          placeholder="Telefono"
          aria-label="Telefono"
          aria-invalid={attempted && !!errors.phone}
          disabled={alreadyRegistered || status === 'saving' || status === 'done'}
        />
      </div>
  <button disabled={!canClick} aria-disabled={alreadyRegistered} className="relative md:col-span-1 rounded font-semibold text-white px-5 py-3 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cta-glow cta-animated overflow-hidden" aria-label={alreadyRegistered ? 'Già iscritto' : 'Iscriviti gratis ora'}>
        <span className="relative z-10">
          {alreadyRegistered ? 'Già iscritto ✓' : status === 'done' ? 'Registrato ✓' : status === 'saving' ? 'Invio...' : 'Iscriviti gratis'}
        </span>
        <span aria-hidden className="cta-particles">
          {Array.from({ length: 8 }).map((_, p) => (
            <span key={p} style={{ ['--tx' as any]: `${(Math.random() * 90 - 45).toFixed(0)}px`, ['--ty' as any]: `${(Math.random() * 40 - 20).toFixed(0)}px`, ['--dur' as any]: `${(4 + Math.random() * 3).toFixed(2)}s`, animationDelay: `${(Math.random() * 3).toFixed(2)}s` }} />
          ))}
        </span>
      </button>
      <div className="md:col-span-4 grid gap-2">
        <label className="flex items-start gap-2 text-xs text-gray-400">
          <input type="checkbox" className="mt-0.5 h-4 w-4 rounded bg-gray-900 border-gray-700" checked={cafFlag} onChange={e => setCafFlag(e.target.checked)} aria-label="Flag CAF" disabled={alreadyRegistered || status === 'saving' || status === 'done'} />
          <span>È il primo corso che seguo tramite il CAF (opzionale)</span>
        </label>
        <label className={`flex items-start gap-2 text-xs text-gray-400`}>
          <input type="checkbox" className={`mt-0.5 h-4 w-4 rounded bg-gray-900 border-gray-700`} checked={unemployed} onChange={e => setUnemployed(e.target.checked)} aria-label="Flag disoccupato" disabled={alreadyRegistered || status === 'saving' || status === 'done'} />
          <span>Dichiaro di essere attualmente disoccupato (opzionale)</span>
        </label>
        <label className={`flex items-start gap-2 text-xs ${attempted && !consent ? 'text-red-400' : 'text-gray-400'}`}>
          <input type="checkbox" className={`mt-0.5 h-4 w-4 rounded bg-gray-900 ${attempted && !consent ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-700'}`} checked={consent} onChange={e => setConsent(e.target.checked)} aria-label="Consenso trattamento dati" disabled={alreadyRegistered || status === 'saving' || status === 'done'} />
          <span>Acconsento al trattamento dei dati (email & telefono) Obbligatorio <button type="button" onClick={() => onOpenPrivacy?.()} className="text-brand-300 hover:underline focus:outline-none">Informativa</button> {attempted && !consent && <em className="not-italic text-red-400">(obbligatorio)</em>}</span>
        </label>
  {showLegend && (
          <div role="status" aria-live="polite" className="mt-1 rounded border border-red-500/50 bg-red-500/5 text-red-300 p-2 text-[11px]">
            <div className="font-semibold mb-1">Controlla questi campi:</div>
            <ul className="list-disc pl-5 space-y-0.5">
              {errors.name && <li>{errors.name}</li>}
              {errors.lastName && <li>{errors.lastName}</li>}
              {errors.email && <li>{errors.email}</li>}
              {errors.phone && <li>{errors.phone}</li>}
              {false && !unemployed && <li>Seleziona la dichiarazione di disoccupazione</li>}
              {!consent && <li>Accetta il trattamento dei dati</li>}
            </ul>
          </div>
        )}
        <p className="text-[10px] text-gray-500">Niente spam. Revoca in qualunque momento. {status === 'error' && (
          <span className="text-red-400 ml-2">{errorMsg ?? 'Errore di invio, riprova tra poco.'}</span>
        )}</p>
      </div>
    </form>
  )
}

export default SignupForm
