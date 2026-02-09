import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../db/db'

export function useTransactions() {
  const transactions = useLiveQuery(
    () => db.transactions.orderBy('date').reverse().toArray(),
    []
  )
  return transactions ?? []
}

export function useBalance() {
  return useLiveQuery(async () => {
    const all = await db.transactions.toArray()
    let balance = 0
    for (const t of all) {
      if (t.type === 'expense') balance += t.amount
      else balance -= t.amount
    }
    return balance
  }, []) ?? 0
}

export function useMonthStats() {
  return useLiveQuery(async () => {
    const now = new Date()
    const prefix = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
    const monthly = await db.transactions
      .where('date')
      .startsWith(prefix)
      .toArray()

    let expenses = 0
    let payments = 0
    for (const t of monthly) {
      if (t.type === 'expense') expenses += t.amount
      else payments += t.amount
    }
    return { expenses, payments }
  }, []) ?? { expenses: 0, payments: 0 }
}
