import { db } from '../db/db'

export async function exportData() {
  const transactions = await db.transactions.toArray()
  const recurringCosts = await db.recurringCosts.toArray()
  const settings = await db.settings.toArray()

  const data = { transactions, recurringCosts, settings, exportedAt: new Date().toISOString() }
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

  await db.transaction('rw', db.transactions, db.recurringCosts, db.settings, async () => {
    await db.transactions.clear()
    await db.recurringCosts.clear()
    await db.settings.clear()

    if (data.transactions?.length) await db.transactions.bulkAdd(data.transactions)
    if (data.recurringCosts?.length) await db.recurringCosts.bulkAdd(data.recurringCosts)
    if (data.settings?.length) await db.settings.bulkAdd(data.settings)
  })
}
