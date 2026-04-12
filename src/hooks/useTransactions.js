import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../db/db'

export function useTransactions(personId) {
  const transactions = useLiveQuery(
    () => personId
      ? db.transactions.where('personId').equals(personId).reverse().sortBy('date')
      : Promise.resolve([]),
    [personId]
  )
  return transactions ?? []
}

export function useBalance(personId) {
  return useLiveQuery(async () => {
    if (!personId) return 0
    const all = await db.transactions.where('personId').equals(personId).toArray()
    let balance = 0
    for (const t of all) {
      if (t.type === 'expense') balance += t.amount
      else balance -= t.amount
    }
    return balance
  }, [personId]) ?? 0
}
