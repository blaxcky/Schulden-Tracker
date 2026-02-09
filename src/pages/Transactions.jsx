import { useState, useMemo } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Chip from '@mui/material/Chip'
import Stack from '@mui/material/Stack'
import List from '@mui/material/List'
import Divider from '@mui/material/Divider'
import Fab from '@mui/material/Fab'
import AddIcon from '@mui/icons-material/Add'
import InputAdornment from '@mui/material/InputAdornment'
import SearchIcon from '@mui/icons-material/Search'
import TransactionItem from '../components/TransactionItem'
import AddTransactionDialog from '../components/AddTransactionDialog'
import EditTransactionDialog from '../components/EditTransactionDialog'
import ConfirmDialog from '../components/ConfirmDialog'
import { useTransactions } from '../hooks/useTransactions'
import { deleteTransaction } from '../db/operations'
import { formatMonth } from '../utils/format'

export default function Transactions() {
  const transactions = useTransactions()
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [addOpen, setAddOpen] = useState(false)
  const [editTarget, setEditTarget] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)

  const filtered = useMemo(() => {
    let result = transactions
    if (filter !== 'all') {
      result = result.filter((t) => t.type === filter)
    }
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter((t) => t.description?.toLowerCase().includes(q))
    }
    return result
  }, [transactions, filter, search])

  const grouped = useMemo(() => {
    const groups = []
    let currentMonth = ''
    for (const t of filtered) {
      const month = t.date.slice(0, 7)
      if (month !== currentMonth) {
        currentMonth = month
        groups.push({ month, label: formatMonth(month), items: [] })
      }
      groups[groups.length - 1].items.push(t)
    }
    return groups
  }, [filtered])

  const handleDelete = async () => {
    if (deleteTarget) {
      await deleteTransaction(deleteTarget.id)
      setDeleteTarget(null)
    }
  }

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
        Umsätze
      </Typography>

      <TextField
        placeholder="Suchen..."
        size="small"
        fullWidth
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon fontSize="small" />
            </InputAdornment>
          ),
        }}
        sx={{ mb: 1.5 }}
      />

      <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
        {[
          { key: 'all', label: 'Alle' },
          { key: 'expense', label: 'Ausgaben' },
          { key: 'payment', label: 'Rückzahlungen' },
        ].map(({ key, label }) => (
          <Chip
            key={key}
            label={label}
            variant={filter === key ? 'filled' : 'outlined'}
            color={filter === key ? 'primary' : 'default'}
            onClick={() => setFilter(key)}
          />
        ))}
      </Stack>

      {grouped.length === 0 ? (
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
          Keine Transaktionen gefunden
        </Typography>
      ) : (
        grouped.map(({ month, label, items }) => (
          <Box key={month} sx={{ mb: 2 }}>
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
              {label}
            </Typography>
            <List disablePadding sx={{ bgcolor: 'background.paper', borderRadius: 2, border: 1, borderColor: 'divider' }}>
              {items.map((t, i) => (
                <Box key={t.id}>
                  {i > 0 && <Divider />}
                  <TransactionItem
                    transaction={t}
                    onEdit={setEditTarget}
                    onDelete={setDeleteTarget}
                  />
                </Box>
              ))}
            </List>
          </Box>
        ))
      )}

      <Fab
        color="primary"
        onClick={() => setAddOpen(true)}
        sx={{ position: 'fixed', bottom: 72, right: 16 }}
      >
        <AddIcon />
      </Fab>

      <AddTransactionDialog open={addOpen} onClose={() => setAddOpen(false)} />

      <EditTransactionDialog
        open={!!editTarget}
        transaction={editTarget}
        onClose={() => setEditTarget(null)}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        title="Transaktion löschen"
        message={`Möchtest du "${deleteTarget?.description || 'diese Transaktion'}" wirklich löschen?`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </Box>
  )
}
