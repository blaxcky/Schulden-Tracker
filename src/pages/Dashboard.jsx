import { useState, useEffect, lazy, Suspense } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import List from '@mui/material/List'
import Divider from '@mui/material/Divider'
import Fab from '@mui/material/Fab'
import AddIcon from '@mui/icons-material/Add'
import BalanceCard from '../components/BalanceCard'
import TransactionItem from '../components/TransactionItem'
import AddTransactionDialog from '../components/AddTransactionDialog'
import { useTransactions, useBalance, useMonthStats } from '../hooks/useTransactions'
import { processRecurringCosts } from '../db/operations'
import { formatCurrency } from '../utils/format'

const BalanceChart = lazy(() => import('../components/BalanceChart'))

export default function Dashboard() {
  const [dialogOpen, setDialogOpen] = useState(false)
  const transactions = useTransactions()
  const balance = useBalance()
  const { expenses, payments } = useMonthStats()

  useEffect(() => {
    processRecurringCosts()
  }, [])

  const lastFive = transactions.slice(0, 5)

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
        Dashboard
      </Typography>

      <BalanceCard balance={balance} />

      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Dieser Monat
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Box>
              <Typography variant="body2" color="text.secondary">Ausgaben</Typography>
              <Typography variant="h6" color="error.main">{formatCurrency(expenses)}</Typography>
            </Box>
            <Box sx={{ textAlign: 'right' }}>
              <Typography variant="body2" color="text.secondary">Rückzahlungen</Typography>
              <Typography variant="h6" color="success.main">{formatCurrency(payments)}</Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {transactions.length > 0 && (
        <Suspense fallback={null}>
          <BalanceChart transactions={transactions} />
        </Suspense>
      )}

      <Card>
        <CardContent sx={{ pb: 0, '&:last-child': { pb: 0 } }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Letzte Transaktionen
          </Typography>
          {lastFive.length === 0 ? (
            <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
              Noch keine Einträge vorhanden
            </Typography>
          ) : (
            <List disablePadding>
              {lastFive.map((t, i) => (
                <Box key={t.id}>
                  {i > 0 && <Divider />}
                  <TransactionItem transaction={t} />
                </Box>
              ))}
            </List>
          )}
        </CardContent>
      </Card>

      <Fab
        color="primary"
        onClick={() => setDialogOpen(true)}
        sx={{ position: 'fixed', bottom: 72, right: 16 }}
      >
        <AddIcon />
      </Fab>

      <AddTransactionDialog open={dialogOpen} onClose={() => setDialogOpen(false)} />
    </Box>
  )
}
