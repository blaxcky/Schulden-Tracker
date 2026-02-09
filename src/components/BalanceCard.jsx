import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import { formatCurrency } from '../utils/format'

export default function BalanceCard({ balance }) {
  const color = balance > 0 ? 'error.main' : balance < 0 ? 'success.main' : 'text.primary'

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent sx={{ textAlign: 'center', py: 3 }}>
        <Typography variant="body2" color="text.secondary">
          Aktueller Saldo
        </Typography>
        <Typography variant="h3" sx={{ color, fontWeight: 700, mt: 1 }}>
          {formatCurrency(balance)}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {balance > 0 ? 'Mama schuldet dir' : balance < 0 ? 'Du hast Guthaben' : 'Ausgeglichen'}
        </Typography>
      </CardContent>
    </Card>
  )
}
