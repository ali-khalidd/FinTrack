import { useEffect, useState, type FormEvent } from 'react'
import { Loader2 } from 'lucide-react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../context/AuthContext'
import type { SavingsGoal } from '../types'
import { inputClass, labelClass } from '../lib/ui'
import Modal from './Modal'

interface GoalFormProps {
  open: boolean
  onClose: () => void
  onSaved: () => void
  goal?: SavingsGoal | null
}

export default function GoalForm({ open, onClose, onSaved, goal }: GoalFormProps) {
  const { user } = useAuth()
  const [name, setName] = useState('')
  const [target, setTarget] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!open) return
    if (goal) {
      setName(goal.name)
      setTarget(String(goal.target))
    } else {
      setName('')
      setTarget('')
    }
    setError(null)
  }, [goal, open])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!user) return
    setLoading(true)
    setError(null)

    const res = goal
      ? await supabase
          .from('savings_goals')
          .update({ name: name.trim(), target: Number(target) })
          .eq('id', goal.id)
      : await supabase
          .from('savings_goals')
          .insert({ user_id: user.id, name: name.trim(), target: Number(target), saved: 0 })

    setLoading(false)
    if (res.error) {
      setError(res.error.message)
      return
    }
    onSaved()
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title={goal ? 'Edit goal' : 'New savings goal'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className={labelClass}>Goal name</label>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputClass}
            placeholder="e.g. New Laptop"
          />
        </div>
        <div>
          <label className={labelClass}>Target amount</label>
          <input
            type="number"
            required
            min="0"
            step="0.01"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            className={inputClass}
            placeholder="1200"
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
            onClick={onClose}
            className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex flex-[2] items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:opacity-60"
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            {goal ? 'Save changes' : 'Create goal'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
