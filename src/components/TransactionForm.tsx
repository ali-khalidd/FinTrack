import { useEffect, useState, type FormEvent } from 'react'
import { Loader2 } from 'lucide-react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../context/AuthContext'
import {
  EXPENSE_CATEGORIES,
  INCOME_CATEGORIES,
  type Transaction,
  type TransactionType,
} from '../types'
import { inputClass, labelClass } from '../lib/ui'
import Modal from './Modal'

interface TransactionFormProps {
  open: boolean
  onClose: () => void
  onSaved: () => void
  transaction?: Transaction | null
}

export default function TransactionForm({
  open,
  onClose,
  onSaved,
  transaction,
}: TransactionFormProps) {
  const { user } = useAuth()
  const [type, setType] = useState<TransactionType>('expense')
  const [title, setTitle] = useState('')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState<string>(EXPENSE_CATEGORIES[0])
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!open) return
    if (transaction) {
      setType(transaction.type)
      setTitle(transaction.title)
      setAmount(String(transaction.amount))
      setCategory(transaction.category)
      setDate(transaction.date)
    } else {
      setType('expense')
      setTitle('')
      setAmount('')
      setCategory(EXPENSE_CATEGORIES[0])
      setDate(new Date().toISOString().slice(0, 10))
    }
    setError(null)
  }, [transaction, open])

  const handleTypeChange = (next: TransactionType) => {
    setType(next)
    setCategory(next === 'expense' ? EXPENSE_CATEGORIES[0] : INCOME_CATEGORIES[0])
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!user) return
    setLoading(true)
    setError(null)

    const payload = {
      user_id: user.id,
      title: title.trim(),
      amount: Number(amount),
      category,
      type,
      date,
    }

    const res = transaction
      ? await supabase.from('transactions').update(payload).eq('id', transaction.id)
      : await supabase.from('transactions').insert(payload)

    setLoading(false)
    if (res.error) {
      setError(res.error.message)
      return
    }
    onSaved()
    onClose()
  }

  const categories = type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES

  return (
    <Modal open={open} onClose={onClose} title={transaction ? 'Edit transaction' : 'Add transaction'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Type toggle */}
        <div className="grid grid-cols-2 gap-2 rounded-xl bg-slate-100 p-1 dark:bg-slate-700/50">
          {(['expense', 'income'] as TransactionType[]).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => handleTypeChange(t)}
              className={`rounded-lg py-2 text-sm font-medium capitalize transition ${
                type === t
                  ? t === 'expense'
                    ? 'bg-white text-rose-600 shadow-sm dark:bg-slate-800'
                    : 'bg-white text-accent-600 shadow-sm dark:bg-slate-800'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div>
          <label className={labelClass}>Title</label>
          <input
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={inputClass}
            placeholder="e.g. Grocery shopping"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Amount</label>
            <input
              type="number"
              required
              min="0"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className={inputClass}
              placeholder="0.00"
            />
          </div>
          <div>
            <label className={labelClass}>Date</label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label className={labelClass}>Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={inputClass}
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
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
            {transaction ? 'Save changes' : 'Add'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
