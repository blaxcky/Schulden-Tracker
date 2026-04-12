import { createContext, useContext, useState, useEffect } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../db/db'

const PersonContext = createContext(null)

export function PersonProvider({ children }) {
  const persons = useLiveQuery(() => db.persons.toArray(), []) ?? []
  const [selectedId, setSelectedId] = useState(null)

  // Auto-select first person when persons load or selected person is deleted
  useEffect(() => {
    if (persons.length > 0 && (!selectedId || !persons.find((p) => p.id === selectedId))) {
      setSelectedId(persons[0].id)
    }
  }, [persons, selectedId])

  const selectedPerson = persons.find((p) => p.id === selectedId) ?? null

  return (
    <PersonContext.Provider value={{ persons, selectedPerson, selectedId, setSelectedId }}>
      {children}
    </PersonContext.Provider>
  )
}

export function usePersonContext() {
  const ctx = useContext(PersonContext)
  if (!ctx) throw new Error('usePersonContext must be used within PersonProvider')
  return ctx
}
