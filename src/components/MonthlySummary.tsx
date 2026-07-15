import { formatCurrency } from '../lib/format'

interface MonthlySummaryProps {
  savings: number
  goal: number
  currency: string
  monthLabel: string
}

export default function MonthlySummary({
  savings,
  goal,
  currency,
  monthLabel,
}: MonthlySummaryProps) {
  const diff = savings - goal
  const reached = diff >= 0
  const progress = goal > 0 ? Math.min(100, (savings / goal) * 100) : 0

  return (
    <div className="rounded-2xl bg-white p-5 shadow-card dark:bg-slate-800">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-slate-800 dark:text-slate-100">Monthly Summary</h3>
        <span className="text-xs text-slate-400">{monthLabel}</span>
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-500 dark:text-slate-400">
            Goal: {formatCurrency(goal, currency)}
          </span>
          <span className="font-semibold text-slate-800 dark:text-slate-100">
            {formatCurrency(savings, currency)} saved
          </span>
        </div>
        <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
          <div
            className={`h-full rounded-full transition-all ${
              reached ? 'bg-accent-500' : 'bg-brand-500'
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {goal > 0 ? (
        <p
          className={`mt-4 rounded-xl px-4 py-3 text-sm ${
            reached
              ? 'bg-accent-50 text-accent-700 dark:bg-accent-500/10 dark:text-accent-400'
              : 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400'
          }`}
        >
          {reached ? (
            <>
              🎉 Great job! You saved <b>{formatCurrency(diff, currency)}</b> more than your goal.
            </>
          ) : (
            <>
              You saved <b>{formatCurrency(Math.abs(diff), currency)}</b> less than your goal this
              month.
            </>
          )}
        </p>
      ) : (
        <p className="mt-4 rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-500 dark:bg-slate-700/50">
          Set a monthly savings goal in Settings to track your progress.
        </p>
      )}
    </div>
  )
}
