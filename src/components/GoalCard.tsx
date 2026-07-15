import { Pencil, Trash2, Plus } from 'lucide-react'
import { formatCurrency } from '../lib/format'
import type { SavingsGoal } from '../types'

interface GoalCardProps {
  goal: SavingsGoal
  currency: string
  onEdit: () => void
  onDelete: () => void
  onAddFunds: () => void
}

export default function GoalCard({ goal, currency, onEdit, onDelete, onAddFunds }: GoalCardProps) {
  const percent = goal.target > 0 ? Math.min(100, (goal.saved / goal.target) * 100) : 0
  const done = percent >= 100

  return (
    <div className="rounded-2xl bg-white p-5 shadow-card transition hover:shadow-soft dark:bg-slate-800">
      <div className="flex items-start justify-between">
        <div className="min-w-0">
          <h3 className="truncate font-semibold text-slate-800 dark:text-slate-100">
            {goal.name}
          </h3>
          <p className="mt-0.5 text-sm text-slate-400">
            {formatCurrency(goal.saved, currency)} of {formatCurrency(goal.target, currency)}
          </p>
        </div>
        <div className="flex shrink-0 gap-1">
          <button
            onClick={onEdit}
            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-brand-600 dark:hover:bg-slate-700"
            aria-label="Edit goal"
          >
            <Pencil size={16} />
          </button>
          <button
            onClick={onDelete}
            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-rose-600 dark:hover:bg-slate-700"
            aria-label="Delete goal"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <div className="mt-4">
        <div className="mb-1 flex justify-between text-xs text-slate-400">
          <span>{percent.toFixed(0)}%</span>
          {done && <span className="font-medium text-accent-600">Goal reached!</span>}
        </div>
        <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
          <div
            className={`h-full rounded-full transition-all ${
              done ? 'bg-accent-500' : 'bg-brand-500'
            }`}
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>

      <button
        onClick={onAddFunds}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-brand-200 px-4 py-2 text-sm font-medium text-brand-600 transition hover:bg-brand-50 dark:border-brand-500/30 dark:hover:bg-brand-500/10"
      >
        <Plus size={16} /> Add funds
      </button>
    </div>
  )
}
