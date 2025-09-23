import React from 'react';

// Simple inline SVG icons (no external deps)
const FacebookIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor" {...props}>
        <path d="M22 12.07C22 6.49 17.52 2 11.93 2 6.35 2 1.86 6.49 1.86 12.07c0 4.99 3.64 9.13 8.4 9.93v-7.03H7.9v-2.9h2.36V9.41c0-2.33 1.39-3.62 3.52-3.62 1.02 0 2.09.18 2.09.18v2.3h-1.18c-1.17 0-1.54.73-1.54 1.48v1.78h2.63l-.42 2.9h-2.21V22c4.76-.8 8.4-4.94 8.4-9.93Z" />
    </svg>
);

const LinkedInIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor" {...props}>
        <path d="M4.98 3.5a2.5 2.5 0 1 0 0 5.001 2.5 2.5 0 0 0 0-5Zm.02 6H3v11h2V9.5Zm4 0H7v11h2v-5.4c0-1.5.28-2.96 2.15-2.96 1.84 0 1.85 1.72 1.85 3.06V20.5h2v-6.18c0-3.04-.65-5.32-4.03-5.32-1.63 0-2.45.9-2.87 1.57h-.02V9.5Z" />
    </svg>
);

export const Footer: React.FC = () => {
    return (
        <footer className="border-t border-gray-800 bg-gray-950 text-[11px] md:text-xs text-gray-400">
            <div className="container mx-auto max-w-7xl px-4 py-8 flex flex-col gap-8">
                <div className="grid gap-6 sm:gap-8 md:grid-cols-4">
                    <div className="space-y-2">
                        <h2 className="font-semibold text-gray-100 tracking-tight text-sm md:text-[13px]">ANT SRL</h2>
                        <p className="leading-snug">
                            P.IVA: 03860890965<br />
                            Società della Rete <a href="https://www.reteartigianatodigitale.it/" target="_blank" rel="noopener noreferrer" className="text-brand-500 hover:underline">RAD</a>
                        </p>
                    </div>
                    <div className="space-y-2">
                        <h3 className="font-medium text-gray-300 text-xs md:text-[12px] uppercase tracking-wide">Sede di Milano</h3>
                        <p className="leading-snug">Corso Buenos Aires, 47 (MI)</p>
                    </div>
                    <div className="space-y-2">
                        <h3 className="font-medium text-gray-300 text-xs md:text-[12px] uppercase tracking-wide">Contatti</h3>
                        <p className="leading-snug">
                            <span className="block"><a href="mailto:info@antsrl.com" className="hover:text-gray-200">info@antsrl.com</a> (info)</span>
                            <span className="block"><a href="mailto:privacy@antsrl.pec.it" className="hover:text-gray-200">privacy@antsrl.pec.it</a> (privacy)</span>
                            Tel: <a href="tel:+390229013496" className="hover:text-gray-200">+39 02 29013496</a>
                        </p>
                    </div>
                    <div className="space-y-3">
                        <h3 className="font-medium text-gray-300 text-xs md:text-[12px] uppercase tracking-wide">Seguici</h3>
                        <div className="flex gap-4 text-gray-400">
                            <a
                                href="https://www.facebook.com/formatieoccupati"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Facebook"
                                className="hover:text-white transition-colors"
                            >
                                <FacebookIcon className="w-5 h-5" />
                            </a>
                            <a
                                href="https://it.linkedin.com/company/ant-formazione"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="LinkedIn"
                                className="hover:text-white transition-colors"
                            >
                                <LinkedInIcon className="w-5 h-5" />
                            </a>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 pt-4 border-t border-gray-800/60">
                    <div className="text-gray-500">&copy; {new Date().getFullYear()} ANT SRL. Tutti i diritti riservati.</div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
