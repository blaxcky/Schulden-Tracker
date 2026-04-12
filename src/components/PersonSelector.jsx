import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import FormControl from '@mui/material/FormControl'
import Box from '@mui/material/Box'
import { usePersonContext } from '../context/PersonContext'

export default function PersonSelector() {
  const { persons, selectedId, setSelectedId } = usePersonContext()

  if (persons.length <= 1) return null

  return (
    <Box sx={{ px: 2, pt: 2, pb: 0 }}>
      <FormControl fullWidth size="small">
        <Select
          value={selectedId ?? ''}
          onChange={(e) => setSelectedId(e.target.value)}
          displayEmpty
        >
          {persons.map((p) => (
            <MenuItem key={p.id} value={p.id}>
              {p.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  )
}
