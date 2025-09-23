
/**
 * Contenuto riutilizzabile dell'informativa privacy (GDPR).
 * Usato sia nella pagina dedicata (#privacy) sia nel modale dalla landing.
 * Sostituire i placeholder con i dati reali prima della pubblicazione.
 */
export function PrivacyContent() {
    return (
        <div
            className="max-w-none text-sm leading-relaxed text-gray-200 [&_strong]:text-gray-100 [&_a]:text-brand-300 [&_a]:underline [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1 [&_p+ul]:mt-1 [&_h1]:text-xl [&_h1]:font-semibold [&_h2]:text-lg [&_h2]:font-semibold"
        >
            <p><strong>Titolare del trattamento:</strong> ANT SRL ("Titolare") – Società della Rete RAD. P.IVA 03860890965. Sede: Corso Buenos Aires, 47 (MI). Contatti privacy / PEC: <a href="mailto:privacy@antsrl.pec.it">privacy@antsrl.pec.it</a> – Tel: +39 02 29013496.</p>
            <p><strong>Dati trattati:</strong> nome, cognome, email, telefono, flag prima edizione CAF, dichiarazione stato occupazionale (disoccupato), preferenze, metadati tecnici (log accessi, timestamp iscrizione). Nessun dato particolare (art. 9 GDPR) richiesto.</p>
            <p><strong>Finalità e basi giuridiche:</strong></p>
            <ul>
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
            <p><strong>Revoca consenso / esercizio diritti:</strong> scrivendo a <a href="mailto:privacy@antsrl.pec.it">privacy@antsrl.pec.it</a> (indirizzo dedicato privacy / PEC) o tramite link di disiscrizione presente nelle comunicazioni.</p>
            <p className="text-xs text-gray-500">Informativa aggiornata al {new Date().toLocaleDateString('it-IT')}.</p>
        </div>
    )
}

export default PrivacyContent
