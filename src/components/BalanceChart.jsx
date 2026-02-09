import { useMemo } from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import { useTheme } from '@mui/material/styles'
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts'
import { formatCurrency } from '../utils/format'

export default function BalanceChart({ transactions }) {
  const theme = useTheme()

  const data = useMemo(() => {
    if (!transactions.length) return []

    // Sort by date ascending
    const sorted = [...transactions].sort((a, b) => a.date.localeCompare(b.date))

    // Group by month and compute cumulative balance
    const monthMap = new Map()
    let balance = 0
    for (const t of sorted) {
      const month = t.date.slice(0, 7)
      if (t.type === 'expense') balance += t.amount
      else balance -= t.amount
      monthMap.set(month, balance)
    }

    // Format month labels
    const fmt = new Intl.DateTimeFormat('de-DE', { month: 'short', year: '2-digit' })
    return [...monthMap.entries()].map(([month, bal]) => {
      const [y, m] = month.split('-').map(Number)
      return {
        name: fmt.format(new Date(y, m - 1, 1)),
        saldo: Math.round(bal * 100) / 100,
      }
    })
  }, [transactions])

  if (data.length < 2) return null

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          Saldo-Verlauf
        </Typography>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={data}>
            <XAxis
              dataKey="name"
              tick={{ fontSize: 11, fill: theme.palette.text.secondary }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: theme.palette.text.secondary }}
              axisLine={false}
              tickLine={false}
              width={50}
            />
            <Tooltip
              formatter={(v) => [formatCurrency(v), 'Saldo']}
              contentStyle={{
                background: theme.palette.background.paper,
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 8,
              }}
            />
            <Line
              type="monotone"
              dataKey="saldo"
              stroke={theme.palette.primary.main}
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
