import { useState } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import Box from '@mui/material/Box'
import { addTransaction } from '../db/operations'
import { todayISO } from '../utils/format'

export default function AddTransactionDialog({ open, onClose }) {
  const [type, setType] = useState('expense')
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [date, setDate] = useState(todayISO())

  const handleSave = async () => {
    if (!amount || Number(amount) <= 0) return
    await addTransaction({ type, amount, description, date })
    handleClose()
  }

  const handleClose = () => {
    setType('expense')
    setAmount('')
    setDescription('')
    setDate(todayISO())
    onClose()
  }

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs" sx={{ '& .MuiDialog-container': { alignItems: 'flex-start' } }} PaperProps={{ sx: { mt: 4 } }}>
      <DialogTitle>Neue Transaktion</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <ToggleButtonGroup
            value={type}
            exclusive
            onChange={(_, v) => v && setType(v)}
            fullWidth
            size="small"
          >
            <ToggleButton value="expense" color="error">Ausgabe</ToggleButton>
            <ToggleButton value="payment" color="success">Rückzahlung</ToggleButton>
          </ToggleButtonGroup>

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
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Abbrechen</Button>
        <Button onClick={handleSave} variant="contained" disabled={!amount || Number(amount) <= 0}>
          Speichern
        </Button>
      </DialogActions>
    </Dialog>
  )
}
