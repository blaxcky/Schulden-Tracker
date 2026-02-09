import { useState, useRef } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction'
import Switch from '@mui/material/Switch'
import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import FileDownloadIcon from '@mui/icons-material/FileDownload'
import FileUploadIcon from '@mui/icons-material/FileUpload'
import CachedIcon from '@mui/icons-material/Cached'
import RecurringCostDialog from '../components/RecurringCostDialog'
import ConfirmDialog from '../components/ConfirmDialog'
import { useRecurringCosts } from '../hooks/useRecurringCosts'
import { toggleRecurringCost, deleteRecurringCost } from '../db/operations'
import { exportData, importData } from '../utils/exportImport'
import { resetCache } from '../utils/serviceWorker'
import { formatCurrency } from '../utils/format'
import usePwaInstall from '../hooks/usePwaInstall'
import InstallMobileIcon from '@mui/icons-material/InstallMobile'

export default function Settings() {
  const recurringCosts = useRecurringCosts()
  const { canInstall, isInstalled, promptInstall } = usePwaInstall()
  const [costDialogOpen, setCostDialogOpen] = useState(false)
  const [editCost, setEditCost] = useState(null)
  const [deleteCost, setDeleteCost] = useState(null)
  const [importConfirm, setImportConfirm] = useState(false)
  const [cacheConfirm, setCacheConfirm] = useState(false)
  const fileInputRef = useRef(null)
  const pendingFileRef = useRef(null)

  const handleEditCost = (cost) => {
    setEditCost(cost)
    setCostDialogOpen(true)
  }

  const handleCloseCostDialog = () => {
    setCostDialogOpen(false)
    setEditCost(null)
  }

  const handleDeleteCost = async () => {
    if (deleteCost) {
      await deleteRecurringCost(deleteCost.id)
      setDeleteCost(null)
    }
  }

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      pendingFileRef.current = file
      setImportConfirm(true)
    }
    e.target.value = ''
  }

  const handleImportConfirm = async () => {
    if (pendingFileRef.current) {
      await importData(pendingFileRef.current)
      pendingFileRef.current = null
    }
    setImportConfirm(false)
  }

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
        Einstellungen
      </Typography>

      {/* Recurring Costs */}
      <Card sx={{ mb: 2 }}>
        <CardContent sx={{ pb: 0, '&:last-child': { pb: 0 } }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Wiederkehrende Kosten
            </Typography>
            <IconButton size="small" onClick={() => setCostDialogOpen(true)}>
              <AddIcon />
            </IconButton>
          </Box>

          {recurringCosts.length === 0 ? (
            <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
              Keine wiederkehrenden Kosten
            </Typography>
          ) : (
            <List disablePadding>
              {recurringCosts.map((cost, i) => (
                <Box key={cost.id}>
                  {i > 0 && <Divider />}
                  <ListItem sx={{ pr: 14 }}>
                    <ListItemText
                      primary={cost.description}
                      secondary={`${formatCurrency(cost.amount)} am ${cost.dayOfMonth}. jeden Monats`}
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        size="small"
                        checked={cost.active === 1}
                        onChange={(e) => toggleRecurringCost(cost.id, e.target.checked)}
                      />
                      <IconButton size="small" onClick={() => handleEditCost(cost)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" onClick={() => setDeleteCost(cost)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                </Box>
              ))}
            </List>
          )}
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Datenverwaltung
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mt: 1 }}>
            <Button
              startIcon={<FileDownloadIcon />}
              variant="outlined"
              onClick={exportData}
              fullWidth
            >
              Daten exportieren
            </Button>
            <Button
              startIcon={<FileUploadIcon />}
              variant="outlined"
              onClick={() => fileInputRef.current?.click()}
              fullWidth
            >
              Daten importieren
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              hidden
              onChange={handleFileSelect}
            />
            <Button
              startIcon={<CachedIcon />}
              variant="outlined"
              color="warning"
              onClick={() => setCacheConfirm(true)}
              fullWidth
            >
              Cache zurücksetzen
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* PWA Install */}
      {(canInstall || isInstalled) && (
        <Card sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              App installieren
            </Typography>
            {isInstalled ? (
              <Typography variant="body2" color="text.secondary">
                Die App ist bereits installiert.
              </Typography>
            ) : (
              <Button
                startIcon={<InstallMobileIcon />}
                variant="outlined"
                onClick={promptInstall}
                fullWidth
              >
                App auf Gerät installieren
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* App Info */}
      <Card>
        <CardContent>
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
            Schulden-Tracker v1.0.0
          </Typography>
        </CardContent>
      </Card>

      {/* Dialogs */}
      <RecurringCostDialog
        open={costDialogOpen}
        cost={editCost}
        onClose={handleCloseCostDialog}
      />

      <ConfirmDialog
        open={!!deleteCost}
        title="Wiederkehrende Kosten löschen"
        message={`Möchtest du "${deleteCost?.description}" wirklich löschen?`}
        onConfirm={handleDeleteCost}
        onCancel={() => setDeleteCost(null)}
      />

      <ConfirmDialog
        open={importConfirm}
        title="Daten importieren"
        message="Alle bestehenden Daten werden überschrieben. Fortfahren?"
        onConfirm={handleImportConfirm}
        onCancel={() => { setImportConfirm(false); pendingFileRef.current = null }}
      />

      <ConfirmDialog
        open={cacheConfirm}
        title="Cache zurücksetzen"
        message="Der App-Cache und Service Worker werden gelöscht. Deine Daten bleiben erhalten. Die App wird neu geladen."
        onConfirm={() => { setCacheConfirm(false); resetCache() }}
        onCancel={() => setCacheConfirm(false)}
      />
    </Box>
  )
}
