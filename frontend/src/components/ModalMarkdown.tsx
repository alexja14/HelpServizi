import React, { useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from './ui/card';

interface ModalMarkdownProps {
    open: boolean;
    title: string;
    content: string | null;
    loading: boolean;
    onClose: () => void;
}

export const ModalMarkdown: React.FC<ModalMarkdownProps> = ({ open, title, content, loading, onClose }) => {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (open && ref.current) {
            ref.current.focus();
        }
    }, [open]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
    };

    return (
        <AnimatePresence>
            {open && (
                <div
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="modal-md-title"
                    tabIndex={-1}
                    className="fixed inset-0 z-[100] flex items-center justify-center p-4"
                    onKeyDown={handleKeyDown}
                >
                    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} aria-hidden />
                    <motion.div
                        initial={{ opacity: 0, y: 30, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="relative w-full max-w-4xl mx-auto h-[90vh] flex"
                        onClick={(e: React.MouseEvent) => e.stopPropagation()}
                        onMouseDown={(e: React.MouseEvent) => e.stopPropagation()}
                        onKeyDown={(e: React.KeyboardEvent) => e.stopPropagation()}
                    >
                        <Card className="flex flex-col w-full h-full bg-gray-950 border-gray-800 shadow-xl">
                            <div className="flex items-start justify-between gap-3 p-4 sm:p-5 border-b border-gray-800 bg-gray-950/80">
                                <h2 id="modal-md-title" className="text-base sm:text-lg font-bold tracking-tight">{title}</h2>
                                <button onClick={onClose} aria-label="Chiudi modale" className="rounded px-2 py-1 text-gray-400 hover:text-white hover:bg-gray-800">✕</button>
                            </div>
                            <div ref={ref} tabIndex={-1} className="flex-1 overflow-y-auto p-4 sm:p-5 prose prose-invert max-w-none text-gray-100 text-base">
                                {loading ? (
                                    <div className="text-center text-gray-400">Caricamento…</div>
                                ) : (
                                    content ? <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown> : <div className="text-center text-gray-400">Nessun contenuto</div>
                                )}
                            </div>
                        </Card>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
