import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../db/db'

export function usePersons() {
  const persons = useLiveQuery(() => db.persons.toArray(), [])
  return persons ?? []
}
