import { Pencil, Trash2, ArrowDownLeft, ArrowUpRight } from 'lucide-react'
import { formatCurrency, formatDate } from '../lib/format'
import type { Transaction } from '../types'

interface TransactionListProps {
  transactions: Transaction[]
  currency: string
  onEdit: (tx: Transaction) => void
  onDelete: (id: string) => void
  emptyMessage?: string
}

export default function TransactionList({
  transactions,
  currency,
  onEdit,
  onDelete,
  emptyMessage = 'No transactions yet.',
}: TransactionListProps) {
  if (transactions.length === 0) {
    return <p className="py-10 text-center text-sm text-slate-400">{emptyMessage}</p>
  }

  return (
    <div className="divide-y divide-slate-100 dark:divide-slate-700/50">
      {transactions.map((tx) => (
        <div key={tx.id} className="flex items-center gap-3 py-3">
          <span
            className={`rounded-xl p-2 ${
              tx.type === 'income'
                ? 'bg-accent-50 text-accent-600 dark:bg-accent-500/10'
                : 'bg-rose-50 text-rose-600 dark:bg-rose-500/10'
            }`}
          >
            {tx.type === 'income' ? <ArrowDownLeft size={18} /> : <ArrowUpRight size={18} />}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-slate-800 dark:text-slate-100">
              {tx.title}
            </p>
            <p className="text-xs text-slate-400">
              {tx.category} · {formatDate(tx.date)}
            </p>
          </div>
          <p
            className={`text-sm font-semibold ${
              tx.type === 'income'
                ? 'text-accent-600'
                : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            {tx.type === 'income' ? '+' : '−'}
            {formatCurrency(tx.amount, currency)}
          </p>
          <div className="flex gap-1">
            <button
              onClick={() => onEdit(tx)}
              className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-brand-600 dark:hover:bg-slate-700"
              aria-label="Edit"
            >
              <Pencil size={16} />
            </button>
            <button
              onClick={() => onDelete(tx.id)}
              className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-rose-600 dark:hover:bg-slate-700"
              aria-label="Delete"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
