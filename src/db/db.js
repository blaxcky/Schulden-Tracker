import Dexie from 'dexie'

export const db = new Dexie('SchuldenTracker')

db.version(1).stores({
  transactions: '++id, type, date, createdAt',
  recurringCosts: '++id, active',
  settings: 'key',
})

db.version(2).stores({
  persons: '++id, name',
  transactions: '++id, personId, type, date, createdAt',
  recurringCosts: '++id, personId, active',
  settings: 'key',
}).upgrade(async (tx) => {
  // Create default "Mama" person
  const personId = await tx.table('persons').add({
    name: 'Mama',
    createdAt: new Date().toISOString(),
  })

  // Assign all existing transactions to Mama
  await tx.table('transactions').toCollection().modify((t) => {
    t.personId = personId
  })

  // Assign all existing recurring costs to Mama
  await tx.table('recurringCosts').toCollection().modify((rc) => {
    rc.personId = personId
  })
})
