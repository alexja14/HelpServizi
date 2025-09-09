
/**
 * Contenuto riutilizzabile dell'informativa privacy (GDPR).
 * Usato sia nella pagina dedicata (#privacy) sia nel modale dalla landing.
 * Sostituire i placeholder con i dati reali prima della pubblicazione.
 */
export function PrivacyContent() {
    return (
        <div className="prose prose-invert max-w-none text-sm leading-relaxed">
            <p><strong>Titolare del trattamento:</strong> [Ragione Sociale] ("Titolare"). Contatti: <a href="mailto:info@example.com" className="text-brand-300 underline">info@example.com</a>.</p>
            <p><strong>Dati trattati:</strong> nome, cognome, email, telefono, flag prima edizione CAF, dichiarazione stato occupazionale (disoccupato), preferenze, metadati tecnici (log accessi, timestamp iscrizione). Nessun dato particolare (art. 9 GDPR) richiesto.</p>
            <p><strong>Finalità e basi giuridiche:</strong></p>
            <ul className="list-disc pl-5 space-y-1">
                <li>Gestione iscrizione e invio informazioni operative (art. 6(1)(b) GDPR).</li>
                <li>Comunicazioni di follow‑up e materiali correlati (consenso art. 6(1)(a)).</li>
                <li>Invio contenuti formativi aggiuntivi/aggiornamenti (marketing leggero) previo consenso.</li>
                <li>Statistiche interne e miglioramento (interesse legittimo art. 6(1)(f) con minimizzazione).</li>
            </ul>
            <p><strong>Natura del conferimento:</strong> Obbligatori: nome, cognome, email, consenso privacy. Facoltativi: telefono, flag prima edizione CAF. La dichiarazione di disoccupazione è richiesta per eventuali benefici/formati dedicati.</p>
            <p><strong>Modalità:</strong> trattamenti digitali su infrastrutture UE / fornitori conformi, con misure tecniche e organizzative adeguate (access control, backup, minimizzazione).</p>
            <p><strong>Conservazione:</strong> dati iscrizione max 24 mesi dall’ultimo contatto utile o revoca; log tecnici max 12 mesi; eventuali consensi marketing fino a revoca.</p>
            <p><strong>Comunicazione / trasferimento:</strong> nessuna diffusione. Possibile utilizzo di responsabili esterni nominati (art. 28). Nessun trasferimento extra UE salvo garanzie adeguate (es. Clausole Standard).</p>
            <p><strong>Diritti interessato:</strong> accesso, rettifica, cancellazione, limitazione, portabilità, opposizione, revoca consenso. Reclamo possibile al Garante Privacy.</p>
            <p><strong>Revoca consenso / esercizio diritti:</strong> scrivendo a <a href="mailto:info@example.com" className="text-brand-300 underline">info@example.com</a> o tramite link di disiscrizione presente nelle comunicazioni.</p>
            <p className="text-xs text-gray-500">Versione: v1 – Aggiornare con: ragione sociale completa, indirizzo, P.IVA, elenco sintetico fornitori (hosting, email, analytics) e procedure prima della pubblicazione.</p>
        </div>
    )
}

export default PrivacyContent
