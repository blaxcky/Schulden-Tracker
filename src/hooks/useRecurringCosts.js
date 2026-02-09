import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../db/db'

export function useRecurringCosts() {
  const costs = useLiveQuery(() => db.recurringCosts.toArray(), [])
  return costs ?? []
}
