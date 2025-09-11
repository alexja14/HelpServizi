import { CheckCircleIcon } from '@heroicons/react/24/solid'
import { Card } from './ui/card'

type ExpectedResultsProps = {
  title?: string
  items?: string[]
  className?: string
}

export function ExpectedResults({
  title = 'Risultati attesi',
  items = [
    'CV ottimizzato',
    '2 progetti AI‑assisted',
    'Piano d’azione 30 giorni',
  ],
  className,
}: ExpectedResultsProps) {
  return (
    <Card className={`p-6 bg-gray-900 border-gray-800 ${className || ''}`}>
      <h3 className="font-semibold mb-3">{title}</h3>
      <ul className="space-y-2 text-sm text-gray-300">
        {items.map((t) => (
          <li key={t} className="flex items-start gap-2">
            <CheckCircleIcon className="h-5 w-5 text-green-500 mt-0.5" />
            <span>{t}</span>
          </li>
        ))}
      </ul>
    </Card>
  )
}
