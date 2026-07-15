import { useEffect, useState } from 'react'
import { Plus, Loader2 } from 'lucide-react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../context/AuthContext'
import type { Transaction, TransactionType } from '../types'
import TransactionList from '../components/TransactionList'
import TransactionForm from '../components/TransactionForm'

type Filter = 'all' | TransactionType

const filterTabs: { key: Filter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'income', label: 'Income' },
  { key: 'expense', label: 'Expenses' },
]

export default function Transactions() {
  const { user, profile } = useAuth()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Transaction | null>(null)
  const [filter, setFilter] = useState<Filter>('all')
  const currency = profile?.currency ?? 'PKR'

  async function load() {
    if (!user) return
    setLoading(true)
    const { data } = await supabase
      .from('transactions')
      .select('*')
      .order('date', { ascending: false })
    setTransactions((data as Transaction[]) ?? [])
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

  const handleEdit = (tx: Transaction) => {
    setEditing(tx)
    setFormOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this transaction?')) return
    await supabase.from('transactions').delete().eq('id', id)
    load()
  }

  const filtered =
    filter === 'all' ? transactions : transactions.filter((t) => t.type === filter)

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Transactions</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {transactions.length} total
          </p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700"
        >
          <Plus size={18} /> Add transaction
        </button>
      </div>

      {/* Filter tabs */}
      <div className="inline-flex rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
        {filterTabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`rounded-lg px-4 py-1.5 text-sm font-medium transition ${
              filter === tab.key
                ? 'bg-white text-brand-600 shadow-sm dark:bg-slate-700 dark:text-brand-400'
                : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="rounded-2xl bg-white p-4 shadow-card dark:bg-slate-800">
        {loading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="animate-spin text-brand-500" size={28} />
          </div>
        ) : (
          <TransactionList
            transactions={filtered}
            currency={currency}
            onEdit={handleEdit}
            onDelete={handleDelete}
            emptyMessage={
              filter === 'all'
                ? 'No transactions yet. Add your first one!'
                : `No ${filter} transactions.`
            }
          />
        )}
      </div>

      <TransactionForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSaved={load}
        transaction={editing}
      />
    </div>
  )
}
