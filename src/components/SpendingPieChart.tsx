import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { formatCurrency } from '../lib/format'

interface CategoryData {
  name: string
  value: number
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4']

interface SpendingPieChartProps {
  data: CategoryData[]
  currency: string
}

export default function SpendingPieChart({ data, currency }: SpendingPieChartProps) {
  if (data.length === 0) {
    return <p className="py-10 text-center text-sm text-slate-400">No spending this month.</p>
  }

  return (
    <div className="flex flex-col items-center gap-6 sm:flex-row">
      <div className="h-48 w-48 shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={45}
              outerRadius={80}
              paddingAngle={2}
            >
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => formatCurrency(Number(value), currency)}
              contentStyle={{
                borderRadius: 12,
                border: 'none',
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <ul className="flex-1 space-y-2">
        {data.map((d, i) => (
          <li key={d.name} className="flex items-center gap-2 text-sm">
            <span
              className="h-3 w-3 shrink-0 rounded-full"
              style={{ background: COLORS[i % COLORS.length] }}
            />
            <span className="flex-1 text-slate-600 dark:text-slate-300">{d.name}</span>
            <span className="font-medium text-slate-800 dark:text-slate-100">
              {formatCurrency(d.value, currency)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
