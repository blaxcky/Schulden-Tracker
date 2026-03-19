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
