import { useMemo, useState } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { addTransaction, addTransactions } from '../db/operations'
import { usePersonContext } from '../context/PersonContext'
import { todayISO } from '../utils/format'

function parseCsvRows(input, delimiter) {
  const rows = []
  let field = ''
  let row = []
  let inQuotes = false
  let lineNumber = 1
  let rowStartLine = 1

  for (let i = 0; i < input.length; i++) {
    const char = input[i]
    const next = input[i + 1]

    if (char === '"') {
      if (inQuotes && next === '"') {
        field += '"'
        i++
      } else {
        inQuotes = !inQuotes
      }
    } else if (char === delimiter && !inQuotes) {
      row.push(field)
      field = ''
    } else if ((char === '\n' || char === '\r') && !inQuotes) {
      row.push(field)
      if (row.some((value) => value.trim() !== '')) rows.push({ fields: row, lineNumber: rowStartLine })
      row = []
      field = ''

      if (char === '\r' && next === '\n') i++
      lineNumber++
      rowStartLine = lineNumber
    } else {
      field += char
    }
  }

  row.push(field)
  if (row.some((value) => value.trim() !== '')) rows.push({ fields: row, lineNumber: rowStartLine })

  return rows
}

function countDelimiterFields(line, delimiter) {
  let count = 1
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const char = line[i]
    const next = line[i + 1]

    if (char === '"') {
      if (inQuotes && next === '"') i++
      else inQuotes = !inQuotes
    } else if (char === delimiter && !inQuotes) {
      count++
    }
  }

  return count
}

function detectDelimiter(input) {
  const lines = input.split(/\r?\n/).filter((line) => line.trim() !== '').slice(0, 5)
  const delimiters = [',', ';', '\t']

  return delimiters
    .map((delimiter) => ({
      delimiter,
      score: lines.reduce((sum, line) => sum + Math.max(0, countDelimiterFields(line, delimiter) - 1), 0),
    }))
    .sort((a, b) => b.score - a.score)[0]?.delimiter ?? ','
}

function parseAmount(value) {
  const normalized = value.trim().replace(',', '.')
  if (!normalized) return null
  if (!/^\d+(\.\d+)?$/.test(normalized)) return null

  const amount = Number(normalized)
  return amount > 0 ? amount : null
}

function normalizeDate(value) {
  const trimmed = value.trim()
  let year
  let month
  let day

  const isoMatch = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})$/)
  const dotMatch = trimmed.match(/^(\d{2})\.(\d{2})\.(\d{4})$/)
  const slashMatch = trimmed.match(/^(\d{2})\/(\d{2})\/(\d{4})$/)

  if (isoMatch) {
    year = Number(isoMatch[1])
    month = Number(isoMatch[2])
    day = Number(isoMatch[3])
  } else if (dotMatch || slashMatch) {
    const match = dotMatch ?? slashMatch
    day = Number(match[1])
    month = Number(match[2])
    year = Number(match[3])
  } else {
    return null
  }

  const date = new Date(Date.UTC(year, month - 1, day))
  if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) {
    return null
  }

  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

function isHeaderRow(fields) {
  const normalized = fields.map((value) => value.trim().toLowerCase())
  return normalized[0] === 'betrag' && normalized[1] === 'beschreibung' && normalized[2] === 'datum'
}

function parseTransactionsCsv(input) {
  if (!input.trim()) return { transactions: [], errors: [] }

  const delimiter = detectDelimiter(input)
  const rows = parseCsvRows(input, delimiter)
  const dataRows = rows.length > 0 && isHeaderRow(rows[0].fields) ? rows.slice(1) : rows
  const transactions = []
  const errors = []

  for (const row of dataRows) {
    const [amountValue = '', description = '', dateValue = '', ...extraFields] = row.fields
    const rowErrors = []
    const amount = parseAmount(amountValue)
    const date = normalizeDate(dateValue)

    if (row.fields.length < 3) rowErrors.push('zu wenige Spalten')
    if (extraFields.some((value) => value.trim() !== '')) rowErrors.push('zu viele Spalten')
    if (!amount) rowErrors.push('ungültiger Betrag')
    if (!date) rowErrors.push('ungültiges Datum')

    if (rowErrors.length > 0) {
      errors.push({ lineNumber: row.lineNumber, message: rowErrors.join(', ') })
    } else {
      transactions.push({ amount, description: description.trim(), date })
    }
  }

  return { transactions, errors }
}

