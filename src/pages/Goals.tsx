import { useEffect, useState } from 'react'
import { Plus, Loader2, Target } from 'lucide-react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../context/AuthContext'
import type { SavingsGoal } from '../types'
import GoalCard from '../components/GoalCard'
import GoalForm from '../components/GoalForm'
import AddFundsModal from '../components/AddFundsModal'

export default function Goals() {
  const { user, profile } = useAuth()
  const [goals, setGoals] = useState<SavingsGoal[]>([])
  const [loading, setLoading] = useState(true)
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<SavingsGoal | null>(null)
  const [funding, setFunding] = useState<SavingsGoal | null>(null)
  const currency = profile?.currency ?? 'PKR'

  async function load() {
    if (!user) return
    setLoading(true)
    const { data } = await supabase
      .from('savings_goals')
      .select('*')
      .order('created_at', { ascending: false })
    setGoals((data as SavingsGoal[]) ?? [])
    setLoading(false)
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  const handleAdd = () => {
    setEditing(null)
    setFormOpen(true)
  }

  const handleEdit = (goal: SavingsGoal) => {
    setEditing(goal)
    setFormOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this savings goal?')) return
    await supabase.from('savings_goals').delete().eq('id', id)
    load()
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Savings Goals</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Save towards the things you want
          </p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700"
        >
          <Plus size={18} /> New goal
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="animate-spin text-brand-500" size={28} />
        </div>
      ) : goals.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl bg-white py-16 text-center shadow-card dark:bg-slate-800">
          <div className="mb-3 rounded-2xl bg-brand-50 p-4 text-brand-500 dark:bg-brand-500/10">
            <Target size={32} />
          </div>
          <p className="font-medium text-slate-700 dark:text-slate-200">No goals yet</p>
          <p className="mt-1 text-sm text-slate-400">Create a goal to start saving towards it.</p>
          <button
            onClick={handleAdd}
            className="mt-4 flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700"
          >
            <Plus size={16} /> New goal
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {goals.map((goal) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              currency={currency}
              onEdit={() => handleEdit(goal)}
              onDelete={() => handleDelete(goal.id)}
              onAddFunds={() => setFunding(goal)}
            />
          ))}
        </div>
      )}

      <GoalForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSaved={load}
        goal={editing}
      />

      <AddFundsModal goal={funding} currency={currency} onClose={() => setFunding(null)} onSaved={load} />
    </div>
  )
}
