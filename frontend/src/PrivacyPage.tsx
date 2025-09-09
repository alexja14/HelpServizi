import { motion } from 'framer-motion'
import { PrivacyContent } from './components/PrivacyContent'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <header className="border-b border-gray-800 bg-gray-950/85 backdrop-blur sticky top-0 z-50">
        <div className="container mx-auto max-w-6xl px-4 h-14 flex items-center justify-between">
          <a className="flex items-center gap-2" href="#" aria-label="Home">
            <img src="/logo.svg" alt="Logo" className="h-6 w-6" />
            <span className="ml-1 font-semibold">AI Prestazioni Lavorative</span>
          </a>
          <nav className="hidden md:flex gap-6 text-sm font-medium">
            <a href="#" className="hover:text-brand-600 transition-colors">Home</a>
          </nav>
        </div>
      </header>
      <main className="py-12">
        <div className="container mx-auto max-w-4xl px-4">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-bold mb-6">Informativa Privacy</motion.h1>
          <PrivacyContent />
        </div>
      </main>
      <footer className="border-t border-gray-800 py-8 text-sm">
        <div className="container mx-auto max-w-6xl px-4 flex flex-col sm:flex-row justify-between gap-4 text-gray-500">
          <div>© {new Date().getFullYear()} AI Prestazioni Lavorative</div>
          <div className="flex gap-4"><a href="#" className="hover:underline">Home</a></div>
        </div>
      </footer>
    </div>
  )
}