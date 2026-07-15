export type TransactionType = 'income' | 'expense'

export const EXPENSE_CATEGORIES = [
  'Food',
  'Shopping',
  'Transport',
  'Entertainment',
  'Bills',
  'Other',
] as const

export type ExpenseCategory = (typeof EXPENSE_CATEGORIES)[number]

export const INCOME_CATEGORIES = ['Salary', 'Freelance', 'Investment', 'Gift', 'Other'] as const
export type IncomeCategory = (typeof INCOME_CATEGORIES)[number]

export interface Profile {
  id: string
  email: string | null
  monthly_savings_goal: number
  currency: string
  created_at: string
}

export interface Transaction {
  id: string
  user_id: string
  title: string
  amount: number
  category: string
  type: TransactionType
  date: string
  created_at: string
}

export interface SavingsGoal {
  id: string
  user_id: string
  name: string
  target: number
  saved: number
  created_at: string
}

export interface TransactionInput {
  title: string
  amount: number
  category: string
  type: TransactionType
  date: string
}
