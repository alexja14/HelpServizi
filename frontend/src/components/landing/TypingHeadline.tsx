import { useEffect, useMemo, useState } from 'react'

export function TypingHeadline({ phrases, className }: { phrases: string[]; className?: string }) {
  const [index, setIndex] = useState(0)
  const [subIndex, setSubIndex] = useState(0)
  const [deleting, setDeleting] = useState(false)
  const [blinkCaret, setBlinkCaret] = useState(true)
  const longest = useMemo(() => phrases.reduce((a, b) => (b.length > a.length ? b : a), ''), [phrases])

  useEffect(() => {
    const current = phrases[index]
    if (!deleting && subIndex === current.length) {
      const pause = setTimeout(() => setDeleting(true), 1400)
      return () => clearTimeout(pause)
    }
    if (deleting && subIndex === 0) {
      setDeleting(false)
      setIndex((i) => (i + 1) % phrases.length)
      return
    }
    const timeout = setTimeout(() => {
      setSubIndex((s) => s + (deleting ? -1 : 1))
    }, deleting ? 30 : 55)
    return () => clearTimeout(timeout)
  }, [subIndex, deleting, index, phrases])

  useEffect(() => {
    const blink = setInterval(() => setBlinkCaret((b) => !b), 500)
    return () => clearInterval(blink)
  }, [])

  const text = phrases[index].slice(0, subIndex)
  return (
    <span
      className={(className || '') + ' typing-inline inline-grid relative'}
      style={{ whiteSpace: 'nowrap' }}
    >
      <span className="invisible col-start-1 row-start-1 pointer-events-none select-none">{longest}</span>
      <span className="col-start-1 row-start-1">
        {text}
        <span
          aria-hidden
          className="inline-block align-middle ml-0.5"
          style={{
            width: '2px',
            height: '1em',
            background: 'currentColor',
            opacity: blinkCaret ? 1 : 0,
            transition: 'opacity 0.15s linear'
          }}
        />
      </span>
    </span>
  )
}

export default TypingHeadline
