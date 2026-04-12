import { db } from '../db/db'

export async function exportData() {
  const persons = await db.persons.toArray()
  const transactions = await db.transactions.toArray()
  const recurringCosts = await db.recurringCosts.toArray()
  const settings = await db.settings.toArray()

  const data = { persons, transactions, recurringCosts, settings, exportedAt: new Date().toISOString() }
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)

  const a = document.createElement('a')
  a.href = url
  a.download = `schulden-tracker-${new Date().toISOString().slice(0, 10)}.json`
  a.click()
  URL.revokeObjectURL(url)
}

export async function importData(file) {
  const text = await file.text()
  const data = JSON.parse(text)

  await db.transaction('rw', db.persons, db.transactions, db.recurringCosts, db.settings, async () => {
    await db.persons.clear()
    await db.transactions.clear()
    await db.recurringCosts.clear()
    await db.settings.clear()

    // Backwards compatibility: if no persons in export, create default "Mama"
    if (data.persons?.length) {
      await db.persons.bulkAdd(data.persons)
    } else {
      const personId = await db.persons.add({ name: 'Mama', createdAt: new Date().toISOString() })
      // Assign personId to imported transactions/recurring costs
      if (data.transactions?.length) {
        data.transactions.forEach((t) => { t.personId = personId })
      }
      if (data.recurringCosts?.length) {
        data.recurringCosts.forEach((rc) => { rc.personId = personId })
      }
    }

    if (data.transactions?.length) await db.transactions.bulkAdd(data.transactions)
    if (data.recurringCosts?.length) await db.recurringCosts.bulkAdd(data.recurringCosts)
    if (data.settings?.length) await db.settings.bulkAdd(data.settings)
  })
}
