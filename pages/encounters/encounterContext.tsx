import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from 'react'
import { EncounterT } from '../../models'

export type EncounterContextT = {
  encounters: EncounterT[]
  setEncounters?: Dispatch<SetStateAction<EncounterT[]>>
}

const EncounterContext = createContext<EncounterContextT>({ encounters: [] })

export const useEncounters = () => useContext(EncounterContext)

const EncounterProvider = ({ children }) => {
  const [encounters, setEncounters] = useState<EncounterT[]>([])

  return (
    <EncounterContext.Provider value={{ encounters, setEncounters }}>
      {children}
    </EncounterContext.Provider>
  )
}

export default EncounterProvider
