import Dexie from 'dexie'

export const db = new Dexie('SchuldenTracker')

db.version(1).stores({
  transactions: '++id, type, date, createdAt',
  recurringCosts: '++id, active',
  settings: 'key',
})
