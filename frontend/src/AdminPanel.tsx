import { useEffect, useState } from 'react'

type Lead = {
  id: number; name: string; lastName: string; email: string; phone?: string | null; cafFlag: boolean; unemployed: boolean; consent: boolean; createdAt: string;
}

export default function AdminPanel() {
  const [username, setUsername] = useState('admin')
  const [password, setPassword] = useState('')
  const [authed, setAuthed] = useState(false)
  const [leads, setLeads] = useState<Lead[]>([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function fetchLeads() {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/admin/leads', {
        headers: { 'Authorization': 'Basic ' + btoa(username + ':' + password) }
      })
      if (res.status === 401) { setError('Autenticazione richiesta'); setAuthed(false); return }
      if (res.status === 403) { setError('Credenziali non valide'); setAuthed(false); return }
      const data = await res.json()
      setLeads(data)
      setAuthed(true)
    } catch (e: any) {
      setError('Errore di rete')
    } finally {
      setLoading(false)
    }
  }

  function exportCsv() {
    const url = '/api/admin/leads/export'
    fetch(url, { headers: { 'Authorization': 'Basic ' + btoa(username + ':' + password) } })
      .then(r => r.text())
      .then(csv => {
        const blob = new Blob([csv], { type: 'text/csv' })
        const a = document.createElement('a')
        a.href = URL.createObjectURL(blob)
        a.download = 'leads.csv'
        a.click()
      })
  }

  useEffect(() => {
    // auto try if password provided manually
    if (authed) fetchLeads()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Admin Leads</h1>
        {!authed && (
          <form onSubmit={e=>{e.preventDefault(); fetchLeads();}} className="space-y-4 max-w-sm">
            <div>
              <label className="block text-sm mb-1">Username</label>
              <input value={username} onChange={e=>setUsername(e.target.value)} className="w-full rounded bg-gray-900 border border-gray-700 px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm mb-1">Password</label>
              <input type="password" value={password} onChange={e=>setPassword(e.target.value)} className="w-full rounded bg-gray-900 border border-gray-700 px-3 py-2" />
            </div>
            {error && <div className="text-sm text-red-400">{error}</div>}
            <button disabled={loading} className="px-4 py-2 rounded bg-brand-600 disabled:opacity-50">{loading ? '...' : 'Entra'}</button>
          </form>
        )}
        {authed && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-400">{leads.length} lead</div>
              <div className="flex gap-2">
                <button onClick={fetchLeads} className="px-3 py-1.5 text-sm rounded bg-gray-800 border border-gray-700">Aggiorna</button>
                <button onClick={exportCsv} className="px-3 py-1.5 text-sm rounded bg-brand-600">Export CSV</button>
              </div>
            </div>
            <div className="overflow-auto border border-gray-800 rounded">
              <table className="min-w-full text-xs">
                <thead className="bg-gray-900">
                  <tr className="text-left">
                    {['ID','Nome','Cognome','Email','Tel','CAF','Disocc','Consenso','Created'].map(h=> <th key={h} className="px-2 py-2 font-semibold whitespace-nowrap">{h}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {leads.map(l => (
                    <tr key={l.id} className="odd:bg-gray-900/40">
                      <td className="px-2 py-1">{l.id}</td>
                      <td className="px-2 py-1">{l.name}</td>
                      <td className="px-2 py-1">{l.lastName}</td>
                      <td className="px-2 py-1">{l.email}</td>
                      <td className="px-2 py-1">{l.phone}</td>
                      <td className="px-2 py-1">{l.cafFlag ? '✓' : ''}</td>
                      <td className="px-2 py-1">{l.unemployed ? '✓' : ''}</td>
                      <td className="px-2 py-1">{l.consent ? '✓' : ''}</td>
                      <td className="px-2 py-1 whitespace-nowrap">{new Date(l.createdAt).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
