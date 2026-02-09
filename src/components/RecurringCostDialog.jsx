import { useState, useEffect } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Box from '@mui/material/Box'
import { addRecurringCost, updateRecurringCost } from '../db/operations'

export default function RecurringCostDialog({ open, cost, onClose }) {
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [dayOfMonth, setDayOfMonth] = useState('1')
  const isEdit = !!cost

  useEffect(() => {
    if (cost) {
      setAmount(String(cost.amount))
      setDescription(cost.description)
      setDayOfMonth(String(cost.dayOfMonth))
    } else {
      setAmount('')
      setDescription('')
      setDayOfMonth('1')
    }
  }, [cost])

  const handleSave = async () => {
    if (!amount || Number(amount) <= 0) return
    const day = Math.max(1, Math.min(28, Number(dayOfMonth)))
    if (isEdit) {
      await updateRecurringCost(cost.id, { amount, description, dayOfMonth: day })
    } else {
      await addRecurringCost({ amount, description, dayOfMonth: day })
    }
    onClose()
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs" sx={{ '& .MuiDialog-container': { alignItems: 'flex-start' } }} PaperProps={{ sx: { mt: 4 } }}>
      <DialogTitle>{isEdit ? 'Kosten bearbeiten' : 'Neue wiederkehrende Kosten'}</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField
            label="Beschreibung"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            autoFocus
          />

          <TextField
            label="Betrag"
            type="number"
            inputProps={{ inputMode: 'decimal', min: 0, step: 0.01 }}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            fullWidth
          />

          <TextField
            label="Tag des Monats (1-28)"
            type="number"
            inputProps={{ min: 1, max: 28 }}
            value={dayOfMonth}
            onChange={(e) => setDayOfMonth(e.target.value)}
            fullWidth
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose}>Abbrechen</Button>
        <Button onClick={handleSave} variant="contained" disabled={!amount || Number(amount) <= 0}>
          Speichern
        </Button>
      </DialogActions>
    </Dialog>
  )
}
