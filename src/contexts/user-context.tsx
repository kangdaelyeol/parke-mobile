import { Alert } from 'react-native'
import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useState,
} from 'react'
import { CardDto } from '@/domain/card/card-dto'
import { UserDto } from '@/domain/user/user-dto'
import { cardService } from '@/services'
import { userClient } from '@/client'

const isCardList = (v: any): v is CardDto[] => {
  return v !== null
}

interface UserContextValue {
  cards: CardDto[]
  user: UserDto
  setUser: React.Dispatch<React.SetStateAction<UserDto>>
  setCards: React.Dispatch<React.SetStateAction<CardDto[]>>
  syncCardList: () => Promise<void>
  refreshStateSession: () => void
  stateSession: number
}

const userContext = createContext({} as UserContextValue)

export const UserContextProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<UserDto>({
    id: 'uss',
    nickname: 'rkdeofuf',
    phone: '01024130510',
    cardIdList: [],
  })

  const [cards, setCards] = useState<CardDto[]>([])
  const [stateSession, setStateSession] = useState(0)
  const refreshStateSession = () => setStateSession(prev => prev + 1)

  const syncCardList = useCallback(async () => {
    const userNow = await userClient.getById(user.id)
    if (!userNow) return
    const cardList = await cardService.getList(userNow.cardIdList || [])
    if (!isCardList(cardList))
      return Alert.alert(
        'uset context - syncCardList: 카드 정보를 불러오는데 실패했습니다.',
      )
    setCards(cardList)
    setUser(userNow)
  }, [user.id])
  
  return (
    <userContext.Provider
      value={{
        stateSession,
        refreshStateSession,
        cards,
        user,
        setCards,
        setUser,
        syncCardList,
      }}
    >
      {children}
    </userContext.Provider>
  )
}

export const useUserContext = () => useContext(userContext)
