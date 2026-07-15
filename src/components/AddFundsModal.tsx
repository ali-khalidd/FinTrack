import { useState, type FormEvent } from 'react'
import { Loader2 } from 'lucide-react'
import { supabase } from '../lib/supabaseClient'
import { formatCurrency } from '../lib/format'
import { inputClass, labelClass } from '../lib/ui'
import type { SavingsGoal } from '../types'
import Modal from './Modal'

interface AddFundsModalProps {
  goal: SavingsGoal | null
  currency: string
  onClose: () => void
  onSaved: () => void
}

export default function AddFundsModal({ goal, currency, onClose, onSaved }: AddFundsModalProps) {
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleClose = () => {
    setAmount('')
    setError(null)
    onClose()
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!goal) return
    setLoading(true)
    setError(null)

    const newSaved = Number(goal.saved) + Number(amount)
    const { error } = await supabase
      .from('savings_goals')
      .update({ saved: newSaved })
      .eq('id', goal.id)

    setLoading(false)
    if (error) {
      setError(error.message)
      return
    }
    onSaved()
    setAmount('')
    onClose()
  }

  return (
    <Modal open={!!goal} onClose={handleClose} title={`Add funds to ${goal?.name ?? ''}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Current: <span className="font-medium">{formatCurrency(goal?.saved ?? 0, currency)}</span> ·
          Target: <span className="font-medium">{formatCurrency(goal?.target ?? 0, currency)}</span>
        </p>
        <div>
          <label className={labelClass}>Amount to add</label>
          <input
            type="number"
            required
            min="0.01"
            step="0.01"
            autoFocus
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className={inputClass}
            placeholder="0.00"
          />
        </div>

        {error && (
          <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-600 dark:bg-rose-500/10">
            {error}
          </p>
        )}

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={handleClose}
            className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex flex-[2] items-center justify-center gap-2 rounded-xl bg-accent-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-accent-700 disabled:opacity-60"
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            Add funds
          </button>
        </div>
      </form>
    </Modal>
  )
}
