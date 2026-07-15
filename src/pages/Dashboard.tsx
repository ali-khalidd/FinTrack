import { useEffect, useMemo, useState } from 'react'
import { Wallet, TrendingUp, TrendingDown, PiggyBank, Loader2 } from 'lucide-react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../context/AuthContext'
import { formatCurrency, getMonthRange, currentMonthLabel } from '../lib/format'
import type { Transaction } from '../types'
import StatCard from '../components/StatCard'
import MonthlySummary from '../components/MonthlySummary'
import SpendingPieChart from '../components/SpendingPieChart'

export default function Dashboard() {
  const { user, profile } = useAuth()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const currency = profile?.currency ?? 'USD'

  useEffect(() => {
    if (!user) return
    let mounted = true
    supabase
      .from('transactions')
      .select('*')
      .order('date', { ascending: false })
      .then(({ data }) => {
        if (!mounted) return
        setTransactions((data as Transaction[]) ?? [])
        setLoading(false)
      })
    return () => {
      mounted = false
    }
  }, [user])

  const stats = useMemo(() => {
    const { start, end } = getMonthRange()
    let income = 0
    let expense = 0
    let totalIncome = 0
    let totalExpense = 0
    const byCategory: Record<string, number> = {}

    for (const tx of transactions) {
      if (tx.type === 'income') totalIncome += tx.amount
      else totalExpense += tx.amount

      if (tx.date >= start && tx.date <= end) {
        if (tx.type === 'income') income += tx.amount
        else {
          expense += tx.amount
          byCategory[tx.category] = (byCategory[tx.category] ?? 0) + tx.amount
        }
      }
    }

    const pieData = Object.entries(byCategory)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)

    return {
      income,
      expense,
      savings: income - expense,
      balance: totalIncome - totalExpense,
      pieData,
      mostSpent: pieData[0]?.name,
    }
  }, [transactions])

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="animate-spin text-brand-500" size={32} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Dashboard</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">{currentMonthLabel()}</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Current Balance" value={formatCurrency(stats.balance, currency)} icon={Wallet} tone="brand" />
        <StatCard label="Income this month" value={formatCurrency(stats.income, currency)} icon={TrendingUp} tone="accent" />
        <StatCard label="Expenses this month" value={formatCurrency(stats.expense, currency)} icon={TrendingDown} tone="rose" />
        <StatCard label="Savings this month" value={formatCurrency(stats.savings, currency)} icon={PiggyBank} tone="amber" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <MonthlySummary
          savings={stats.savings}
          goal={profile?.monthly_savings_goal ?? 0}
          currency={currency}
          monthLabel={currentMonthLabel()}
        />

        <div className="rounded-2xl bg-white p-5 shadow-card dark:bg-slate-800">
          <h3 className="mb-4 font-semibold text-slate-800 dark:text-slate-100">
            Spending Breakdown
          </h3>
          {stats.mostSpent ? (
            <p className="mb-4 rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-600 dark:bg-slate-700/50 dark:text-slate-300">
              You spent the most money on{' '}
              <b className="text-slate-800 dark:text-slate-100">{stats.mostSpent}</b> this month.
            </p>
          ) : null}
          <SpendingPieChart data={stats.pieData} currency={currency} />
        </div>
      </div>
    </div>
  )
}
