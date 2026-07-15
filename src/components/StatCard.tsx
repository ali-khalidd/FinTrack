import { type LucideIcon } from 'lucide-react'

interface StatCardProps {
  label: string
  value: string
  icon: LucideIcon
  tone?: 'brand' | 'accent' | 'rose' | 'amber'
}

const toneClasses: Record<NonNullable<StatCardProps['tone']>, string> = {
  brand: 'bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400',
  accent: 'bg-accent-50 text-accent-600 dark:bg-accent-500/10 dark:text-accent-400',
  rose: 'bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400',
  amber: 'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400',
}

export default function StatCard({ label, value, icon: Icon, tone = 'brand' }: StatCardProps) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-card transition hover:shadow-soft dark:bg-slate-800">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
          {label}
        </span>
        <span className={`rounded-xl p-2 ${toneClasses[tone]}`}>
          <Icon size={18} />
        </span>
      </div>
      <p className="mt-3 text-2xl font-bold text-slate-800 dark:text-slate-100">{value}</p>
    </div>
  )
}
