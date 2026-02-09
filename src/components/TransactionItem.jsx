import { memo } from 'react'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import PaymentIcon from '@mui/icons-material/Payment'
import ListItemIcon from '@mui/material/ListItemIcon'
import { formatCurrency, formatDate } from '../utils/format'

const TransactionItem = memo(function TransactionItem({ transaction, onEdit, onDelete }) {
  const { type, amount, description, date } = transaction
  const isExpense = type === 'expense'

  return (
    <ListItem
      secondaryAction={
        onEdit && onDelete ? (
          <>
            <IconButton size="small" onClick={() => onEdit(transaction)} sx={{ mr: 0.5 }}>
              <EditIcon fontSize="small" />
            </IconButton>
            <IconButton size="small" onClick={() => onDelete(transaction)}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </>
        ) : null
      }
      sx={{ pr: onEdit ? 10 : 2 }}
    >
      <ListItemIcon sx={{ minWidth: 40 }}>
        {isExpense ? (
          <ShoppingCartIcon color="error" fontSize="small" />
        ) : (
          <PaymentIcon color="success" fontSize="small" />
        )}
      </ListItemIcon>
      <ListItemText
        primary={description || (isExpense ? 'Ausgabe' : 'Rückzahlung')}
        secondary={formatDate(date)}
      />
      <Typography
        variant="body2"
        sx={{
          color: isExpense ? 'error.main' : 'success.main',
          fontWeight: 600,
          whiteSpace: 'nowrap',
          ml: 1,
        }}
      >
        {isExpense ? '+' : '-'}{formatCurrency(amount)}
      </Typography>
    </ListItem>
  )
})

export default TransactionItem