export default function AddTransactionDialog({ open, onClose }) {
  const { selectedId } = usePersonContext()
  const [type, setType] = useState('expense')
  const [mode, setMode] = useState('single')
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [date, setDate] = useState(todayISO())
  const [csvText, setCsvText] = useState('')

  const csvResult = useMemo(() => parseTransactionsCsv(csvText), [csvText])

  const handleSave = async () => {
    if (!selectedId) return

    if (mode === 'csv') {
      if (csvResult.transactions.length === 0 || csvResult.errors.length > 0) return

      await addTransactions(csvResult.transactions.map((transaction) => ({
        personId: selectedId,
        type: 'expense',
        ...transaction,
      })))
      handleClose()
      return
    }

    if (!amount || Number(amount) <= 0) return
    await addTransaction({ personId: selectedId, type, amount, description, date })
    handleClose()
  }

  const handleClose = () => {
    setType('expense')
    setMode('single')
    setAmount('')
    setDescription('')
    setDate(todayISO())
    setCsvText('')
    onClose()
  }

  const handleTypeChange = (_, value) => {
    if (!value) return
    setType(value)
    if (value === 'payment') setMode('single')
  }

  const saveDisabled = mode === 'csv'
    ? csvResult.transactions.length === 0 || csvResult.errors.length > 0
    : !amount || Number(amount) <= 0

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs" sx={{ '& .MuiDialog-container': { alignItems: 'flex-start' } }} PaperProps={{ sx: { mt: 4 } }}>
      <DialogTitle>Neue Transaktion</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <ToggleButtonGroup
            value={type}
            exclusive
            onChange={handleTypeChange}
            fullWidth
            size="small"
          >
            <ToggleButton value="expense" color="error">Ausgabe</ToggleButton>
            <ToggleButton value="payment" color="success">Rückzahlung</ToggleButton>
          </ToggleButtonGroup>

          {type === 'expense' && (
            <ToggleButtonGroup
              value={mode}
              exclusive
              onChange={(_, value) => value && setMode(value)}
              fullWidth
              size="small"
            >
              <ToggleButton value="single">Einzeln</ToggleButton>
              <ToggleButton value="csv">CSV</ToggleButton>
            </ToggleButtonGroup>
          )}

          {mode === 'csv' ? (
            <>
              <TextField
                label="CSV"
                value={csvText}
                onChange={(e) => setCsvText(e.target.value)}
                fullWidth
                multiline
                minRows={6}
                autoFocus
                placeholder={'betrag,beschreibung,datum\n12.34,Einkauf,2026-06-18'}
              />

              {csvText.trim() && (
                <Box>
                  <Typography variant="body2" color={csvResult.errors.length ? 'error' : 'text.secondary'}>
                    {csvResult.transactions.length} {csvResult.transactions.length === 1 ? 'Ausgabe' : 'Ausgaben'} erkannt
                  </Typography>
                  {csvResult.errors.map((error) => (
                    <Typography key={`${error.lineNumber}-${error.message}`} variant="body2" color="error">
                      Zeile {error.lineNumber}: {error.message}
                    </Typography>
                  ))}
                </Box>
              )}
            </>
          ) : (
            <>
              <TextField
                label="Betrag"
                type="number"
                inputProps={{ inputMode: 'decimal', min: 0, step: 0.01 }}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                fullWidth
                autoFocus
              />

              <TextField
                label="Beschreibung"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                fullWidth
              />

              <TextField
                label="Datum"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </>
          )}
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleClose}>Abbrechen</Button>
        <Button onClick={handleSave} variant="contained" disabled={saveDisabled}>
          Speichern
        </Button>
      </DialogActions>
    </Dialog>
  )
}
