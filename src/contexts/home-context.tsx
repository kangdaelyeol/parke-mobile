import { createContext, PropsWithChildren, useContext, useState } from 'react'

interface HomeContextValue {
  scanning: boolean
  setScanning: React.Dispatch<React.SetStateAction<boolean>>
}

const HomeContext = createContext({} as HomeContextValue)

export const HomeProvider = ({ children }: PropsWithChildren) => {
  const [scanning, setScanning] = useState(false)

  return (
    <HomeContext.Provider value={{ scanning, setScanning }}>
      {children}
    </HomeContext.Provider>
  )
}

export const useHomeContext = () => useContext(HomeContext)
