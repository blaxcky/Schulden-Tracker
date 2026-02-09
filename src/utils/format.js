const currencyFmt = new Intl.NumberFormat('de-DE', {
  style: 'currency',
  currency: 'EUR',
})

const dateFmt = new Intl.DateTimeFormat('de-DE', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
})

const monthFmt = new Intl.DateTimeFormat('de-DE', {
  month: 'long',
  year: 'numeric',
})

export function formatCurrency(amount) {
  return currencyFmt.format(amount)
}

export function formatDate(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number)
  return dateFmt.format(new Date(y, m - 1, d))
}

export function formatMonth(dateStr) {
  const [y, m] = dateStr.split('-').map(Number)
  return monthFmt.format(new Date(y, m - 1, 1))
}

export function todayISO() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}
