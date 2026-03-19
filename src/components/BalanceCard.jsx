import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import { formatCurrency } from '../utils/format'

export default function BalanceCard({ balance }) {
  const color = balance > 0 ? 'error.main' : balance < 0 ? 'success.main' : 'text.primary'
  const displayBalance = balance < 0 ? Math.abs(balance) : balance

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent sx={{ textAlign: 'center', py: 3 }}>
        <Typography variant="body2" color="text.secondary">
          Aktueller Saldo
        </Typography>
        <Typography variant="h3" sx={{ color, fontWeight: 700, mt: 1 }}>
          {formatCurrency(displayBalance)}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {balance > 0 ? 'Mama schuldet dir' : balance < 0 ? 'Mama hat Guthaben bei dir' : 'Ausgeglichen'}
        </Typography>
      </CardContent>
    </Card>
  )
}
