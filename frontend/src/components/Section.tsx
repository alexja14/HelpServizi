import { motion } from 'framer-motion'
import type { PropsWithChildren } from 'react'

export default function Section({ id, title, children }: PropsWithChildren<{ id?: string; title: string }>) {
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
