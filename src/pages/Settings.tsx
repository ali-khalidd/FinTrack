import { useEffect, useState, type FormEvent } from 'react'
import { Loader2, Check, Save } from 'lucide-react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../context/AuthContext'
import { inputClass, labelClass } from '../lib/ui'

const CURRENCIES = [
  'PKR', 'USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'INR', 'NGN', 'ZAR',
  'BRL', 'MXN', 'AED', 'KES', 'GHS', 'CNY', 'SGD',
]

export default function Settings() {
  const { user, profile, refreshProfile } = useAuth()
  const [goal, setGoal] = useState('0')
  const [currency, setCurrency] = useState('PKR')
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setGoal(String(profile?.monthly_savings_goal ?? 0))
    setCurrency(profile?.currency ?? 'PKR')
  }, [profile])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!user) return
    setLoading(true)
    setError(null)
    setSaved(false)

    const { error } = await supabase
      .from('profiles')
      .update({ monthly_savings_goal: Number(goal), currency })
      .eq('id', user.id)

    setLoading(false)
    if (error) {
      setError(error.message)
      return
    }
    setSaved(true)
    refreshProfile()
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div className="max-w-xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Settings</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Manage your savings goal and currency
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-5 rounded-2xl bg-white p-6 shadow-card dark:bg-slate-800"
      >
        <div>
          <label className={labelClass}>Monthly savings goal</label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            className={inputClass}
            placeholder="200"
          />
          <p className="mt-1.5 text-xs text-slate-400">
            Used on the dashboard to compare against your monthly savings.
          </p>
        </div>

        <div>
          <label className={labelClass}>Currency</label>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className={inputClass}
          >
            {CURRENCIES.map((c) => (
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

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:opacity-60"
          >
            {loading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Save size={16} />
            )}
            Save changes
          </button>
          {saved && (
            <span className="flex items-center gap-1 text-sm font-medium text-accent-600">
              <Check size={16} /> Saved
            </span>
          )}
        </div>
      </form>
    </div>
  )
}
