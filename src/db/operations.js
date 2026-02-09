import { db } from './db'

// --- Transactions ---

export async function addTransaction({ type, amount, description, date }) {
  return db.transactions.add({
    type,
    amount: Number(amount),
    description: description || '',
    date,
    createdAt: new Date().toISOString(),
  })
}

export async function updateTransaction(id, changes) {
  if (changes.amount !== undefined) changes.amount = Number(changes.amount)
  return db.transactions.update(id, changes)
}

export async function deleteTransaction(id) {
  return db.transactions.delete(id)
}

// --- Recurring Costs ---

export async function addRecurringCost({ amount, description, dayOfMonth }) {
  return db.recurringCosts.add({
    amount: Number(amount),
    description,
    dayOfMonth: Number(dayOfMonth),
    active: 1,
    createdAt: new Date().toISOString(),
  })
}

export async function updateRecurringCost(id, changes) {
  if (changes.amount !== undefined) changes.amount = Number(changes.amount)
  if (changes.dayOfMonth !== undefined) changes.dayOfMonth = Number(changes.dayOfMonth)
  return db.recurringCosts.update(id, changes)
}

export async function deleteRecurringCost(id) {
  return db.recurringCosts.delete(id)
}

export async function toggleRecurringCost(id, active) {
  return db.recurringCosts.update(id, { active: active ? 1 : 0 })
}

// --- Recurring Check ---

export async function processRecurringCosts() {
  const now = new Date()
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`

  const setting = await db.settings.get('lastRecurringCheck')
  if (setting?.value === currentMonth) return // Already processed this month

  const activeCosts = await db.recurringCosts.where('active').equals(1).toArray()

  for (const cost of activeCosts) {
    const day = String(Math.min(cost.dayOfMonth, 28)).padStart(2, '0')
    await db.transactions.add({
      type: 'expense',
      amount: cost.amount,
      description: cost.description,
      date: `${currentMonth}-${day}`,
      createdAt: new Date().toISOString(),
    })
  }

  await db.settings.put({ key: 'lastRecurringCheck', value: currentMonth })
}

// --- Settings ---

export async function getSetting(key) {
  const row = await db.settings.get(key)
  return row?.value
}

export async function setSetting(key, value) {
  return db.settings.put({ key, value })
}
