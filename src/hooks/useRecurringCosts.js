import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../db/db'

export function useRecurringCosts(personId) {
  const costs = useLiveQuery(
    () => personId
      ? db.recurringCosts.where('personId').equals(personId).toArray()
      : Promise.resolve([]),
    [personId]
  )
  return costs ?? []
}
