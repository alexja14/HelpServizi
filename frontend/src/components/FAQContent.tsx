type FAQ = { q: string; a: string }

const DEFAULT_FAQ: FAQ[] = [
  { q: 'Serve esperienza tecnica?', a: 'No, partiamo da zero: strumenti guidati e pratica su casi reali.' },
  { q: 'Quanto costa il corso?', a: 'Il percorso AI GOL è gratuito per gli aventi diritto alle misure previste.' },
  { q: 'Quanto tempo richiede?', a: '20 ore totali in 5 moduli. Lezioni brevi + on‑demand, anche da smartphone.' },
  { q: 'Che supporto ricevo?', a: 'Mentor dedicati, Q&A e materiali sempre disponibili.' },
  { q: 'Come faccio a iscrivermi?', a: 'Compila il form nella sezione “Iscriviti”. Ti contatteremo per i prossimi slot.' },
  { q: 'Entro quando posso iscrivermi?', a: 'Fino all’avvio delle sessioni di Autunno, posti limitati.' },
]

export function FAQContent({ items = DEFAULT_FAQ, columns = 1 }: { items?: FAQ[]; columns?: 1 | 2 }) {
  if (columns === 2) {
    return (
      <div className="grid md:grid-cols-2 gap-6">
        {items.map((f) => (
          <div key={f.q} className="rounded-md border border-gray-800 bg-gray-900/70 p-4">
            <div className="font-semibold">{f.q}</div>
            <p className="text-sm text-gray-300 mt-1">{f.a}</p>
          </div>
        ))}
      </div>
    )
  }
  return (
    <div className="space-y-3">
      {items.map((f) => (
        <div key={f.q} className="rounded-md border border-gray-800 bg-gray-900/70 p-4">
          <div className="font-semibold">{f.q}</div>
          <p className="text-sm text-gray-300 mt-1">{f.a}</p>
        </div>
      ))}
    </div>
  )
}

export default FAQContent
