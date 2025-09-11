import { motion, useAnimationFrame, useMotionValue } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'

export function Marquee({ children, speed = 40 }: { children: ReactNode[]; speed?: number }) {
  const wrapRef = useRef<HTMLDivElement | null>(null)
  const trackRef = useRef<HTMLDivElement | null>(null)
  const [trackW, setTrackW] = useState(0)
  const [clones, setClones] = useState(2)
  const x = useMotionValue(0)

  useEffect(() => {
    const el = trackRef.current
    const wrap = wrapRef.current
    if (!el) return
    const update = () => {
      const base = el.scrollWidth
      const wrapW = wrap?.clientWidth ?? 0
      setTrackW(base)
      if (base > 0 && wrapW > 0) {
        const needed = Math.max(2, Math.ceil(wrapW / base) + 1)
        setClones(needed)
      }
    }
    const ro = new ResizeObserver(update)
    ro.observe(el)
    if (wrap) ro.observe(wrap)
    update()
    return () => ro.disconnect()
  }, [])

  useAnimationFrame((_, delta) => {
    if (trackW <= 0) return
    const dist = (speed * delta) / 1000
    let next = x.get() - dist
    if (next <= -trackW || next > 0) {
      next = -(((-next) % trackW))
    }
    x.set(next)
  })

  useEffect(() => {
    if (trackW <= 0) return
    const cur = x.get()
    if (cur < -trackW || cur > 0) {
      x.set(-(((-cur) % trackW)))
    }
  }, [trackW])

  return (
    <div ref={wrapRef} className="overflow-hidden">
      <motion.div className="flex gap-3 will-change-transform" style={{ x }}>
        <div ref={trackRef} className="flex gap-3">{children}</div>
        {Array.from({ length: Math.max(1, clones - 1) }).map((_, i) => (
          <div key={i} className="flex gap-3" aria-hidden>
            {children}
          </div>
        ))}
      </motion.div>
    </div>
  )
}

export default Marquee
