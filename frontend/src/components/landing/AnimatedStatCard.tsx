import { useEffect, useRef, useState } from 'react'
import { useInView } from 'framer-motion'
import { Card } from '../ui/card'

export type Stat = { label: string; type: 'num' | 'text'; value?: number; format?: (n: number) => string; text?: string }

function useCountUp(target: number, durationSec: number, start: boolean) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    if (!start) return
    let raf = 0
    const startTs = performance.now()
    const step = (now: number) => {
      const p = Math.min((now - startTs) / (durationSec * 1000), 1)
      const eased = 1 - Math.pow(1 - p, 3)
      setValue(target * eased)
      if (p < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [target, durationSec, start])
  return value
}

export function AnimatedStatCard({ stat }: { stat: Stat }) {
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

export default AnimatedStatCard
