import { useState, lazy, Suspense } from 'react'
import CircularProgress from '@mui/material/CircularProgress'
import Box from '@mui/material/Box'
import Layout from './components/Layout'

const Dashboard = lazy(() => import('./pages/Dashboard'))
const Transactions = lazy(() => import('./pages/Transactions'))
const Settings = lazy(() => import('./pages/Settings'))

const pages = [Dashboard, Transactions, Settings]

function Loading() {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', pt: 10 }}>
      <CircularProgress />
    </Box>
  )
}

export default function App() {
  const [tab, setTab] = useState(0)
  const Page = pages[tab]

  return (
    <Layout tab={tab} onTabChange={setTab}>
      <Suspense fallback={<Loading />}>
        <Page />
      </Suspense>
    </Layout>
  )
}
