import { useEffect, useMemo, useState } from 'react'
import { Download, Loader2, BookOpen } from 'lucide-react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../context/AuthContext'
import { formatCurrency, formatDate } from '../lib/format'
import { EXPENSE_CATEGORIES, type Transaction } from '../types'

const monthOptions = (txs: Transaction[]): { value: string; label: string }[] => {
  const set = new Set<string>()
  txs.forEach((t) => set.add(t.date.slice(0, 7)))
  const months = Array.from(set).sort().reverse()
  return [
    { value: 'all', label: 'All months' },
    ...months.map((m) => ({
      value: m,
      label: new Date(`${m}-01`).toLocaleDateString(undefined, { month: 'long', year: 'numeric' }),
    })),
  ]
}

export default function Ledger() {
  const { user, profile } = useAuth()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [monthFilter, setMonthFilter] = useState<string>('all')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const currency = profile?.currency ?? 'PKR'

  async function load() {
    if (!user) return
    setLoading(true)
    const { data } = await supabase.from('transactions').select('*').order('date', { ascending: true })
    setTransactions((data as Transaction[]) ?? [])
    setLoading(false)
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  const filtered = useMemo(() => {
    return transactions
      .filter((t) => {
        if (categoryFilter === 'all') return true
        if (categoryFilter === 'expense') return t.type === 'expense'
        if (categoryFilter === 'income') return t.type === 'income'
        return t.category === categoryFilter
      })
      .filter((t) => monthFilter === 'all' || t.date.slice(0, 7) === monthFilter)
  }, [transactions, monthFilter, categoryFilter])

  const { rows, totalDebit, totalCredit } = useMemo(() => {
    let balance = 0
    let debit = 0
    let credit = 0
    const rows = filtered.map((tx) => {
      if (tx.type === 'income') {
        balance += tx.amount
        credit += tx.amount
      } else {
        balance -= tx.amount
        debit += tx.amount
      }
      return { tx, balance }
    })
    return { rows, totalDebit: debit, totalCredit: credit }
  }, [filtered])

  const net = totalCredit - totalDebit

  const exportCsv = () => {
    const header = ['Date', 'Title', 'Category', 'Type', 'Debit', 'Credit', 'Running Balance']
    const lines = rows.map(({ tx, balance }) =>
      [
        tx.date,
        `"${tx.title.replace(/"/g, '""')}"`,
        tx.category,
        tx.type,
        tx.type === 'expense' ? tx.amount.toFixed(2) : '',
        tx.type === 'income' ? tx.amount.toFixed(2) : '',
        balance.toFixed(2),
      ].join(','),
    )
    const csv = [header.join(','), ...lines].join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `ledger-${monthFilter === 'all' ? 'all' : monthFilter}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  const months = monthOptions(transactions)
  const categoryOptions = ['all', 'expense', 'income', ...EXPENSE_CATEGORIES]

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Expense Ledger</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Chronological record with running balance
          </p>
        </div>
        <button
          onClick={exportCsv}
          disabled={rows.length === 0}
          className="flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:opacity-50"
        >
          <Download size={18} /> Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <select
          value={monthFilter}
          onChange={(e) => setMonthFilter(e.target.value)}
          className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 outline-none transition focus:border-brand-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
        >
          {months.map((m) => (
            <option key={m.value} value={m.value}>
              {m.label}
            </option>
          ))}
        </select>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 outline-none transition focus:border-brand-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
        >
          {categoryOptions.map((c) => (
            <option key={c} value={c}>
              {c === 'all' ? 'All categories' : c === 'expense' ? 'All expenses' : c === 'income' ? 'All income' : c}
            </option>
          ))}
        </select>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl bg-white p-4 shadow-card dark:bg-slate-800">
          <p className="text-sm text-slate-500 dark:text-slate-400">Total Debits</p>
          <p className="mt-1 text-xl font-bold text-rose-600">{formatCurrency(totalDebit, currency)}</p>
        </div>
        <div className="rounded-2xl bg-white p-4 shadow-card dark:bg-slate-800">
          <p className="text-sm text-slate-500 dark:text-slate-400">Total Credits</p>
          <p className="mt-1 text-xl font-bold text-accent-600">{formatCurrency(totalCredit, currency)}</p>
        </div>
        <div className="rounded-2xl bg-white p-4 shadow-card dark:bg-slate-800">
          <p className="text-sm text-slate-500 dark:text-slate-400">Net</p>
          <p
            className={`mt-1 text-xl font-bold ${
              net >= 0 ? 'text-accent-600' : 'text-rose-600'
            }`}
          >
            {net >= 0 ? '+' : '−'}
            {formatCurrency(Math.abs(net), currency)}
          </p>
        </div>
      </div>

      {/* Ledger table */}
      <div className="overflow-hidden rounded-2xl bg-white shadow-card dark:bg-slate-800">
        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="animate-spin text-brand-500" size={28} />
          </div>
        ) : rows.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-3 rounded-2xl bg-brand-50 p-4 text-brand-500 dark:bg-brand-500/10">
              <BookOpen size={28} />
            </div>
            <p className="font-medium text-slate-700 dark:text-slate-200">No entries</p>
            <p className="mt-1 text-sm text-slate-400">
              Add transactions to see your ledger.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-left text-xs uppercase tracking-wide text-slate-400 dark:border-slate-700/50">
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Title</th>
                  <th className="px-4 py-3 font-medium">Category</th>
                  <th className="px-4 py-3 text-right font-medium">Debit</th>
                  <th className="px-4 py-3 text-right font-medium">Credit</th>
                  <th className="px-4 py-3 text-right font-medium">Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-700/40">
                {rows.map(({ tx, balance }) => (
                  <tr key={tx.id} className="transition hover:bg-slate-50 dark:hover:bg-slate-700/30">
                    <td className="whitespace-nowrap px-4 py-3 text-slate-500 dark:text-slate-400">
                      {formatDate(tx.date)}
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-100">
                      {tx.title}
                    </td>
                    <td className="px-4 py-3">
                      <span className="rounded-lg bg-slate-100 px-2 py-0.5 text-xs text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                        {tx.category}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-right font-medium text-rose-600">
                      {tx.type === 'expense' ? `−${formatCurrency(tx.amount, currency)}` : '—'}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-right font-medium text-accent-600">
                      {tx.type === 'income' ? `+${formatCurrency(tx.amount, currency)}` : '—'}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-right font-semibold text-slate-800 dark:text-slate-100">
                      {formatCurrency(balance, currency)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-slate-100 font-semibold dark:border-slate-700">
                  <td className="px-4 py-3 text-slate-500 dark:text-slate-400" colSpan={3}>
                    {rows.length} entries
                  </td>
                  <td className="px-4 py-3 text-right text-rose-600">
                    {formatCurrency(totalDebit, currency)}
                  </td>
                  <td className="px-4 py-3 text-right text-accent-600">
                    {formatCurrency(totalCredit, currency)}
                  </td>
                  <td className="px-4 py-3 text-right text-slate-800 dark:text-slate-100">
                    {formatCurrency(net, currency)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
