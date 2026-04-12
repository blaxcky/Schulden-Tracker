import { useState, useEffect } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Box from '@mui/material/Box'
import { addPerson, updatePerson } from '../db/operations'

export default function PersonDialog({ open, person, onClose }) {
  const [name, setName] = useState('')
  const isEdit = !!person

  useEffect(() => {
    if (person) {
      setName(person.name)
    } else {
      setName('')
    }
  }, [person])

  const handleSave = async () => {
    const trimmed = name.trim()
    if (!trimmed) return
    if (isEdit) {
      await updatePerson(person.id, trimmed)
    } else {
      await addPerson(trimmed)
    }
    onClose()
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs" sx={{ '& .MuiDialog-container': { alignItems: 'flex-start' } }} PaperProps={{ sx: { mt: 4 } }}>
      <DialogTitle>{isEdit ? 'Person bearbeiten' : 'Neue Person'}</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 1 }}>
          <TextField
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            autoFocus
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose}>Abbrechen</Button>
        <Button onClick={handleSave} variant="contained" disabled={!name.trim()}>
          Speichern
        </Button>
      </DialogActions>
    </Dialog>
  )
}
